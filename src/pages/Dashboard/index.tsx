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
  EventInformationsBoard,
  LotsBoard,
  CardsGroup,
  CardsCountainer,
  TimeContainer,
  TimeTitle,
  TimeResult,
  TimeContainerTitle,
  TimeDiv,
  CategoryAndShirtsContainer,
  CategoryContainer,
  ShirtsContainer,
  CategoryCard,
  CardTime,
  ShirtsInformationsBoard,
} from './styles';
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getFormatDate } from '../../utils/date';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import CategoryIcon from '@mui/icons-material/Category';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BoyIcon from '@mui/icons-material/Boy';
import WomanIcon from '@mui/icons-material/Woman';
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
      lot.payments.reduce(
        (sum: number, payment: PaymentsDTO) => sum + payment.amount,
        0
      ) / 100;
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

  const totalMaleShirts = shirts
    .filter((shirt) => shirt.gender === 'm')
    .reduce((total, shirt) => total + (Number(shirt.count) || 0), 0);

  const totalFemaleShirts = shirts
    .filter((shirt) => shirt.gender === 'f')
    .reduce((total, shirt) => total + (Number(shirt.count) || 0), 0);

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
          <CardTime>
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
              {/* <TimeContainerFooter>Para o evento começar!</TimeContainerFooter> */}
            </TimeContainer>
          </CardTime>
        </LotsBoard>

        <CategoryAndShirtsContainer>
          <CategoryContainer>
            <EventInformationsBoard>
              <Card>
                <PersonIcon color="primary" />
                <CardDetail>
                  <Highlight>
                    {eventsCategory.reduce(
                      (total, category) => total + category.athlete_number,
                      0
                    )}
                  </Highlight>
                  <span>Atletas</span>
                </CardDetail>
              </Card>
              <Card>
                <GroupsIcon color="primary" />
                <CardDetail>
                  <Highlight>
                    {eventsCategory.reduce(
                      (total, category) => total + category.teams.length,
                      0
                    )}
                  </Highlight>
                  <span>Equipes</span>
                </CardDetail>
              </Card>
              <Card>
                <CategoryIcon color="primary" />
                <CardDetail>
                  <Highlight>{eventsCategory.length}</Highlight>
                  <span>Categorias</span>
                </CardDetail>
              </Card>
            </EventInformationsBoard>
            <CardContainer>
              {eventsCategory.map((category) => (
                <CategoryCard key={category.id}>
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
                </CategoryCard>
              ))}
            </CardContainer>
          </CategoryContainer>
          <ShirtsContainer>
            <ShirtsInformationsBoard>
              <Card>
                <CheckroomIcon color="primary" />
                <CardDetail>
                  <Highlight>{totalShirts}</Highlight>
                  <span>Camisas</span>
                </CardDetail>
              </Card>
              <Card>
                <BoyIcon color="primary" />
                <CardDetail>
                  <Highlight>{totalMaleShirts}</Highlight>
                  <span>Masculinas</span>
                </CardDetail>
              </Card>
              <Card>
                <WomanIcon color="primary" />
                <CardDetail>
                  <Highlight>{totalFemaleShirts}</Highlight>
                  <span>Femininas</span>
                </CardDetail>
              </Card>
            </ShirtsInformationsBoard>

            <Board>
              <BoardTitle>Masculinas</BoardTitle>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  width={400}
                  height={200}
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
                  <Bar dataKey="quantidade" fill="#f04c12" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Board>
            <Board>
              <BoardTitle>Femininas</BoardTitle>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  width={400}
                  height={200}
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
                  <Bar dataKey="quantidade" fill="#f04c12" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Board>
          </ShirtsContainer>
        </CategoryAndShirtsContainer>
      </Content>
    </Container>
  );
};
