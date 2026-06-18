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
  Edit,
  DrawerTitle,
  DrawerContainer,
  InputLabel,
  TableContainer,
} from './styles';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import getValidationErrors from '../../utils';
import { theme } from '../../styles/global';
import { LoadingButton } from '@mui/lab';
import Navbar from '../../components/navbar';
import api from '../../services/api';
import { useEvent } from '../../contexts/EventContext';
import { Box } from '@mui/system';
import { AthleteDto } from '../../dtos';
import { useResolvedEventLogo } from '../../hooks/useResolvedEventLogo';

interface TeamDTO {
  id: string;
  active?: boolean;
  name: string;
  box: string;
  category_id: string;
  categoryName?: string;
  athletes: AthleteDto[];
}

interface CategoryDTO {
  id: string;
  name: string;
}

interface StateProps {
  [key: string]: any;
}

export const Teams = () => {
  const eventLogo = useResolvedEventLogo();
  const [loading, setLoading] = useState(false);
  const [teamsList, setTeamsList] = useState<TeamDTO[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [teamselected, setTeamselected] = useState('');
  const [values, setValues] = useState<TeamDTO>({
    id: '',
    name: '',
    box: '',
    category_id: '',
    categoryName: '',
    athletes: [],
  });
  const { currentEvent } = useEvent();
  const [filterTeam, setFilterTeam] = useState('');
  const [filteredTeams, setFilteredTeams] = useState<TeamDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [refundDialog, setRefundDialog] = useState<{
    open: boolean;
    team: TeamDTO | null;
  }>({ open: false, team: null });
  const [refunding, setRefunding] = useState(false);

  const openDrawer = (drawerType: string, item: TeamDTO) => {
    console.log('item', item);
    setValues({
      id: item?.id,
      name: item?.name,
      box: item?.box,
      category_id: item?.category_id,
      categoryName: item?.categoryName,
      athletes: item?.athletes,
    });
    setIsDrawerOpen(true);
  };

  const getTeamsAndCategories = async () => {
    setLoading(true);
    try {
      const [teamsRes, categoriesRes] = await Promise.all([
        api.get(`/teams/event/${currentEvent}`),
        api.get(`/category/event/${currentEvent}`),
      ]);

      const activeTeams = teamsRes.data.filter((team: TeamDTO) => team.active);
      const categoriesData = categoriesRes.data;

      const teamsWithCategory = activeTeams.map((team: TeamDTO) => ({
        ...team,
        categoryName:
          categoriesData.find((cat: CategoryDTO) => cat.id === team.category_id)
            ?.name || 'Sem categoria',
      }));

      setTeamsList(teamsWithCategory);
      setFilteredTeams(teamsWithCategory);
      setCategories(categoriesData); // Salva as categorias no estado
    } catch (err) {
      toast.error('Erro ao buscar times ou categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentEvent) getTeamsAndCategories();
  }, [currentEvent]);

  useEffect(() => {
    setFilteredTeams(
      teamsList.filter((team) =>
        team.name.toLowerCase().includes(filterTeam.toLowerCase())
      )
    );
  }, [filterTeam, teamsList]);

  const putData = async () => {
    const schema = Yup.object().shape({
      name: Yup.string().required('Nome do time obrigatório'),
      box: Yup.string().required('Nome do box obrigatório'),
      category_id: Yup.string().required('Categoria obrigatória'),
    });

    await schema.validate(values, { abortEarly: false });

    setLoading(true);
    try {
      const { id, name, box, category_id } = values;

      const body = {
        teamId: id,
        name,
        box,
        category_id,
      };

      await api.put('/teams', body);
      setErrors({});
      toast.success('Time atualizado com sucesso!');
      setIsDrawerOpen(false);
      getTeamsAndCategories();
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao atualizar o time, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const openRefundDialog = (team: TeamDTO) => {
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
      getTeamsAndCategories();
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

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerContainer>
          <DrawerTitle>Editar Time</DrawerTitle>

          <InputLabel>Nome</InputLabel>
          <TextField
            size="small"
            value={values.name || ''}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            fullWidth
          />
          <InputLabel>Box</InputLabel>
          <TextField
            size="small"
            value={values.box || ''}
            onChange={(e) => setValues({ ...values, box: e.target.value })}
            fullWidth
          />

          <InputLabel>Categoria</InputLabel>
          <TextField
            select
            size="small"
            value={values.category_id || ''}
            onChange={(e) =>
              setValues({ ...values, category_id: e.target.value })
            }
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          <LoadingButton
            variant="contained"
            color="primary"
            loading={loading}
            onClick={putData}
            sx={{ marginTop: 4 }}
          >
            Salvar
          </LoadingButton>
          <Box flexDirection={'column'} mt={4}>
            <Typography mb={2}>Atletas:</Typography>
            {values?.athletes?.map((athlete, index) => (
              <Typography>
                {index + 1} - {athlete?.name}
              </Typography>
            ))}
          </Box>
        </DrawerContainer>
      </Drawer>
      <EventImage src={eventLogo} width={318} alt="event logo" />
      <Content>
        <TextField
          size="small"
          label="Buscar Time"
          variant="outlined"
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          sx={{ marginBottom: 2, alignSelf: 'flex-start' }}
        />

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Time</Th>
                <Th>Box</Th>
                <Th>Categoria</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {filteredTeams?.map((team) => (
                <Tr key={team.id}>
                  <Td>
                    <PairName>{team?.name}</PairName>
                  </Td>
                  <Td>
                    <PairName>{team?.box}</PairName>
                  </Td>
                  <Td>
                    <PairName>{team.categoryName}</PairName>{' '}
                  </Td>

                  <Td>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Edit
                        onClick={() => {
                          openDrawer('edit', team);
                          setTeamselected(team.id);
                        }}
                      >
                        <EditIcon
                          fontSize={isMobile ? 'small' : 'medium'}
                          sx={{ marginRight: '4px' }}
                        />
                        {!isMobile && 'Editar'}
                      </Edit>
                      <Edit onClick={() => openRefundDialog(team)}>
                        <CancelIcon
                          fontSize={isMobile ? 'small' : 'medium'}
                          sx={{ marginRight: '4px' }}
                        />
                        {!isMobile && 'Desistir'}
                      </Edit>
                    </Stack>
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
