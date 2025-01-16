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
import { useAuth } from '../../hooks/auth';
import { getFormatDate } from '../../utils/date';
import { useNavigate } from 'react-router-dom';
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
};

interface StateProps {
  [key: string]: any;
}

export const Events = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventSelected, setEventSelected] = useState('');
  const [values, setValues] = useState<EventDTO>({
    id: '',
    name: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    address: '',
  });
  const [drawerType, setDrawerType] = useState('');
  const { userEnterprise } = useAuth();
  const { setCurrentEvent, events, getMyEvents } = useEvent();

  const adjustToLocalTime = (isoString: string): string => {
    const date = new Date(isoString);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().split('T')[1].slice(0, 5);
  };

  const openDrawer = (drawerType: string, item: EventDTO) => {
    if (drawerType === 'edit') {
      setValues({
        id: item?.id,
        name: item?.name,
        start_date: new Date(item?.start_date).toISOString().split('T')[0],
        end_date: new Date(item?.end_date).toISOString().split('T')[0],
        start_time: adjustToLocalTime(item?.start_date),
        end_time: adjustToLocalTime(item?.end_date),
        address: item?.address,
      });
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    } else {
      setValues({
        ...values,
        id: '',
        name: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        address: '',
      });
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    }
  };

  const combineDateAndTime = (date: string, time: string): string => {
    const combined = new Date(`${date}T${time}`);
    return combined.toISOString();
  };

  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate} - ${formattedTime}h`;
  };

  const postEvent = async () => {
    setErrors({});
    setLoading(true);

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome do evento é obrigatório'),
        address: Yup.string().required('Endereço do evento é obrigatório'),
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
        start_time: Yup.string().required('Hora de início é obrigatória'),
        end_time: Yup.string().required('Hora de fim é obrigatória'),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const body = {
        name: values?.name,
        address: values?.address,
        enterprise_id: userEnterprise.id,
        start_date: combineDateAndTime(values.start_date, values.start_time),
        end_date: combineDateAndTime(values.end_date, values.end_time),
      };

      await api.post(`/event`, body);
      setErrors({});
      toast.success('Evento criado com sucesso!');
      getMyEvents();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao adicionar o evento, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const putData = async () => {
    const schema = Yup.object().shape({
      name: Yup.string().required('Nome do evento obrigatório'),
    });

    await schema.validate(values, {
      abortEarly: false,
    });

    setLoading(true);
    try {
      const body = {
        id: values.id,
        name: values.name,
        address: values.address,
        start_date: combineDateAndTime(values.start_date, values.start_time),
        end_date: combineDateAndTime(values.end_date, values.end_time),
        enterprise_id: userEnterprise.id,
        eventId: eventSelected,
      };

      await api.put('/event', body);
      setErrors({});
      toast.success('Evento atualizado com sucesso!');
      getMyEvents();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao atualizar o evento, tente novamente'
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

      await api.delete(`/event/${eventSelected}`);
      toast.success('Evento deletado com sucesso!');
      setOpenDeleteDialog(false);
      getMyEvents();
    } catch (err: any) {
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao remover o evento, tente novamente'
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
            <InputLabel>Endereço completo</InputLabel>
            <TextField
              id="address"
              size="small"
              onChange={(e) =>
                setValues({ ...values, address: e.target.value })
              }
              value={values.address}
              error={!!errors.address}
              variant="outlined"
              helperText={errors.address}
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
            <InputLabel>Horário de Início</InputLabel>
            <TextField
              id="start_time"
              type="time"
              size="small"
              onChange={(e) =>
                setValues({ ...values, start_time: e.target.value })
              }
              value={values.start_time}
              error={!!errors.start_time}
              variant="outlined"
              helperText={errors.start_time}
              sx={{ width: '100%', borderRadius: '10px' }}
              InputProps={{
                style: {
                  borderRadius: '10px',
                  backgroundColor: '#121214',
                },
              }}
            />

            <InputLabel>Data de Término</InputLabel>
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

            <InputLabel>Horário de Término</InputLabel>
            <TextField
              id="end_time"
              type="time"
              size="small"
              onChange={(e) =>
                setValues({ ...values, end_time: e.target.value })
              }
              value={values.end_time}
              error={!!errors.end_time}
              variant="outlined"
              helperText={errors.end_time}
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
                address: '',
                start_time: '',
                end_time: '',
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
                <Th>Início</Th>
                <Th>Término</Th>
                <Th style={{ textAlign: 'center' }}>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {events?.map((event) => (
                <Tr key={event.id}>
                  <Td
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setCurrentEvent(event.id);
                      navigate(`/dashboard`);
                    }}
                  >
                    <PairName>{event?.name}</PairName>
                  </Td>
                  <Td>
                    <PairName>{formatDateTime(event?.start_date)}</PairName>
                  </Td>
                  <Td>
                    <PairName>{formatDateTime(event?.end_date)}</PairName>
                  </Td>
                  <Td>
                    <FlexRow>
                      <Delete onClick={() => openDialog(event.id)}>
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
