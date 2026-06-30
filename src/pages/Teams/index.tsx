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
import AddIcon from '@mui/icons-material/Add';
import InputMask from 'react-input-mask';
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
  athlete_number?: number;
}

interface NewAthlete {
  name: string;
  cpf: string;
  email: string;
  phone_number: string;
  birth_date: string;
  gender: 'm' | 'f';
  shirt_size: string;
}

interface NewTeam {
  name: string;
  box: string;
  category_id: string;
  athletes: NewAthlete[];
}

const SHIRT_SIZES = ['P', 'M', 'G', 'GG'];

const emptyAthlete = (): NewAthlete => ({
  name: '',
  cpf: '',
  email: '',
  phone_number: '',
  birth_date: '',
  gender: 'm',
  shirt_size: 'M',
});

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
  const { currentEvent, getCurrentEventsData } = useEvent();
  const [filterTeam, setFilterTeam] = useState('');
  const [filteredTeams, setFilteredTeams] = useState<TeamDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [refundDialog, setRefundDialog] = useState<{
    open: boolean;
    team: TeamDTO | null;
  }>({ open: false, team: null });
  const [refunding, setRefunding] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTeam, setNewTeam] = useState<NewTeam>({
    name: '',
    box: '',
    category_id: '',
    athletes: [emptyAthlete()],
  });

  const allowFreeRegistration = Boolean(
    getCurrentEventsData?.allow_free_registration
  );

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

  const openCreateDrawer = () => {
    setNewTeam({
      name: '',
      box: '',
      category_id: '',
      athletes: [emptyAthlete()],
    });
    setIsCreateDrawerOpen(true);
  };

  const closeCreateDrawer = () => {
    if (creating) return;
    setIsCreateDrawerOpen(false);
  };

  const handleNewTeamCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    const target = Math.max(Number(category?.athlete_number) || 1, 1);
    setNewTeam((prev) => {
      const athletes = [...prev.athletes];
      while (athletes.length < target) athletes.push(emptyAthlete());
      while (athletes.length > target) athletes.pop();
      return { ...prev, category_id: categoryId, athletes };
    });
  };

  const handleNewAthleteChange = (
    index: number,
    field: keyof NewAthlete,
    value: string
  ) => {
    setNewTeam((prev) => {
      const athletes = prev.athletes.map((athlete, i) =>
        i === index ? { ...athlete, [field]: value } : athlete
      );
      return { ...prev, athletes };
    });
  };

  const createFreeTeam = async () => {
    if (!newTeam.name?.trim() || !newTeam.box?.trim() || !newTeam.category_id) {
      toast.error('Preencha nome do time, box e categoria.');
      return;
    }

    if (
      newTeam.athletes.some(
        (a) => !a.name?.trim() || !a.cpf?.trim() || !a.gender
      )
    ) {
      toast.error('Cada atleta precisa de nome, CPF e gênero.');
      return;
    }

    setCreating(true);
    try {
      await api.post('/teams/free', newTeam);
      toast.success('Dupla cadastrada com sucesso.');
      setIsCreateDrawerOpen(false);
      getTeamsAndCategories();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Erro ao cadastrar dupla.'
      );
    } finally {
      setCreating(false);
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
      toast.success(
        'Time desativado. Lembre de fazer o estorno no painel da Pagar.me.'
      );
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
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ marginBottom: 2, width: '100%' }}
        >
          <TextField
            size="small"
            label="Buscar Time"
            variant="outlined"
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            sx={{ minWidth: 220 }}
          />
          {allowFreeRegistration && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={openCreateDrawer}
            >
              Cadastrar dupla
            </Button>
          )}
        </Stack>

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

      <Drawer
        anchor="right"
        open={isCreateDrawerOpen}
        onClose={closeCreateDrawer}
      >
        <DrawerContainer>
          <DrawerTitle>Cadastrar dupla (sem pagamento)</DrawerTitle>

          <InputLabel>Nome do time</InputLabel>
          <TextField
            size="small"
            value={newTeam.name}
            onChange={(e) =>
              setNewTeam((prev) => ({ ...prev, name: e.target.value }))
            }
            fullWidth
          />

          <InputLabel>Box</InputLabel>
          <TextField
            size="small"
            value={newTeam.box}
            onChange={(e) =>
              setNewTeam((prev) => ({ ...prev, box: e.target.value }))
            }
            fullWidth
          />

          <InputLabel>Categoria</InputLabel>
          <TextField
            select
            size="small"
            value={newTeam.category_id}
            onChange={(e) => handleNewTeamCategoryChange(e.target.value)}
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
                {category.athlete_number
                  ? ` (${category.athlete_number} atleta${
                      category.athlete_number > 1 ? 's' : ''
                    })`
                  : ''}
              </MenuItem>
            ))}
          </TextField>

          <Box mt={3}>
            <Typography variant="subtitle1" mb={1}>
              Atletas
            </Typography>
            {newTeam.athletes.map((athlete, index) => (
              <Box
                key={index}
                sx={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 2,
                  padding: 2,
                  marginBottom: 2,
                }}
              >
                <Typography variant="subtitle2" mb={1}>
                  Atleta {index + 1}
                </Typography>

                <InputLabel>Nome</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  value={athlete.name}
                  onChange={(e) =>
                    handleNewAthleteChange(index, 'name', e.target.value)
                  }
                />

                <InputLabel>CPF</InputLabel>
                <InputMask
                  mask="999.999.999-99"
                  value={athlete.cpf}
                  onChange={(e) =>
                    handleNewAthleteChange(index, 'cpf', e.target.value)
                  }
                >
                  {(inputProps: any) => (
                    <TextField {...inputProps} size="small" fullWidth />
                  )}
                </InputMask>

                <InputLabel>E-mail</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  type="email"
                  value={athlete.email}
                  onChange={(e) =>
                    handleNewAthleteChange(index, 'email', e.target.value)
                  }
                />

                <InputLabel>Telefone</InputLabel>
                <InputMask
                  mask="(99) 99999-9999"
                  value={athlete.phone_number}
                  onChange={(e) =>
                    handleNewAthleteChange(
                      index,
                      'phone_number',
                      e.target.value
                    )
                  }
                >
                  {(inputProps: any) => (
                    <TextField {...inputProps} size="small" fullWidth />
                  )}
                </InputMask>

                <InputLabel>Data de nascimento</InputLabel>
                <TextField
                  size="small"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={athlete.birth_date}
                  onChange={(e) =>
                    handleNewAthleteChange(
                      index,
                      'birth_date',
                      e.target.value
                    )
                  }
                />

                <InputLabel>Gênero</InputLabel>
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={athlete.gender}
                  onChange={(e) =>
                    handleNewAthleteChange(index, 'gender', e.target.value)
                  }
                >
                  <MenuItem value="m">Masculino</MenuItem>
                  <MenuItem value="f">Feminino</MenuItem>
                </TextField>

                <InputLabel>Tamanho da camisa</InputLabel>
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={athlete.shirt_size}
                  onChange={(e) =>
                    handleNewAthleteChange(
                      index,
                      'shirt_size',
                      e.target.value
                    )
                  }
                >
                  {SHIRT_SIZES.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            ))}
          </Box>

          <LoadingButton
            variant="contained"
            color="primary"
            loading={creating}
            onClick={createFreeTeam}
            sx={{ marginTop: 2 }}
          >
            Salvar dupla
          </LoadingButton>
        </DrawerContainer>
      </Drawer>

      <Dialog
        open={refundDialog.open}
        onClose={closeRefundDialog}
        aria-labelledby="refund-dialog-title"
        aria-describedby="refund-dialog-description"
      >
        <DialogTitle id="refund-dialog-title">
          Desativar time?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="refund-dialog-description">
            O time <strong>{refundDialog.team?.name}</strong> será desativado e o
            pagamento marcado como estornado. O estorno em si precisa ser feito
            manualmente no painel da Pagar.me. Essa ação não pode ser desfeita.
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
            Confirmar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
