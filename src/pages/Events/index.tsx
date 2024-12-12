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
import { EventDTO } from '../../dtos';

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
};

interface StateProps {
  [key: string]: any;
}

export const Events = () => {
  const [loading, setLoading] = useState(false);
  const [eventList, setEventList] = useState<EventDTO[]>([]);
  const [categoryFiltered, setCategoryFiltered] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventSelected, setEventSelected] = useState('');
  const [values, setValues] = useState<EventDTO>({
    id: '',
    name: '',
    start_date: '',
    end_date: '',
    max_sales: '',
  });
  const [drawerType, setDrawerType] = useState('');

  const openDrawer = (drawerType: string, item: EventDTO) => {
    if (drawerType === 'edit') {
      setValues({
        id: item?.id,
        name: item?.name,
        start_date: item?.start_date,
        end_date: item?.end_date,
        max_sales: item?.max_sales,
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

  const getEvents = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/event`);

      setEventList(response.data);
      setCategoryFiltered(response.data[0].id);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const postEvent = async () => {
    setErrors({});
    setLoading(true);

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome do evento é obrigatório'),
        start_date: Yup.string().required('Data de início é obrigatória'),
        end_date: Yup.string()
          .required('Data de fim é obrigatória')
          .test(
            'end_date',
            'A data de fim não pode ser menor que a data de início',
            function (value) {
              const { start_date } = this.parent;
              return (
                !start_date || !value || new Date(value) >= new Date(start_date)
              );
            }
          ),
        max_sales: Yup.number()
          .required('Máximo de vendas é obrigatório')
          .positive('Deve ser um número positivo'),
      });
      await schema.validate(values, {
        abortEarly: false,
      });

      const body = {
        name: values?.name,
        enterprise_id: '1f0fd51d-cd1c-43a9-80ed-00d039571520',
        start_date: values?.start_date,
        end_date: values?.end_date,
        max_sales: values?.max_sales,
      };

      const response = await api.post(`/event`, body);
      setErrors({});
      toast.success('Categoria criada com sucesso!');
      getEvents();
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
    });

    await schema.validate(values, {
      abortEarly: false,
    });

    setLoading(true);
    try {
      const { name, id } = values;

      const body = {
        name: name,
        categoryId: id,
      };

      await api.put('/event', body);
      setErrors({});
      toast.success('Categoria atualizada com sucesso!');
      getEvents();
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

      await api.delete(`/category/${eventSelected}`);
      toast.success('Categoria deletada com sucesso!');
      setOpenDeleteDialog(false);
      getEvents();
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
    setEventSelected(item_id);
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
          Deseja excluir o evento?
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
          <DrawerTitle>Criar Evento</DrawerTitle>
          <ResultForm>
            <InputLabel>Nome</InputLabel>
            <TextField
              id="event-name"
              size="small"
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              value={values.name}
              error={!!errors.name}
              variant="outlined"
              helperText={errors.name}
              sx={{ width: '100%', borderRadius: '10px' }}
              InputProps={{
                style: {
                  borderRadius: '10px',
                  backgroundColor: '#121214',
                },
              }}
            />

            <InputLabel>Data de Início</InputLabel>
            <TextField
              id="start-date"
              type="date"
              size="small"
              onChange={(e) =>
                setValues({ ...values, start_date: e.target.value })
              }
              value={values.start_date}
              error={!!errors.start_date}
              variant="outlined"
              helperText={errors.start_date}
              sx={{ width: '100%', borderRadius: '10px' }}
              InputProps={{
                style: {
                  borderRadius: '10px',
                  backgroundColor: '#121214',
                },
              }}
            />

            <InputLabel>Data de Fim</InputLabel>
            <TextField
              id="end-date"
              type="date"
              size="small"
              onChange={(e) =>
                setValues({ ...values, end_date: e.target.value })
              }
              value={values.end_date}
              error={!!errors.end_date}
              variant="outlined"
              helperText={errors.end_date}
              sx={{ width: '100%', borderRadius: '10px' }}
              InputProps={{
                style: {
                  borderRadius: '10px',
                  backgroundColor: '#121214',
                },
              }}
            />

            <InputLabel>Máximo de atletas</InputLabel>
            <TextField
              id="max-sales"
              type="number"
              size="small"
              onChange={(e) =>
                setValues({ ...values, max_sales: e.target.value })
              }
              value={values.max_sales}
              error={!!errors.max_sales}
              variant="outlined"
              helperText={errors.max_sales}
              sx={{ width: '100%', borderRadius: '10px' }}
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
              onClick={drawerType === 'edit' ? putData : postEvent}
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
                start_date: '',
                end_date: '',
                max_sales: '',
              })
            }
          >
            Criar Evento
          </Button>
        </ContentHeader>

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Evento</Th>
                <Th style={{ textAlign: 'center' }}>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {eventList?.map((event) => (
                <Tr key={event.id}>
                  <Td>
                    <PairName>{event?.name}</PairName>
                  </Td>

                  <Td>
                    <FlexRow>
                      <Delete
                        onClick={() => {
                          openDialog(event.id);
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
                          openDrawer('edit', event);
                          setEventSelected(event.id);
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
