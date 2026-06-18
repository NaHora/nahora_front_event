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
import api from '../../services/api';
import { useEvent } from '../../contexts/EventContext';
import Navbar from '../../components/navbar';
import { toast } from 'react-toastify';
import CopyIcon from '@mui/icons-material/CopyAll';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { theme } from '../../styles/global';
import { useResolvedEventLogo } from '../../hooks/useResolvedEventLogo';

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

type DialogState = {
  open: boolean;
  team: TeamsDTO | null;
};

interface StateProps {
  [key: string]: any;
}

export const RegisteredTeams = () => {
  const eventLogo = useResolvedEventLogo();
  const [loading, setLoading] = useState(false);
  const [teamList, setTeamsList] = useState<TeamsDTO[]>([]);
  const [teamFiltered, setteamFiltered] = useState('');
  const [refundDialog, setRefundDialog] = useState<DialogState>({
    open: false,
    team: null,
  });
  const [refunding, setRefunding] = useState(false);
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

  const openRefundDialog = (team: TeamsDTO) => {
    setRefundDialog({ open: true, team });
  };

  const closeRefundDialog = () => {
    if (refunding) return;
    setRefundDialog({ open: false, team: null });
  };

  const confirmRefund = async () => {
    const team = refundDialog.team;
    if (!team) return;

    setRefunding(true);
    try {
      await api.post(`/teams/${team.id}/refund`);
      toast.success('Time desativado e pagamento estornado.');
      setRefundDialog({ open: false, team: null });
      getRegisteredTeams();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          'Erro ao desativar o time e estornar o pagamento.'
      );
    } finally {
      setRefunding(false);
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container>
      <Navbar />
      <EventImage src={eventLogo} width={318} alt="event logo" />
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
                <Th style={{ textAlign: 'center' }}>Ações</Th>
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
                  <Td style={{ textAlign: 'center' }}>
                    {team?.active ? (
                      <Edit onClick={() => openRefundDialog(team)}>
                        <CancelIcon
                          fontSize={isMobile ? 'small' : 'medium'}
                          sx={{ marginRight: '4px' }}
                        />
                        {!isMobile && 'Desistir'}
                      </Edit>
                    ) : (
                      <PairName>-</PairName>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Content>

      <Dialog
        open={refundDialog.open}
        onClose={closeRefundDialog}
        aria-labelledby="refund-dialog-title"
        aria-describedby="refund-dialog-description"
      >
        <DialogTitle id="refund-dialog-title">
          Desativar time e estornar pagamento?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="refund-dialog-description">
            O time <strong>{refundDialog.team?.name}</strong> será desativado e o
            valor pago será estornado ao cliente via Pagar.me. Essa ação não pode
            ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeRefundDialog}
            disabled={refunding}
            sx={{ color: '#fff' }}
          >
            Cancelar
          </Button>
          <LoadingButton
            loading={refunding}
            variant="contained"
            color="error"
            onClick={confirmRefund}
            autoFocus
          >
            Confirmar estorno
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
