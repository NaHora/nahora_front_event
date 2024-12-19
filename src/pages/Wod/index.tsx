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
  TextareaAutosize,
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
  name: string;
  number: string;
  type?: 'REP' | 'FORTIME';
  event_id: string;
};

type ScoreInputDTO = {
  id: string;
  number?: string;
  name?: string;
  type?: 'REP' | 'FORTIME';
  event_id: string;
};

interface StateProps {
  [key: string]: any;
}

export const Wod = () => {
  const { currentEvent } = useEvent();
  const [workoutFiltered, setWorkoutFiltered] = useState('');
  const [categoryFiltered, setCategoryFiltered] = useState('');
  const [categorySelected, setCategorySelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [workoutList, setWorkoutList] = useState<WorkoutDTO[]>([]);
  const [categoryList, setCategoryList] = useState<SelectPropsDTO[]>([]);
  const [wodList, setWod] = useState<ScoreDTO[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [resultSelected, setResultSelected] = useState('');
  const [scoreSelected, setScoreSelected] = useState('');
  const [values, setValues] = useState<ScoreInputDTO>({
    id: '',
    number: '',
    name: '',
    type: 'REP',
    event_id: '',
  });
  const [drawerType, setDrawerType] = useState('');

  const openDrawer = (drawerType: string, item: ScoreInputDTO) => {
    if (drawerType === 'edit') {
      setValues({
        id: item?.id,
        name: item?.name,
        number: item?.number,
        type: item?.type,
        event_id: item?.event_id,
      });
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    } else {
      setValues({
        ...values,
        name: '',
        number: '',
      });
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    }
  };

  const getWod = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/workout`);

      setWod(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWod();
  }, []);

  const postResults = async () => {
    setErrors({});
    setLoading(true);

    try {
      const schema = Yup.object().shape({
        number: Yup.string().required('Numero obrigatório'),
        name: Yup.string().required('Nome obrigatória'),
        type: Yup.string().optional(),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const body = {
        number: values.number,
        name: values.name,
        type: 'REP',
        event_id: currentEvent,
      };

      const response = await api.post(`/workout`, body);
      setErrors({});
      toast.success('Wod criado com sucesso!');
      getWod();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao adicionar o wod, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const putData = async () => {
    const schema = Yup.object().shape({
      name: Yup.string().required('Nome obrigatório'),
      number: Yup.string().optional(),
    });

    await schema.validate(values, {
      abortEarly: false,
    });

    setLoading(true);
    try {
      const { number, name, event_id, type, id } = values;

      const body = {
        event_id,
        type,
        name,
        number,
        workoutId: id,
      };

      await api.put('/workout', body);
      setErrors({});
      toast.success('Resultado atualizado com sucesso!');
      getWod();
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

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const deleteResult = async () => {
    setLoading(true);
    try {
      //desestruturando o estado, pegando os valores que guardamos la, atraves dos inputs

      await api.delete(`/workout/${resultSelected}`);
      toast.success('Wod deletado com sucesso!');
      setOpenDeleteDialog(false);
      getWod();
    } catch (err: any) {
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao adicionar o Wod, tente novamente'
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
        <DialogTitle id="alert-dialog-title">Deseja excluir o wod?</DialogTitle>
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
          <DrawerTitle>Adicionar Wod</DrawerTitle>
          <ResultForm>
            <InputLabel>Wod</InputLabel>
            <TextField
              multiline
              size="small"
              id="outlined-multiline-static"
              onChange={(e) => setValues({ ...values, number: e.target.value })}
              value={values.number}
              error={errors.number}
              variant="outlined"
              helperText={errors.number}
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

            <InputLabel>Nome</InputLabel>
            <TextField
              multiline
              size="small"
              id="outlined-multiline-static"
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              value={values.name}
              error={errors.name}
              variant="outlined"
              helperText={errors.name}
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
          <FilteredContainer></FilteredContainer>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={() =>
              openDrawer('create', {
                id: '',
                event_id: '',
                name: '',
                type: 'REP',
                number: '',
              })
            }
          >
            Adicionar Wod
          </Button>
        </ContentHeader>

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Wod</Th>
                <Th>Nome</Th>
                <Th style={{ textAlign: 'center' }}>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {wodList?.map((score) => (
                <Tr key={score.id}>
                  <Td>
                    <FlexColumnAlignStart>
                      <PairName>{score?.number}</PairName>
                    </FlexColumnAlignStart>
                  </Td>

                  <Td>
                    <TieBreak>{score?.name}</TieBreak>
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
