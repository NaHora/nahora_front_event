import { useEffect, useState } from 'react';
import { NumericFormat, PatternFormat } from 'react-number-format';
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
  CompetitorsName,
  FlexRow,
  FlexColumnAlignStart,
  ContentHeader,
  Points,
  TieBreak,
  FilteredContainer,
  FilteredSelect,
  Delete,
  Edit,
  DrawerTitle,
  DrawerContainer,
  InputLabel,
  ResultForm,
  TableContainer,
} from './styles';
import EventLogo from '../../assets/event-logo.png';
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
  TextField,
  useMediaQuery,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import getValidationErrors from '../../utils';
import { secondToTimeFormater, timeToSecondFormater } from '../../utils/time';
import { theme } from '../../styles/global';
import { LoadingButton } from '@mui/lab';
import Navbar from '../../components/navbar';
import api from '../../services/api';
import { useEvent } from '../../contexts/EventContext';

type SelectPropsDTO = {
  id: string;
  name: string;
  category_id?: string;
  event_id?: string;
};

type WorkoutDTO = {
  event_id: string;
  id: string;
  name: string;
  number: string;
  type: 'REP' | 'FORTIME';
};

type ScoreDTO = {
  id: string;
  team_id: string;
  score: number;
  tieBreak: string;
  workout_id: string;
  team?: TeamDTO;
};

type ScoreInputDTO = {
  id: string;
  team_id: string;
  score?: number | string;
  tieBreak: string;
  workout_id: string;
  team?: TeamDTO;
};

type TeamDTO = {
  category_id: string;
  id: string;
  name: string;
  athletes: AthleteDTO[];
};

type AthleteDTO = {
  team_id: string;
  id: string;
  name: string;
};

interface StateProps {
  [key: string]: any;
}

export const Panel = () => {
  const { currentEvent } = useEvent();
  const [workoutFiltered, setWorkoutFiltered] = useState('');
  const [categoryFiltered, setCategoryFiltered] = useState('');
  const [categorySelected, setCategorySelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [workoutList, setWorkoutList] = useState<WorkoutDTO[]>([]);
  const [categoryList, setCategoryList] = useState<SelectPropsDTO[]>([]);
  const [teamList, setTeamList] = useState<SelectPropsDTO[]>([]);
  const [scoreList, setScoreList] = useState<ScoreDTO[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [resultSelected, setResultSelected] = useState('');
  const [scoreSelected, setScoreSelected] = useState('');
  const [values, setValues] = useState<ScoreInputDTO>({
    id: '',
    team_id: '',
    score: '',
    tieBreak: '',
    workout_id: '',
  });
  const [drawerType, setDrawerType] = useState('');

  const openDrawer = (drawerType: string, item: ScoreInputDTO) => {
    if (drawerType === 'edit') {
      setValues({
        id: item?.id,
        team_id: item?.team_id,
        score:
          getWorkoutById(item?.workout_id) === 'FORTIME'
            ? secondToTimeFormater(item?.score!)
            : Number(item?.score),
        tieBreak: secondToTimeFormater(item?.tieBreak),
        workout_id: item?.workout_id,
      });
      setCategorySelected(item?.team?.category_id as string);
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    } else {
      setValues({
        ...values,
        team_id: '',
        score: '',
        tieBreak: '',
      });
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    }
  };

  const getScore = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/score/event/${currentEvent}`);

      setScoreList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getWorkout = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/workout/event/${currentEvent}`);

      setWorkoutList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/category/event/${currentEvent}`);

      setCategoryList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getTeams = async () => {
    setLoading(true);

    try {
      const response = await api.get(
        `/teams/listByCategory/${categorySelected}`
      );

      setTeamList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkout();
    getCategories();
    getScore();
  }, [currentEvent]);

  useEffect(() => {
    if (categorySelected) {
      getTeams();
    }
  }, [categorySelected]);

  const postResults = async () => {
    setErrors({});
    setLoading(true);

    try {
      const schema = Yup.object().shape({
        workout_id: Yup.string().required('Workout obrigatório'),
        score:
          getWorkoutById(values.workout_id) === 'FORTIME'
            ? Yup.string().required('Score obrigatório')
            : Yup.number().required('Score obrigatório'),
        team_id: Yup.string().required('Dupla obrigatória'),
        tieBreak: Yup.string().optional(),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const body = {
        score:
          getWorkoutById(values.workout_id) === 'FORTIME'
            ? timeToSecondFormater(values.score as string)
            : values.score,
        tieBreak: timeToSecondFormater(values.tieBreak),
        team_id: values.team_id,
        workout_id: values.workout_id,
      };

      const response = await api.post(`/score`, body);
      setErrors({});
      toast.success('Resultado criado com sucesso!');
      getScore();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao adicionar o resultado, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const putData = async () => {
    const schema = Yup.object().shape({
      score:
        getWorkoutById(values.workout_id) === 'FORTIME'
          ? Yup.string().required('Score obrigatório')
          : Yup.number().required('Score obrigatório'),

      tieBreak: Yup.string().optional(),
    });

    await schema.validate(values, {
      abortEarly: false,
    });

    setLoading(true);
    try {
      const { tieBreak, score } = values;

      const body = {
        scoreId: scoreSelected,
        tieBreak: timeToSecondFormater(tieBreak),
        score:
          getWorkoutById(values.workout_id) === 'FORTIME'
            ? timeToSecondFormater(score as string)
            : score,
      };

      await api.put('/score', body);
      setErrors({});
      toast.success('Resultado atualizado com sucesso!');
      getScore();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao atualizar o resultado, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutById = (currentWorkoutId: string) => {
    const workoutType = workoutList.find(
      (workout) => currentWorkoutId === workout.id
    );

    return workoutType?.type;
  };

  const filterScore = () => {
    if (workoutFiltered && categoryFiltered) {
      return scoreList
        ?.filter(
          (currentScore) =>
            workoutFiltered && currentScore.workout_id === workoutFiltered
        )

        ?.filter(
          (currentScore) =>
            categoryFiltered &&
            currentScore.team?.category_id === categoryFiltered
        );
    } else if (workoutFiltered && !categoryFiltered) {
      return scoreList?.filter(
        (currentScore) =>
          workoutFiltered && currentScore.workout_id === workoutFiltered
      );
    } else if (!workoutFiltered && categoryFiltered) {
      return scoreList?.filter(
        (currentScore) =>
          categoryFiltered &&
          currentScore.team?.category_id === categoryFiltered
      );
    } else {
      return scoreList;
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const deleteResult = async () => {
    setLoading(true);
    try {
      //desestruturando o estado, pegando os valores que guardamos la, atraves dos inputs

      await api.delete(`/score/${resultSelected}`);
      toast.success('Resultado deletado com sucesso!');
      setOpenDeleteDialog(false);
      getScore();
    } catch (err: any) {
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao adicionar o resultado, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (item_id: string) => {
    setResultSelected(item_id);
    setOpenDeleteDialog(true);
  };

  return (
    <Container>
      <Navbar />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Deseja excluir o resultado?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Essa ação é irreversível, ao deletar não será possível desfazer.
            Você deseja apagar mesmo assim?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ color: '#fff' }}
          >
            Cancelar
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={deleteResult}
            autoFocus
          >
            Confirmar
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerContainer>
          <DrawerTitle>Adicionar Resultados</DrawerTitle>
          <ResultForm>
            <InputLabel>Workout</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              onChange={(e) =>
                setValues({ ...values, workout_id: e.target.value })
              }
              value={values.workout_id}
              error={errors.workout_id}
              variant="outlined"
              helperText={errors.workout_id}
              disabled={drawerType === 'edit'}
              select
              sx={{
                width: '100%',
                borderRadius: '10px',
              }}
              InputProps={{
                style: {
                  borderRadius: '10px',
                  backgroundColor: '#121214',
                },
              }}
            >
              {workoutList?.map((workout) => {
                return (
                  <MenuItem key={workout.id} value={workout.id}>
                    {workout.number} - {workout.name}
                  </MenuItem>
                );
              })}
            </TextField>

            <InputLabel>Categoria</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              value={categorySelected}
              onChange={(e) => setCategorySelected(e.target.value)}
              variant="outlined"
              disabled={drawerType === 'edit'}
              select
              sx={{
                width: '100%',
                borderRadius: '10px',
              }}
              InputProps={{
                style: {
                  borderRadius: '10px',
                  backgroundColor: '#121214',
                },
              }}
            >
              {categoryList?.map((category) => {
                return (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                );
              })}
            </TextField>

            <InputLabel>Time</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              onChange={(e) =>
                setValues({ ...values, team_id: e.target.value })
              }
              value={values.team_id}
              error={errors.team_id}
              variant="outlined"
              helperText={errors.team_id}
              disabled={drawerType === 'edit'}
              select
              sx={{
                width: '100%',
                borderRadius: '10px',
              }}
              InputProps={{
                style: {
                  borderRadius: '10px',
                  backgroundColor: '#121214',
                },
              }}
            >
              {teamList?.map((team) => {
                return (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                );
              })}
            </TextField>

            <InputLabel>Score</InputLabel>
            {getWorkoutById(values.workout_id) === 'FORTIME' ? (
              <PatternFormat
                customInput={TextField}
                type="text"
                format="##:##"
                allowEmptyFormatting
                mask="_"
                id="outlined-basic"
                label=""
                size="small"
                onChange={(e) =>
                  setValues({ ...values, score: e.target.value })
                }
                value={values.score}
                error={errors.score}
                variant="outlined"
                helperText={errors.score}
                sx={{
                  width: '100%',
                  borderRadius: '10px',
                }}
                InputProps={{
                  style: {
                    borderRadius: '10px',
                    backgroundColor: '#121214',
                  },
                }}
              />
            ) : (
              <NumericFormat
                customInput={TextField}
                decimalScale={2}
                decimalSeparator=","
                thousandSeparator="."
                onValueChange={(e) => {
                  setValues({ ...values, score: e.floatValue });
                }}
                id="outlined-basic"
                label=""
                size="small"
                value={values.score}
                error={errors.score}
                variant="outlined"
                helperText={errors.score}
                sx={{
                  width: '100%',
                  borderRadius: '10px',
                }}
                InputProps={{
                  style: {
                    borderRadius: '10px',
                    backgroundColor: '#121214',
                  },
                }}
              />
            )}

            <InputLabel>Tie-Break</InputLabel>
            <PatternFormat
              customInput={TextField}
              format="##:##"
              allowEmptyFormatting
              mask="_"
              id="outlined-basic"
              label=""
              size="small"
              onChange={(e) =>
                setValues({ ...values, tieBreak: e.target.value })
              }
              value={values.tieBreak}
              error={errors.tieBreak}
              variant="outlined"
              helperText={errors.tieBreak}
              sx={{
                width: '100%',
                borderRadius: '10px',
              }}
              InputProps={{
                style: {
                  borderRadius: '10px',
                  backgroundColor: '#121214',
                },
              }}
            />

            <LoadingButton
              variant="contained"
              color="primary"
              size="large"
              style={{
                marginTop: isMobile ? '24px' : '60px',
                borderRadius: '10px',
              }}
              fullWidth
              loading={loading}
              onClick={drawerType === 'edit' ? putData : postResults}
            >
              {drawerType === 'edit' ? 'Editar' : 'Adicionar'}
            </LoadingButton>
          </ResultForm>
        </DrawerContainer>
      </Drawer>

      <EventImage src={EventLogo} width={318} alt="event logo" />
      <Content>
        <ContentHeader>
          <FilteredContainer>
            <FilteredSelect>
              <InputLabel style={{ marginTop: 0 }}>Workout:</InputLabel>
              <TextField
                id="outlined-basic"
                label=""
                size="small"
                onChange={(e) => setWorkoutFiltered(e.target.value)}
                value={workoutFiltered}
                variant="outlined"
                select
                sx={{
                  width: '250px',
                  borderRadius: '10px',
                }}
                InputProps={{
                  style: {
                    borderRadius: '10px',
                    backgroundColor: '#121214',
                  },
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                {workoutList.map((workout) => {
                  return (
                    <MenuItem key={workout.id} value={workout.id}>
                      {workout.number} - {workout.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </FilteredSelect>
            <FilteredSelect>
              <InputLabel style={{ marginTop: 0 }}>Categorias:</InputLabel>
              <TextField
                id="outlined-basic"
                label=""
                size="small"
                onChange={(e) => setCategoryFiltered(e.target.value)}
                value={categoryFiltered}
                variant="outlined"
                select
                sx={{
                  width: '250px',
                  borderRadius: '10px',
                }}
                InputProps={{
                  style: {
                    borderRadius: '10px',
                    backgroundColor: '#121214',
                  },
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                {categoryList.map((category) => {
                  return (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </FilteredSelect>
          </FilteredContainer>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={() =>
              openDrawer('create', {
                id: '',
                team_id: '',
                score: 0,
                tieBreak: '',
                workout_id: '',
              })
            }
          >
            Adicionar Resultados
          </Button>
        </ContentHeader>

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Equipe</Th>
                <Th>Score</Th>
                <Th>Tie Break</Th>
                <Th style={{ textAlign: 'center' }}>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {filterScore()?.map((score) => (
                <Tr key={score.id}>
                  <Td>
                    <FlexColumnAlignStart>
                      <PairName>{score?.team?.name}</PairName>
                      <CompetitorsName>
                        {score?.team?.athletes
                          .map((athlete) => athlete.name.split(' ')[0]) // Pega apenas o primeiro nome
                          .join(' / ')}
                      </CompetitorsName>
                    </FlexColumnAlignStart>
                  </Td>
                  <Td>
                    <Points>
                      {getWorkoutById(score.workout_id) === 'FORTIME'
                        ? secondToTimeFormater(score?.score)
                        : score?.score}
                    </Points>
                  </Td>
                  <Td>
                    <TieBreak>{secondToTimeFormater(score?.tieBreak)}</TieBreak>
                  </Td>
                  <Td>
                    <FlexRow>
                      <Delete
                        onClick={() => {
                          openDialog(score.id);
                        }}
                      >
                        <DeleteForeverIcon
                          fontSize={isMobile ? 'small' : 'medium'}
                          sx={{ marginRight: '4px' }}
                        />
                        {!isMobile && 'Excluir'}
                      </Delete>
                      <Edit
                        onClick={() => {
                          openDrawer('edit', score);
                          setScoreSelected(score.id);
                        }}
                      >
                        <EditIcon
                          fontSize={isMobile ? 'small' : 'medium'}
                          sx={{ marginRight: '4px' }}
                        />
                        {!isMobile && 'Editar'}
                      </Edit>
                    </FlexRow>
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
