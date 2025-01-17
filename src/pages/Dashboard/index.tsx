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

export const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [lots, setLots] = useState<LotsByValueDTO[]>([]);
  const [eventsCategory, setEventsCategory] = useState<CategoryByEventDTO[]>(
    []
  );
  const [shirts, setShirts] = useState<ShirtSizeDTO[]>([]);
  const { currentEvent } = useEvent();

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

  useEffect(() => {
    if (currentEvent) {
      getCategoryByEvent();
      getShirtsByAthletes();
      getLotsByValue();
    }
  }, [currentEvent]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ffbb28'];
  const shirtSizeOrder = ['P', 'M', 'G', 'GG'];

  return (
    <Container>
      <Navbar />

      <img src={EventLogo} alt="Event Logo" width={318} />

      <Content>
        {/* Primeiro Board - Categorias e Inscritos */}
        <Board>
          <BoardTitle>Categorias e Inscritos</BoardTitle>
          <CardContainer>
            {eventsCategory.map((category) => (
              <Card key={category.id}>
                <CardTitle>{category.name}</CardTitle>
                <CardDetail>
                  <span>
                    {category.athlete_number === 1 ? 'Individual' : 'Misto'}
                  </span>
                </CardDetail>
                <CardDetail>
                  <Highlight>{category.athlete_number}</Highlight>
                  <span>Atletas</span>
                </CardDetail>
                <CardDetail>
                  <Highlight>{category.teams.length}</Highlight>
                  <span>Equipes</span>
                </CardDetail>
              </Card>
            ))}
          </CardContainer>
        </Board>
        {/* Segundo Board - Vendas por Lote */}
        <Board>
          <BoardTitle>Vendas por Lote</BoardTitle>
          <PieChart width={400} height={400}>
            <Pie
              data={lots.map((lot) => ({
                name: `Lote ${lot.id}`,
                vendas: lot.max_sales,
              }))}
              dataKey="vendas"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#82ca9d"
              label
            >
              {lots.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </Board>
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
      </Content>
    </Container>
  );
};
