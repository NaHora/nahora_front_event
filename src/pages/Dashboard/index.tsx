import { useEffect, useState } from 'react';
import {
  Container,
  Table,
  Tr,
  Th,
  Td,
  EventImage,
  Content,
  Tbody,
  Thead,
  PairName,
  TableContainer,
} from './styles';
import EventLogo from '../../assets/event-logo.png';
import api from '../../services/api';
import { useEvent } from '../../contexts/EventContext';
import Navbar from '../../components/navbar';
import { useParams } from 'react-router-dom';
import { CategoryByEventDTO, LotsByValueDTO, ShirtSizeDTO } from '../../dtos';

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
      console.error('Erro ao buscar os times inscritos:', err);
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
      console.error('Erro ao buscar os times inscritos:', err);
    } finally {
      setLoading(false);
    }
  };
  const getLotsByValue = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/lots/list/${currentEvent} `);

      setLots(response.data);
    } catch (err) {
      console.error('Erro ao buscar os times inscritos:', err);
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

  return (
    <Container>
      <Navbar />

      <EventImage src={EventLogo} width={318} alt="event logo" />
      <Content></Content>
    </Container>
  );
};
