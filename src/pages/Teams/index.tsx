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
  ResultForm,
  TableContainer,
} from './styles';
import EventLogo from '../../assets/event-logo.png';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';

import {
  Drawer,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  useMediaQuery,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import getValidationErrors from '../../utils';
import { theme } from '../../styles/global';
import { LoadingButton } from '@mui/lab';
import Navbar from '../../components/navbar';
import api from '../../services/api';
import { useEvent } from '../../contexts/EventContext';
import React from 'react';

interface TeamDTO {
  id: string;
  active?: boolean;
  name: string;
  box: string;
}

interface StateProps {
  [key: string]: any;
}

export const Teams = () => {
  const [loading, setLoading] = useState(false);
  const [teamsList, setTeamsList] = useState<TeamDTO[]>([]);
  const [teams, setTeams] = useState<TeamDTO[]>([]);
  const [athleteFiltered, setathleteFiltered] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [teamselected, setteamselected] = useState('');
  const [values, setValues] = useState<TeamDTO>({
    id: '',
    name: '',
    box: '',
  });
  const [drawerType, setDrawerType] = useState('');
  const { currentEvent } = useEvent();
  const [filterTeam, setFilterTeam] = useState('');
  const [filteredTeams, setFilteredTeams] = useState<TeamDTO[]>([]);

  const openDrawer = (drawerType: string, item: TeamDTO) => {
    setValues({
      id: item?.id,
      name: item?.name,
      box: item?.box,
    });
    setDrawerType(drawerType);
    setIsDrawerOpen(true);
  };

  const getTeams = async () => {
    setLoading(true);
    try {
      const result = await api.get('/teams');
      const activeTeams = result.data.filter((team: TeamDTO) => team.active);

      setTeamsList(activeTeams);
    } catch (err) {
      toast.error('Erro ao buscar times');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeams();
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
      name: Yup.string().required('Nome do atleta obrigatório'),
      box: Yup.string().required('Nome do box obrigatória'),
    });

    await schema.validate(values, {
      abortEarly: false,
    });

    setLoading(true);
    try {
      const { name, id, box } = values;

      const body = {
        athleteId: id,
        name,
        box,
      };

      await api.put('/teams', body);
      setErrors({});
      toast.success('Time atualizada com sucesso!');
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao atualizar time, tente novamente'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  console.log(teamsList);

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

          <LoadingButton
            variant="contained"
            color="primary"
            loading={loading}
            onClick={putData}
            sx={{ marginTop: 4 }}
          >
            Salvar
          </LoadingButton>
        </DrawerContainer>
      </Drawer>
      <EventImage src={EventLogo} width={318} alt="event logo" />
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
                <Th>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {filteredTeams?.map((athlete) => (
                <Tr key={athlete.id}>
                  <Td>
                    <PairName>{athlete?.name}</PairName>
                  </Td>
                  <Td>
                    <PairName>{athlete?.box}</PairName>
                  </Td>

                  <Td>
                    <Edit
                      onClick={() => {
                        openDrawer('edit', athlete);
                        setteamselected(athlete.id);
                      }}
                    >
                      <EditIcon
                        fontSize={isMobile ? 'small' : 'medium'}
                        sx={{ marginRight: '4px' }}
                      />
                      {!isMobile && 'Editar'}
                    </Edit>
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
