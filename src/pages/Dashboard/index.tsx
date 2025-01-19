import { useEffect, useState } from 'react';
import {
  Container,
  Board,
  BoardTitle,
  Content,
  CardContainer,
  Card,
  CardTitle,
  CardDetail,
  Highlight,
  Title,
  EventInformationsBoard,
  CardInformation,
  CardInformationHeader,
  BoardShirts,
  InformationTitle,
  LotsBoard,
  CardsGroup,
  CardsCountainer,
  TimeContainer,
  TimeTitle,
  TimeResult,
  TimeContainerTitle,
  TimeDiv,
  TimeContainerFooter,
} from './styles';
import EventLogo from '../../assets/event-logo.png';
import api from '../../services/api';
import { useEvent } from '../../contexts/EventContext';
import Navbar from '../../components/navbar';
import { CategoryByEventDTO, LotsByValueDTO, ShirtSizeDTO } from '../../dtos';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getFormatDate } from '../../utils/date';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import CategoryIcon from '@mui/icons-material/Category';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
export const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [lots, setLots] = useState<LotsByValueDTO[]>([]);
  const [eventsCategory, setEventsCategory] = useState<CategoryByEventDTO[]>(
    []
  );
  const [shirts, setShirts] = useState<ShirtSizeDTO[]>([]);
  const { currentEvent } = useEvent();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>('');

  const getCategoryByEvent = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/category/event/${currentEvent}`);
      setEventsCategory(response.data);
    } catch (err) {
      console.error('Erro ao buscar as categorias:', err);
    } finally {
      setLoading(false);
    }
  };

  const getShirtsByAthletes = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/athletes/shirt-size/event/${currentEvent}`
      );
      setShirts(response.data);
    } catch (err) {
      console.error('Erro ao buscar os tamanhos de camisas:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLotsByValue = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/lots/list/${currentEvent}`);
      setLots(response.data);
    } catch (err) {
      console.error('Erro ao buscar os lotes:', err);
    } finally {
      setLoading(false);
    }
  };

  const lotsWithTotal = lots.map((lot, index) => {
    const totalValue =
      lot.payments.reduce((sum, payment) => sum + payment.amount, 0) / 100;
    const totalSold = lot.payments.length;
    return { ...lot, totalValue, totalSold, lotNumber: index + 1 };
  });

  useEffect(() => {
    if (currentEvent) {
      getCategoryByEvent();
      getShirtsByAthletes();
      getLotsByValue();
      getEventStartDate();
    }
  }, [currentEvent]);

  const generateColors = (baseColor: any, numColors: number) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const opacity = 1 - i * 0.2;
      colors.push(`rgba(240,76,18,${opacity.toFixed(2)})`);
    }
    return colors;
  };

  const pieColors = generateColors('#f04c12', lotsWithTotal.length);
  const shirtSizeOrder = ['P', 'M', 'G', 'GG'];
  const totalShirts = shirts.reduce(
    (total, shirt) => total + (Number(shirt.count) || 0),
    0
  );

  const getEventStartDate = async () => {
    try {
      const response = await api.get(`/event`);
      const events = response.data;
      const event = events.find((ev: any) => ev.id === currentEvent);
      if (event) {
        setStartDate(new Date(event.start_date));
      }
    } catch (err) {
      console.error('Erro ao buscar a data de início do evento:', err);
    }
  };

  useEffect(() => {
    if (startDate) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = Math.max(0, (startDate.getTime() - now.getTime()) / 1000);

        const days = Math.floor(diff / (3600 * 24));
        const hours = Math.floor((diff % (3600 * 24)) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = Math.floor(diff % 60);

        setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }, 60);

      return () => clearInterval(interval);
    }
  }, [startDate]);

  const totalSales = lotsWithTotal.reduce((sum, lot) => sum + lot.totalSold, 0);

  return (
    <Container>
      <Navbar />

      <Content>
        <LotsBoard>
          <CardsCountainer>
            <CardsGroup>
              <Card>
                <AccountBalanceWalletIcon color="primary" />
                <CardDetail>
                  <Highlight>{totalSales}</Highlight>
                  <span>Vendas</span>
                </CardDetail>
                <CardDetail>
                  <Highlight>
                    R${' '}
                    {lotsWithTotal
                      .reduce((total, lot) => total + lot.totalValue, 0)
                      .toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </Highlight>
                  <span>Faturamento</span>
                </CardDetail>

                <PieChart width={300} height={350}>
                  <Pie
                    data={lotsWithTotal.map((lot) => ({
                      name: `Lote ${lot.lotNumber} - ${lot.totalSold} vendas - R$ ${lot.totalValue}`,
                      vendas: lot.totalSold,
                      percentage: ((lot.totalSold / totalSales) * 100).toFixed(
                        2
                      ),
                    }))}
                    dataKey="vendas"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#82ca9d"
                    label={({ percentage }) => `${percentage}%`}
                    labelLine={false}
                  >
                    {lots.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Legend layout="vertical" />
                </PieChart>
              </Card>
              <CardContainer>
                {lotsWithTotal.map((lot) => (
                  <Card key={lot.id}>
                    <CardTitle>Lote {lot.lotNumber} </CardTitle>
                    <CardDetail>
                      <Highlight>{getFormatDate(lot.start_date)}</Highlight>
                      <span>Início</span>
                    </CardDetail>
                    <CardDetail>
                      <Highlight>{getFormatDate(lot.end_date)}</Highlight>
                      <span>Término</span>
                    </CardDetail>
                    <CardDetail>
                      <Highlight>
                        R${' '}
                        {lot.totalValue.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Highlight>
                      <span>Faturamento</span>
                    </CardDetail>
                    <CardDetail>
                      <Highlight>{lot.totalSold}</Highlight>
                      <span>Vendas</span>
                    </CardDetail>
                  </Card>
                ))}
              </CardContainer>
            </CardsGroup>
          </CardsCountainer>
          <CardInformation>
            <AccessTimeIcon color="primary" />
            <TimeContainer>
              <TimeContainerTitle>Faltam</TimeContainerTitle>
              <TimeDiv>
                <TimeResult>
                  {remainingTime
                    ? remainingTime.split(' ')[0].replace('d', '')
                    : '--'}
                </TimeResult>
                <TimeTitle>Dias</TimeTitle>
              </TimeDiv>
              <TimeDiv>
                <TimeResult>
                  {remainingTime
                    ? remainingTime.split(' ')[1].replace('h', '')
                    : '--'}
                </TimeResult>
                <TimeTitle>Horas</TimeTitle>
              </TimeDiv>
              <TimeDiv>
                <TimeResult>
                  {remainingTime
                    ? remainingTime.split(' ')[2].replace('m', '')
                    : '--'}
                </TimeResult>
                <TimeTitle>Minutos</TimeTitle>
              </TimeDiv>
              <TimeDiv>
                <TimeResult>
                  {remainingTime
                    ? remainingTime.split(' ')[3].replace('s', '')
                    : '--'}
                </TimeResult>
                <TimeTitle>Segundos</TimeTitle>
              </TimeDiv>
              <TimeContainerFooter>Para o evento começar!</TimeContainerFooter>
            </TimeContainer>
          </CardInformation>
        </LotsBoard>
        <EventInformationsBoard>
          <CardInformation>
            <PersonIcon color="primary" />
            <InformationTitle>
              {eventsCategory.reduce(
                (total, category) => total + category.athlete_number,
                0
              )}
            </InformationTitle>
            <InformationTitle>Atletas</InformationTitle>
          </CardInformation>
          <CardInformation>
            <GroupsIcon color="primary" />
            <InformationTitle>
              {eventsCategory.reduce(
                (total, category) => total + category.teams.length,
                0
              )}
            </InformationTitle>
            <InformationTitle>Equipes</InformationTitle>
          </CardInformation>
          <CardInformation>
            <CategoryIcon color="primary" />
            <InformationTitle>{eventsCategory.length}</InformationTitle>
            <InformationTitle>Categorias</InformationTitle>
          </CardInformation>
          <CardInformation>
            <CheckroomIcon color="primary" />
            <InformationTitle>{totalShirts}</InformationTitle>
            <InformationTitle>Camisas</InformationTitle>
          </CardInformation>
        </EventInformationsBoard>
        <Board>
          <BoardTitle>Categorias e Inscritos</BoardTitle>
          <CardContainer>
            {eventsCategory.map((category) => (
              <Card key={category.id}>
                <CardDetail>
                  <Highlight>{category.name} -</Highlight>
                  <span>
                    {' '}
                    {category.athlete_number === 1 ? 'Individual' : 'Misto'} -
                  </span>
                  <Highlight>{category.teams.length}</Highlight>
                  <span>
                    {category.teams.length > 1 ? 'Equipes' : 'Equipe'} -
                  </span>
                  <Highlight>{category.athlete_number}</Highlight>
                  <span>Atletas</span>
                </CardDetail>

                {/* <CardDetail>
                  <Highlight>{category.teams.length}</Highlight>
                  <span>
                    {category.teams.length > 1 ? 'Equipes' : 'Equipe'} -
                  </span>
                  <Highlight>{category.athlete_number}</Highlight>
                  <span>Atletas</span>
                </CardDetail> */}
              </Card>
            ))}
          </CardContainer>
        </Board>
        <BoardShirts>
          <Board>
            <BoardTitle>Camisas Femininas</BoardTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                width={600}
                height={300}
                data={shirts
                  .filter((shirt) => shirt.gender === 'f')
                  .map((shirt) => ({
                    tamanho: shirt.shirt_size.toUpperCase(),
                    quantidade: shirt.count,
                  }))
                  .sort(
                    (a, b) =>
                      shirtSizeOrder.indexOf(a.tamanho) -
                      shirtSizeOrder.indexOf(b.tamanho)
                  )}
              >
                <XAxis dataKey="tamanho" />
                <YAxis
                  allowDecimals={false}
                  tickCount={
                    Math.max(
                      ...shirts
                        .filter((shirt) => shirt.gender === 'f')
                        .map((shirt) => shirt.count)
                    ) + 1
                  }
                />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#f04c12" />
              </BarChart>
            </ResponsiveContainer>
          </Board>
          <Board>
            <BoardTitle>Camisas Masculinas</BoardTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                width={600}
                height={300}
                data={shirts
                  .filter((shirt) => shirt.gender === 'm')
                  .map((shirt) => ({
                    tamanho: shirt.shirt_size.toUpperCase(),
                    quantidade: shirt.count,
                  }))
                  .sort(
                    (a, b) =>
                      shirtSizeOrder.indexOf(a.tamanho) -
                      shirtSizeOrder.indexOf(b.tamanho)
                  )}
              >
                <XAxis dataKey="tamanho" />
                <YAxis
                  allowDecimals={false}
                  tickCount={
                    Math.max(
                      ...shirts
                        .filter((shirt) => shirt.gender === 'f')
                        .map((shirt) => shirt.count)
                    ) + 1
                  }
                />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#f04c12" />
              </BarChart>
            </ResponsiveContainer>
          </Board>
        </BoardShirts>
      </Content>
    </Container>
  );
};
