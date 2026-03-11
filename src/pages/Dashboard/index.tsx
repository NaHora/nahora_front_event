import { useEffect, useMemo, useState } from 'react';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useEvent } from '../../contexts/EventContext';
import Navbar from '../../components/navbar';
import {
  CategoryByEventDTO,
  LotsByValueDTO,
  PaymentsDTO,
  ShirtSizeDTO,
} from '../../dtos';
import {
  ActionCard,
  ActionText,
  ActionTitle,
  ActionsGrid,
  Container,
  Content,
  DashboardGrid,
  EmptyState,
  Eyebrow,
  Hero,
  HeroCopy,
  HeroMeta,
  HeroStats,
  HeroSubtitle,
  HeroTitle,
  List,
  ListItem,
  ListItemMeta,
  ListItemTitle,
  MetaPill,
  MiniCard,
  MiniGrid,
  MiniLabel,
  MiniValue,
  Panel,
  PanelSubTitle,
  PanelTitle,
  StatCard,
  StatLabel,
  StatNote,
  StatValue,
} from './styles';
import { getFormatDate } from '../../utils/date';

export const Dashboard = () => {
  const [lots, setLots] = useState<LotsByValueDTO[]>([]);
  const [eventsCategory, setEventsCategory] = useState<CategoryByEventDTO[]>([]);
  const [shirts, setShirts] = useState<ShirtSizeDTO[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>('Sem data definida');
  const { currentEvent, events, getCurrentEventsData } = useEvent();

  useEffect(() => {
    async function loadDashboard() {
      if (!currentEvent) {
        return;
      }

      try {
        const [categoriesResponse, shirtsResponse, lotsResponse] = await Promise.all([
          api.get(`/category/event/${currentEvent}`),
          api.get(`/athletes/shirt-size/event/${currentEvent}`),
          api.get(`/lots/list/${currentEvent}`),
        ]);

        setEventsCategory(categoriesResponse.data);
        setShirts(shirtsResponse.data);
        setLots(lotsResponse.data);

        const current = events.find((event) => event.id === currentEvent);
        setStartDate(current?.start_date ? new Date(current.start_date) : null);
      } catch (error) {
        toast.error('Nao foi possivel carregar o dashboard deste evento.');
      }
    }

    loadDashboard();
  }, [currentEvent, events]);

  useEffect(() => {
    if (!startDate) {
      setRemainingTime('Sem data definida');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, startDate.getTime() - now.getTime());

      if (diff === 0) {
        setRemainingTime('Evento em andamento ou iniciado');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setRemainingTime(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  const lotsWithTotal = useMemo(
    () =>
      lots.map((lot, index) => {
        const totalValue =
          lot.payments.reduce(
            (sum: number, payment: PaymentsDTO) => sum + payment.amount,
            0
          ) / 100;

        return {
          ...lot,
          label: `Lote ${index + 1}`,
          totalValue,
          totalSold: lot.payments.length,
          occupancy:
            lot.max_sales > 0 ? Math.round((lot.payments.length / lot.max_sales) * 100) : 0,
        };
      }),
    [lots]
  );

  const categoryInsights = useMemo(
    () =>
      eventsCategory.map((category) => {
        const teamsCount = category.teams?.length || 0;
        const athletesCount =
          category.teams?.reduce((teamTotal, team) => teamTotal + team.athletes.length, 0) || 0;

        return {
          name: category.name,
          teamsCount,
          athletesCount,
          athlete_number: category.athlete_number,
        };
      }),
    [eventsCategory]
  );

  const shirtInsights = useMemo(
    () =>
      ['P', 'M', 'G', 'GG'].map((size) => ({
        name: size,
        count: shirts
          .filter((shirt) => shirt.shirt_size === size)
          .reduce((total, shirt) => total + Number(shirt.count || 0), 0),
      })),
    [shirts]
  );

  const totalSales = lotsWithTotal.reduce((sum, lot) => sum + lot.totalSold, 0);
  const grossRevenue = lotsWithTotal.reduce((sum, lot) => sum + lot.totalValue, 0);
  const totalTeams = categoryInsights.reduce((sum, item) => sum + item.teamsCount, 0);
  const totalAthletes = categoryInsights.reduce((sum, item) => sum + item.athletesCount, 0);
  const totalCategories = categoryInsights.length;
  const topCategory = [...categoryInsights].sort((a, b) => b.athletesCount - a.athletesCount)[0];
  const strongestLot = [...lotsWithTotal].sort((a, b) => b.totalSold - a.totalSold)[0];
  const mostRequestedShirt = [...shirtInsights].sort((a, b) => b.count - a.count)[0];

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(
        `https://${window.location.hostname}${link}${currentEvent}`
      );
      toast.success('Link copiado.');
    } catch (error) {
      toast.error('Falha ao copiar o link.');
    }
  };

  return (
    <Container>
      <Navbar />

      <Content>
        <Hero>
          <HeroCopy>
            <Eyebrow>Visao geral do evento</Eyebrow>
            <HeroTitle>{getCurrentEventsData?.name || 'Seu evento em foco'}</HeroTitle>
            <HeroSubtitle>
              Uma leitura rapida do ritmo comercial, adesao das categorias e distribuicao
              operacional para guiar as proximas decisoes.
            </HeroSubtitle>
            <HeroMeta>
              <MetaPill>
                {getCurrentEventsData?.start_date
                  ? `Inicio ${getFormatDate(getCurrentEventsData.start_date)}`
                  : 'Inicio nao definido'}
              </MetaPill>
              <MetaPill>
                {getCurrentEventsData?.address || 'Endereco nao definido'}
              </MetaPill>
            </HeroMeta>
          </HeroCopy>

          <HeroStats>
            <StatCard>
              <StatLabel>Contagem regressiva</StatLabel>
              <StatValue>{remainingTime}</StatValue>
              <StatNote>Tempo restante para a abertura do evento.</StatNote>
            </StatCard>
            <StatCard>
              <StatLabel>Receita bruta</StatLabel>
              <StatValue>
                {grossRevenue.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </StatValue>
              <StatNote>{totalSales} vendas distribuidas entre os lotes.</StatNote>
            </StatCard>
            <StatCard>
              <StatLabel>Participacao</StatLabel>
              <StatValue>{totalAthletes}</StatValue>
              <StatNote>{totalTeams} times ativos em {totalCategories} categorias.</StatNote>
            </StatCard>
            <StatCard>
              <StatLabel>Maior demanda</StatLabel>
              <StatValue>{topCategory?.name || 'Sem dados'}</StatValue>
              <StatNote>
                {topCategory
                  ? `${topCategory.athletesCount} atletas concentrados nessa categoria.`
                  : 'Sem movimentacao suficiente para leitura.'}
              </StatNote>
            </StatCard>
          </HeroStats>
        </Hero>

        <ActionsGrid>
          <ActionCard onClick={() => handleCopy('/inscricoes/')}>
            <ContentCopyRoundedIcon />
            <ActionTitle>Link de inscricao</ActionTitle>
            <ActionText>
              Compartilhe a entrada publica do evento para acelerar conversao.
            </ActionText>
          </ActionCard>
          <ActionCard onClick={() => handleCopy('/resultados/')}>
            <QueryStatsRoundedIcon />
            <ActionTitle>Resultados ao vivo</ActionTitle>
            <ActionText>
              Entregue um acesso direto ao painel publico de resultados por bateria.
            </ActionText>
          </ActionCard>
          <ActionCard onClick={() => handleCopy('/rank/')}>
            <EventAvailableRoundedIcon />
            <ActionTitle>Ranking geral</ActionTitle>
            <ActionText>
              Gere o link do ranking consolidado para atletas, boxes e audiencia.
            </ActionText>
          </ActionCard>
        </ActionsGrid>

        <DashboardGrid>
          <Panel>
            <PanelTitle>Performance comercial por lote</PanelTitle>
            <PanelSubTitle>
              Compare receita e volume para enxergar onde o evento ganhou tracao.
            </PanelSubTitle>
            {lotsWithTotal.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={lotsWithTotal}>
                  <XAxis dataKey="label" stroke="#9fb0c8" />
                  <YAxis stroke="#9fb0c8" />
                  <Tooltip
                    contentStyle={{
                      background: '#101826',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 18,
                    }}
                  />
                  <Bar dataKey="totalSold" fill="#f3722c" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="occupancy" fill="#f9c74f" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>Nenhum lote com movimentacao ainda.</EmptyState>
            )}
          </Panel>

          <Panel>
            <PanelTitle>Sinais rapidos</PanelTitle>
            <PanelSubTitle>
              Indicadores sinteticos para leitura operacional sem abrir outras telas.
            </PanelSubTitle>
            <MiniGrid>
              <MiniCard>
                <PaidRoundedIcon />
                <MiniLabel>Melhor lote</MiniLabel>
                <MiniValue>{strongestLot?.label || 'Sem dados'}</MiniValue>
              </MiniCard>
              <MiniCard>
                <Groups2RoundedIcon />
                <MiniLabel>Media por categoria</MiniLabel>
                <MiniValue>
                  {totalCategories > 0 ? Math.round(totalAthletes / totalCategories) : 0} atletas
                </MiniValue>
              </MiniCard>
              <MiniCard>
                <PaletteRoundedIcon />
                <MiniLabel>Tamanho dominante</MiniLabel>
                <MiniValue>{mostRequestedShirt?.name || 'Sem dados'}</MiniValue>
              </MiniCard>
              <MiniCard>
                <QueryStatsRoundedIcon />
                <MiniLabel>Conversao por lote</MiniLabel>
                <MiniValue>{strongestLot?.occupancy || 0}%</MiniValue>
              </MiniCard>
            </MiniGrid>
          </Panel>
        </DashboardGrid>

        <DashboardGrid>
          <Panel>
            <PanelTitle>Categorias com mais densidade</PanelTitle>
            <PanelSubTitle>
              Onde estao seus atletas e como isso se distribui entre os times.
            </PanelSubTitle>
            <List>
              {categoryInsights.length > 0 ? (
                categoryInsights
                  .sort((a, b) => b.athletesCount - a.athletesCount)
                  .slice(0, 5)
                  .map((item) => (
                    <ListItem key={item.name}>
                      <div>
                        <ListItemTitle>{item.name}</ListItemTitle>
                        <ListItemMeta>
                          {item.teamsCount} times • {item.athletesCount} atletas
                        </ListItemMeta>
                      </div>
                      <ListItemMeta>{item.athlete_number} por equipe</ListItemMeta>
                    </ListItem>
                  ))
              ) : (
                <EmptyState>Sem categorias cadastradas para leitura.</EmptyState>
              )}
            </List>
          </Panel>

          <Panel>
            <PanelTitle>Distribuicao de camisetas</PanelTitle>
            <PanelSubTitle>
              Antecipe estoque e producao com base nas preferencias atuais.
            </PanelSubTitle>
            {shirtInsights.some((item) => item.count > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={shirtInsights} layout="vertical">
                  <XAxis type="number" stroke="#9fb0c8" />
                  <YAxis dataKey="name" type="category" stroke="#9fb0c8" />
                  <Tooltip
                    contentStyle={{
                      background: '#101826',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 18,
                    }}
                  />
                  <Bar dataKey="count" fill="#90be6d" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>Sem pedidos de camiseta o suficiente para leitura.</EmptyState>
            )}
          </Panel>
        </DashboardGrid>
      </Content>
    </Container>
  );
};
