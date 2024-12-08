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
import { api } from '../../services/apiClient';

type CategoryDTO = {
  id: string;
  name: string;
};

type PaymentDto = {
  id: string;
  payment_method: string;
};

type AthleteDto = {
  id: string;
  name: string;
};

type TeamsDTO = {
  id: string;
  name: string;
  active: boolean;
  category: CategoryDTO;
  athletes: AthleteDto[];

  payments: PaymentDto[];
};

interface StateProps {
  [key: string]: any;
}

export const RegisteredTeams = () => {
  const [loading, setLoading] = useState(false);
  const [teamList, setTeamsList] = useState<TeamsDTO[]>([]);
  const [teamFiltered, setteamFiltered] = useState('');

  const getRegisteredTeams = async () => {
    setLoading(true);

    try {
      const response = await api.get(
        `/teams/event/1f0fd51d-cd1c-43a9-80ed-00d039571520`
      );

      setTeamsList(response.data);
      setteamFiltered(response.data[0].id);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRegisteredTeams();
  }, []);

  return (
    <Container>
      <EventImage src={EventLogo} width={318} alt="event logo" />
      <Content>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Time</Th>
                <Th>Categoria</Th>
                <Th style={{ textAlign: 'center' }}>Status</Th>
                <Th style={{ textAlign: 'center' }}>Pagamento</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {teamList?.map((team) => (
                <Tr key={team.id}>
                  <Td>
                    {team.athletes.length > 1
                      ? team?.athletes.map((athlete) => (
                          <>
                            <PairName>{athlete.name}</PairName>
                            <br />
                          </>
                        ))
                      : team?.athletes.map((athlete) => (
                          <PairName>{athlete.name}</PairName>
                        ))}
                  </Td>
                  <Td>
                    <PairName>{team?.category?.name}</PairName>
                  </Td>
                  <Td style={{ textAlign: 'center' }}>
                    <PairName>
                      {team?.active === true ? 'Pago' : 'Não Pago'}
                    </PairName>
                  </Td>
                  <Td style={{ textAlign: 'center' }}>
                    <PairName>
                      {team?.payments.length > 0
                        ? team?.payments[0]?.payment_method === 'credit_card'
                          ? 'cartåo'
                          : 'pix'
                        : '-'}
                    </PairName>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Content>
    </Container>
  );
};
