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
  Edit,
} from './styles';
import EventLogo from '../../assets/event-logo.png';
import api from '../../services/api';
import { useEvent } from '../../contexts/EventContext';
import Navbar from '../../components/navbar';
import { toast } from 'react-toastify';
import CopyIcon from '@mui/icons-material/CopyAll';
import { useMediaQuery } from '@mui/material';
import { theme } from '../../styles/global';

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
  const { currentEvent } = useEvent();

  const getRegisteredTeams = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/teams/event/${currentEvent}`);

      setTeamsList(response.data);
      setteamFiltered(response.data[0].id);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRegisteredTeams();
  }, [currentEvent]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        'https://' + window.location.hostname + '/inscricoes/' + currentEvent
      );
      toast.success('Copiado com sucesso!');
    } catch (err) {
      console.error('Erro ao copiar o texto: ', err);
      toast.error('Falha ao copiar o texto.');
    }
  };
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container>
      <Navbar />
      <EventImage src={EventLogo} width={318} alt="event logo" />
      <Content>
        <TableContainer>
          <Edit onClick={handleCopy}>
            <CopyIcon
              fontSize={isMobile ? 'small' : 'medium'}
              sx={{ marginRight: '4px' }}
            />
            {!isMobile && 'Copiar Link'}
          </Edit>
          <br />
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
