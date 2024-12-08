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
import { api } from '../../services/apiClient';

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
  pair_id: string;
  score: number;
  tieBreak: string;
  workout_id: string;
  pair?: PairDTO;
};

type ScoreInputDTO = {
  id: string;
  pair_id: string;
  score?: number | string;
  tieBreak: string;
  workout_id: string;
  pair?: PairDTO;
};

type PairDTO = {
  category_id: string;
  first_member: string;
  id: string;
  name: string;
  second_member: string;
};

interface StateProps {
  [key: string]: any;
}

export const PairCreate = () => {
  const [categorySelected, setCategorySelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<SelectPropsDTO[]>([]);
  const [categoryFiltered, setCategoryFiltered] = useState('');
  const [pairList, setPairList] = useState<PairDTO[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [pairSelected, setPairSelected] = useState('');
  const [values, setValues] = useState<PairDTO>({
    id: '',
    first_member: '',
    second_member: '',
    category_id: '',
    name: '',
  });
  const [drawerType, setDrawerType] = useState('');

  const openDrawer = (drawerType: string, item: PairDTO) => {
    if (drawerType === 'edit') {
      setValues({
        id: item?.id,
        first_member: item?.first_member,
        second_member: item?.second_member,
        category_id: item?.category_id,
        name: item?.name,
      });
      setCategorySelected(item?.category_id as string);
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    } else {
      setValues({
        ...values,
        first_member: '',
        second_member: '',
        name: '',
      });
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    }
  };

  const getCategories = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/category`);

      setCategoryList(response.data);
      setCategoryFiltered(response.data[0].id);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getPairs = async () => {
    setLoading(true);

    try {
      const response = await api.get(
        `/pair/listByCategory/${categoryFiltered}`
      );

      setPairList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categoryFiltered) {
      getPairs();
    }
  }, [categoryFiltered]);

  const postPair = async () => {
    setErrors({});
    setLoading(true);

    try {
      const schema = Yup.object().shape({
        // first_member: Yup.string().required('Membro 1 obrigatório'),
        // second_member: Yup.string().required('Membro 1 obrigatório'),
        name: Yup.string().required('Nome da dupla obrigatório'),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const body = {
        first_member: values?.first_member,
        second_member: values?.second_member,
        name: values?.name,
        category_id: values?.category_id,
      };

      const response = await api.post(`/pair`, body);
      setErrors({});
      toast.success('Dupla criada com sucesso!');
      getPairs();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao adicionar a dupla, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const putData = async () => {
    const schema = Yup.object().shape({
      name: Yup.string().required('Nome da dupla obrigatório'),
    });

    await schema.validate(values, {
      abortEarly: false,
    });

    setLoading(true);
    try {
      const { name, id } = values;

      const body = {
        name: name,
        pairId: id,
      };

      await api.put('/pair', body);
      setErrors({});
      toast.success('Dupla atualizada com sucesso!');
      getPairs();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao atualizar a dupla, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const filterPair = () => {
    if (categoryFiltered) {
      return pairList?.filter(
        (currentPair) =>
          categoryFiltered && currentPair?.category_id === categoryFiltered
      );
    } else {
      return pairList;
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const deletePair = async () => {
    setLoading(true);
    try {
      //desestruturando o estado, pegando os valores que guardamos la, atraves dos inputs

      await api.delete(`/pair/${pairSelected}`);
      toast.success('Dupla deletada com sucesso!');
      setOpenDeleteDialog(false);
      getPairs();
    } catch (err: any) {
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao remover a dupla, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (item_id: string) => {
    setPairSelected(item_id);
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
          Deseja excluir a dupla?
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
            onClick={deletePair}
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
          <DrawerTitle>Adicionar Dupla</DrawerTitle>
          <ResultForm>
            <InputLabel>Categoria</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              value={values?.category_id}
              onChange={(e) =>
                setValues({ ...values, category_id: e.target.value })
              }
              error={errors.category_id}
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

            <InputLabel>Nome</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
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

            <InputLabel>Membro 1</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              onChange={(e) =>
                setValues({ ...values, first_member: e.target.value })
              }
              value={values.first_member}
              error={errors.first_member}
              variant="outlined"
              helperText={errors.first_member}
              disabled={drawerType === 'edit'}
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

            <InputLabel>Membro 2</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              onChange={(e) =>
                setValues({ ...values, second_member: e.target.value })
              }
              value={values.second_member}
              error={errors.second_member}
              variant="outlined"
              helperText={errors.second_member}
              disabled={drawerType === 'edit'}
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
              onClick={drawerType === 'edit' ? putData : postPair}
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
                first_member: '',
                second_member: '',
                name: '',
                category_id: '',
              })
            }
          >
            Adicionar Dupla
          </Button>
        </ContentHeader>

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Equipe</Th>
                <Th>Membro 1</Th>
                <Th>Membro 2</Th>
                <Th style={{ textAlign: 'center' }}>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {filterPair()?.map((pair) => (
                <Tr key={pair.id}>
                  <Td>
                    <PairName>{pair?.name}</PairName>
                  </Td>
                  <Td>
                    <PairName>{pair?.first_member}</PairName>
                  </Td>
                  <Td>
                    <PairName>{pair?.second_member}</PairName>
                  </Td>
                  <Td>
                    <FlexRow>
                      <Delete
                        onClick={() => {
                          openDialog(pair.id);
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
                          openDrawer('edit', pair);
                          setPairSelected(pair.id);
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
