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

type CategoryDTO = {
  id: string;
  name: string;
  event_id?: string;
  athlete_number: number;
};

interface StateProps {
  [key: string]: any;
}

export const Category = () => {
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<CategoryDTO[]>([]);
  const [categoryFiltered, setCategoryFiltered] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categorySelected, setCategorySelected] = useState('');
  const [values, setValues] = useState<CategoryDTO>({
    id: '',
    name: '',
    event_id: '',
    athlete_number: 1,
  });
  const [drawerType, setDrawerType] = useState('');
  const { currentEvent } = useEvent();

  const openDrawer = (drawerType: string, item: CategoryDTO) => {
    if (drawerType === 'edit') {
      setValues({
        id: item?.id,
        name: item?.name,
        athlete_number: item?.athlete_number,
      });
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    } else {
      setValues({
        ...values,
        name: '',
      });
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    }
  };

  const getCategories = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/category/event/${currentEvent}`);

      setCategoryList(response.data);
      setCategoryFiltered(response.data[0].id);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [currentEvent]);

  const postCategory = async () => {
    setErrors({});
    setLoading(true);

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome da categoria obrigatória'),
        athlete_number: Yup.number().required(
          'Número de atletas da categoria obrigatório'
        ),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const body = {
        name: values?.name,
        event_id: currentEvent,
        athlete_number: values?.athlete_number,
      };

      const response = await api.post(`/category`, body);
      setErrors({});
      toast.success('Categoria criada com sucesso!');
      getCategories();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao adicionar a categoria, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const putData = async () => {
    const schema = Yup.object().shape({
      name: Yup.string().required('Nome da categoria obrigatória'),
      athlete_number: Yup.number().required(
        'Número de atletas da categoria obrigatório'
      ),
    });

    await schema.validate(values, {
      abortEarly: false,
    });

    setLoading(true);
    try {
      const { name, id, athlete_number } = values;

      const body = {
        name: name,
        categoryId: id,
        athlete_number,
      };

      await api.put('/category', body);
      setErrors({});
      toast.success('Categoria atualizada com sucesso!');
      getCategories();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao atualizar a categoria, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const deletePair = async () => {
    setLoading(true);
    try {
      //desestruturando o estado, pegando os valores que guardamos la, atraves dos inputs

      await api.delete(`/category/${categorySelected}`);
      toast.success('Categoria deletada com sucesso!');
      setOpenDeleteDialog(false);
      getCategories();
    } catch (err: any) {
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao remover a categoria, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (item_id: string) => {
    setCategorySelected(item_id);
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
            <InputLabel>Número de atletas</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              onChange={(e) =>
                setValues({ ...values, athlete_number: e.target.value })
              }
              type="number"
              value={values.athlete_number}
              error={errors.athlete_number}
              variant="outlined"
              helperText={errors.athlete_number}
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
              onClick={drawerType === 'edit' ? putData : postCategory}
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
            <FilteredSelect></FilteredSelect>
          </FilteredContainer>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={() =>
              openDrawer('create', {
                id: '',
                name: '',
              })
            }
          >
            Adicionar Categoria
          </Button>
        </ContentHeader>

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Categoria</Th>
                <Th style={{ textAlign: 'center' }}>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {categoryList?.map((category) => (
                <Tr key={category.id}>
                  <Td>
                    <PairName>{category?.name}</PairName>
                  </Td>

                  <Td>
                    <FlexRow>
                      <Delete
                        onClick={() => {
                          openDialog(category.id);
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
                          openDrawer('edit', category);
                          setCategorySelected(category.id);
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
