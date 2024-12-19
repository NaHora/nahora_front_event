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
import { EventDTO, LotsDTO } from '../../dtos';
import { useAuth } from '../../hooks/auth';
import { getFormatDate } from '../../utils/date';
import { useEvent } from '../../contexts/EventContext';

interface StateProps {
  [key: string]: any;
}

export const Lots = () => {
  const [loading, setLoading] = useState(false);
  const [lotList, setLotList] = useState<LotsDTO[]>([]);
  const [categoryFiltered, setCategoryFiltered] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [lotSelected, setLotSelected] = useState('');
  const [values, setValues] = useState<LotsDTO>({
    id: '',
    amount: 0,
    start_date: '',
    end_date: '',
    max_sales: 0,
    event_id: '',
  });
  const [drawerType, setDrawerType] = useState('');
  const { userEnterprise } = useAuth();
  const { currentEvent } = useEvent();

  const openDrawer = (drawerType: string, item: LotsDTO) => {
    if (drawerType === 'edit') {
      setValues({
        id: item?.id,
        amount: item?.amount,
        start_date: item?.start_date,
        end_date: item?.end_date,
        max_sales: item?.max_sales,
        event_id: item?.event_id,
      });
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    } else {
      setValues({
        ...values,
        amount: 0,
        start_date: '',
        end_date: '',
        max_sales: 0,
        event_id: '',
      });
      setDrawerType(drawerType);
      setIsDrawerOpen(true);
    }
  };

  const getData = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/lots/list/${currentEvent}`);

      setLotList(response.data);
      setCategoryFiltered(response.data[0].id);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [currentEvent]);

  const postData = async () => {
    setErrors({});
    setLoading(true);

    try {
      const schema = Yup.object().shape({
        max_sales: Yup.number()
          .required('Quantidade de vendas do evento é obrigatório')
          .min(1, 'Quantidade mínima do lote deve ser de 1 venda'),
        amount: Yup.string()
          .required('Endereço do evento é obrigatório')
          .min(1, 'O valor do lote não pode ser menor que R$1'),
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
      });
      await schema.validate(values, {
        abortEarly: false,
      });

      const body = {
        max_sales: values?.max_sales,
        amount: values?.amount,
        event_id: currentEvent,
        start_date: values?.start_date,
        end_date: values?.end_date,
      };

      const response = await api.post(`/lots`, body);
      setErrors({});
      toast.success('Lote criado com sucesso!');
      getData();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao adicionar o lote, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const putData = async () => {
    const schema = Yup.object().shape({
      max_sales: Yup.number()
        .required('Quantidade de vendas do evento é obrigatório')
        .min(1, 'Quantidade mínima do lote deve ser de 1 venda'),
      amount: Yup.string()
        .required('Endereço do evento é obrigatório')
        .min(1, 'O valor do lote não pode ser menor que R$1'),
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
    });
    await schema.validate(values, {
      abortEarly: false,
    });

    setLoading(true);
    try {
      const { max_sales, amount, start_date, end_date, id } = values;

      const body = {
        max_sales: max_sales,
        amount: amount,
        start_date: start_date,
        end_date: end_date,
        event_id: id,
      };

      await api.put('/lots', body);
      setErrors({});
      toast.success('Lote atualizado com sucesso!');
      getData();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao atualizar o lote, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const deleteData = async () => {
    setLoading(true);
    try {
      await api.delete(`/lots/${lotSelected}`);
      toast.success('Lote deletado com sucesso!');
      setOpenDeleteDialog(false);
      getData();
    } catch (err: any) {
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao remover o lote, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (item_id: string) => {
    setLotSelected(item_id);
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
          Deseja excluir o lote?
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
            onClick={deleteData}
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
          <DrawerTitle>Criar Lote</DrawerTitle>
          <ResultForm>
            <InputLabel>Quantidade de Vendas</InputLabel>
            <TextField
              id="max_sales"
              size="small"
              onChange={(e) =>
                setValues({ ...values, max_sales: Number(e.target.value) })
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
            <InputLabel>Valor</InputLabel>
            <TextField
              id="amount"
              size="small"
              onChange={(e) =>
                setValues({ ...values, amount: Number(e.target.value) })
              }
              value={values.amount}
              error={!!errors.amount}
              variant="outlined"
              helperText={errors.amount}
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
              onClick={drawerType === 'edit' ? putData : postData}
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
                amount: 0,
                max_sales: 0,
                start_date: '',
                end_date: '',
                event_id: '',
              })
            }
          >
            Criar Lote
          </Button>
        </ContentHeader>

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Quantidade para venda</Th>
                <Th>Valor</Th>
                <Th>Início</Th>
                <Th>Término</Th>
                <Th style={{ textAlign: 'center' }}>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {lotList?.map((lot) => (
                <Tr key={lot.id}>
                  <Td>
                    <PairName>{lot?.max_sales}</PairName>
                  </Td>
                  <Td>
                    <PairName>{lot?.amount}</PairName>
                  </Td>
                  <Td>
                    <PairName>
                      {getFormatDate(new Date(lot?.start_date))}
                    </PairName>
                  </Td>
                  <Td>
                    <PairName>
                      {getFormatDate(new Date(lot?.end_date))}
                    </PairName>
                  </Td>
                  <Td>
                    <FlexRow>
                      <Delete onClick={() => openDialog(lot.id)}>
                        <DeleteForeverIcon
                          fontSize={isMobile ? 'small' : 'medium'}
                          sx={{ marginRight: '4px' }}
                        />
                        {!isMobile && 'Excluir'}
                      </Delete>
                      <Edit
                        onClick={() => {
                          openDrawer('edit', lot);
                          setLotSelected(lot.id);
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
