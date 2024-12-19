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

type PaymentDto = {
  id: string;
  payment_method: string;
  amount: number;
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
  const { currentEvent } = useEvent();

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

  useEffect(() => {
    if (currentEvent) {
      getRegisteredTeams();
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
      .reduce((total, team) => {
        const paymentAmount = getPaymentAmount(team);
        return total + paymentAmount;
      }, 0)
      .toFixed(2);
  };

  return (
    <Container>
      <Navbar />

      <EventImage src={EventLogo} width={318} alt="event logo" />
      <Content>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Time</Th>
                <Th>Valor (R$)</Th>
                <Th style={{ textAlign: 'center' }}>CPF Capitão</Th>
                <Th style={{ textAlign: 'center' }}>Capitão</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {teamList.map((team) => {
                const captain = getCaptainData(team);
                const paymentAmount = getPaymentAmount(team);

                return (
                  <Tr key={team.id}>
                    <Td>
                      <PairName>{team.name}</PairName>
                    </Td>
                    <Td>
                      <PairName>
                        R${paymentAmount > 0 ? paymentAmount.toFixed(2) : '-'}
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
                <Td colSpan={2}></Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Content>
    </Container>
  );
};
