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
  HeaderContainer,
} from './styles';
import EventLogo from '../../assets/event-logo.png';
import api from '../../services/api';
import { useEvent } from '../../contexts/EventContext';
import Navbar from '../../components/navbar';
import { getFormatDate } from '../../utils/date';
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { CategoryByEventDTO } from '../../dtos';

type PaymentDto = {
  id: string;
  payment_method: string;
  amount: number;
  payment_date: string;
};

type AthleteDto = {
  id: string;
  name: string;
  cpf: string;
};

type TeamsDTO = {
  id: string;
  name: string;
  captain_id: string;
  active: boolean;
  category_id: string;
  category: {
    id: string;
    name: string;
  };
  athletes: AthleteDto[];
  payments: PaymentDto[];
};

export const Payments = () => {
  const [loading, setLoading] = useState(false);
  const [teamList, setTeamsList] = useState<TeamsDTO[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryByEventDTO[]>([]);
  const [categoryFiltered, setCategoryFiltered] = useState('all');
  const { currentEvent } = useEvent();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [filteredTeams, setFilteredTeams] = useState<TeamsDTO[]>([]);
  const [noResults, setNoResults] = useState(false);
  const getRegisteredTeams = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/teams/event/${currentEvent}`);

      setTeamsList(response.data);
    } catch (err) {
      console.error('Erro ao buscar os times inscritos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    setLoading(true);
    console.log(currentEvent);
    try {
      const response = await api.get(`/category/event/${currentEvent}`);

      setCategoryList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentEvent) {
      getRegisteredTeams();
      getCategories();
    }
  }, [currentEvent]);

  const getCaptainData = (team: TeamsDTO) => {
    const captain = team.athletes.find(
      (athlete) => athlete.id === team.captain_id
    );
    return captain || { name: '-', cpf: '-' };
  };

  const getPaymentAmount = (team: TeamsDTO) => {
    return team.payments.length > 0 ? team.payments[0].amount / 100 : 0;
  };

  const getTotalPayments = () => {
    return teamList
      .filter(
        (team) =>
          team.active &&
          (categoryFiltered !== 'all'
            ? team.category_id === categoryFiltered
            : true)
      )
      .reduce((total, team) => {
        const paymentAmount = getPaymentAmount(team);
        return total + paymentAmount;
      }, 0)
      .toFixed(2);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFiltered(event.target.value);
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const applyFilters = () => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      alert('A data final não pode ser menor que a data inicial.');
      return;
    }

    const filtered = teamList.filter((team) => {
      if (!team.active) return false;

      if (categoryFiltered !== 'all' && team.category_id !== categoryFiltered)
        return false;

      if (startDate || endDate) {
        const teamPaymentDate = team.payments[0]?.payment_date
          ? new Date(team.payments[0]?.payment_date)
          : null;
        if (!teamPaymentDate) return false;

        if (startDate && teamPaymentDate < new Date(startDate)) return false;
        if (endDate && teamPaymentDate > new Date(endDate)) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      setNoResults(true);
      setFilteredTeams([]);
    } else {
      setNoResults(false);
      setFilteredTeams(filtered);
    }
  };

  useEffect(() => {
    if (teamList.length > 0) {
      setFilteredTeams(teamList.filter((team) => team.active));
    }
  }, [teamList]);

  return (
    <Container>
      <Navbar />

      <EventImage src={EventLogo} width={318} alt="event logo" />
      <Content>
        <TableContainer>
          <HeaderContainer>
            <Select
              labelId="select-event-label"
              value={categoryFiltered}
              onChange={handleCategoryChange}
              label="Evento"
            >
              {[{ name: 'Todas', id: 'all' }, ...categoryList].map((event) => (
                <MenuItem key={event.id} value={event.id}>
                  {event.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Data Inicial"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate || ''}
              onChange={handleStartDateChange}
              style={{ width: '100%', maxWidth: '200px' }}
            />

            <TextField
              label="Data Final"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate || ''}
              onChange={handleEndDateChange}
              style={{ width: '100%', maxWidth: '200px' }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={applyFilters}
              style={{ height: '100%' }}
            >
              Filtrar
            </Button>
          </HeaderContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Time</Th>
                <Th>Categoria</Th>
                <Th>Pagamento</Th>
                <Th>Valor (R$)</Th>
                <Th>Data</Th>
                <Th style={{ textAlign: 'center' }}>CPF Capitão</Th>
                <Th style={{ textAlign: 'center' }}>Capitão</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {filteredTeams.map((team) => {
                const captain = getCaptainData(team);
                const paymentAmount = getPaymentAmount(team);

                return (
                  <Tr key={team.id}>
                    <Td>
                      <PairName>{team.name}</PairName>
                    </Td>
                    <Td>
                      <PairName>{team?.category?.name}</PairName>
                    </Td>
                    <Td>
                      <PairName>
                        {team?.payments.length > 0
                          ? team?.payments[0]?.payment_method === 'credit_card'
                            ? 'cartåo'
                            : 'pix'
                          : '-'}
                      </PairName>
                    </Td>

                    <Td>
                      <PairName>
                        R${paymentAmount > 0 ? paymentAmount.toFixed(2) : '-'}
                      </PairName>
                    </Td>
                    <Td>
                      <PairName>
                        {team?.payments[0]?.payment_date
                          ? getFormatDate(
                              new Date(team?.payments[0]?.payment_date)
                            )
                          : `-`}
                      </PairName>
                    </Td>
                    <Td style={{ textAlign: 'center' }}>
                      <PairName>{captain.cpf}</PairName>
                    </Td>
                    <Td style={{ textAlign: 'center' }}>
                      <PairName>{captain.name}</PairName>
                    </Td>
                  </Tr>
                );
              })}
              <Tr>
                <Td>
                  <PairName style={{ fontWeight: 'bold' }}>Total</PairName>
                </Td>
                <Td>
                  <PairName style={{ fontWeight: 'bold' }}>
                    R${getTotalPayments()}
                  </PairName>
                </Td>
                <Td colSpan={5}></Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Content>
    </Container>
  );
};
