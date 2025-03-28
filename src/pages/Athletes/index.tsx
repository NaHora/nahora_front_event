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
  Box,
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

type AthleteDTO = {
  id: string;
  name?: string;
  birth_date?: string;
  shirt_size?: string;
  gender?: string;
  cpf?: string;
  email?: string;
  phone_number?: string;
  team_id?: string;
  teamName?: string;
};

interface TeamDTO {
  id: string;
  active: boolean;
}

interface StateProps {
  [key: string]: any;
}

export const Athletes = () => {
  const [loading, setLoading] = useState(false);
  const [athletesList, setAthletesList] = useState<AthleteDTO[]>([]);
  const [teams, setTeams] = useState<TeamDTO[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [athleteSelected, setAthleteSelected] = useState('');
  const [values, setValues] = useState<AthleteDTO>({
    id: '',
    name: '',
    birth_date: '',
    shirt_size: '',
    gender: '',
    cpf: '',
    email: '',
    phone_number: '',
  });
  const { currentEvent } = useEvent();
  const [filterName, setFilterName] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filteredAthletes, setFilteredAthletes] = useState<AthleteDTO[]>([]);
  const openDrawer = (drawerType: string, item: AthleteDTO) => {
    setValues({
      id: item?.id,
      name: item?.name,
      birth_date: item?.birth_date,
      shirt_size: item?.shirt_size,
      gender: item?.gender,
      cpf: item?.cpf,
      email: item?.email,
      phone_number: item?.phone_number,
    });
    setIsDrawerOpen(true);
  };

  const fetchAthletesAndTeams = async () => {
    setLoading(true);
    try {
      const [athletesRes, teamsRes] = await Promise.all([
        api.get('/athletes'),
        api.get('/teams'),
      ]);

      const activeTeams = teamsRes.data.filter((team: TeamDTO) => team.active);
      const activeTeamIds = activeTeams.map((team: TeamDTO) => team.id);

      const filtered = athletesRes.data
        .filter((athlete: AthleteDTO) =>
          activeTeamIds.includes(athlete.team_id)
        )
        .map((athlete: AthleteDTO) => ({
          ...athlete,
          teamName:
            activeTeams.find((team: TeamDTO) => team.id === athlete.team_id)
              ?.name || 'Sem Time',
        }));

      setTeams(activeTeams);
      setAthletesList(filtered);
      setFilteredAthletes(filtered);
    } catch (err) {
      toast.error('Erro ao buscar atletas ou equipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAthletesAndTeams();
  }, [currentEvent]);

  useEffect(() => {
    setFilteredAthletes(
      athletesList.filter(
        (athlete) =>
          athlete.name?.toLowerCase().includes(filterName.toLowerCase()) &&
          athlete.teamName?.toLowerCase().includes(filterTeam.toLowerCase())
      )
    );
  }, [filterName, filterTeam, athletesList]);

  const putData = async () => {
    const schema = Yup.object().shape({
      name: Yup.string().required('Nome do atleta obrigatório'),
      birth_date: Yup.string().required('Data de nascimento obrigatória'),
      shirt_size: Yup.string().required('Tamanho da camisa obrigatório'),
      gender: Yup.string().required('Sexo obrigatório'),
      cpf: Yup.string().required('CPF obrigatório'),
      email: Yup.string().required('E-mail obrigatório'),
      phone_number: Yup.string().required('Telefone obrigatório'),
    });

    await schema.validate(values, {
      abortEarly: false,
    });

    setLoading(true);
    try {
      const {
        name,
        id,
        birth_date,
        shirt_size,
        gender,
        cpf,
        email,
        phone_number,
      } = values;

      const body = {
        athleteId: id,
        name,
        birth_date,
        shirt_size,
        gender,
        cpf,
        email,
        phone_number,
      };

      await api.put('/athletes', body);
      setErrors({});
      toast.success('Atleta atualizada com sucesso!');
      setIsDrawerOpen(false);
      fetchAthletesAndTeams();
      setFilterName('');
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            'Ocorreu um erro ao atualizar atleta, tente novamente'
        );
      }
    } finally {
      setLoading(false);
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
          <DrawerTitle>Editar Atleta</DrawerTitle>

          <InputLabel>Nome</InputLabel>
          <TextField
            size="small"
            value={values.name || ''}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            fullWidth
          />

          <InputLabel>CPF</InputLabel>
          <InputMask
            mask="999.999.999-99"
            value={values.cpf || ''}
            onChange={(e) => setValues({ ...values, cpf: e.target.value })}
          >
            {(inputProps) => (
              <TextField {...inputProps} size="small" fullWidth />
            )}
          </InputMask>

          <InputLabel>Email</InputLabel>
          <TextField
            size="small"
            value={values.email || ''}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            fullWidth
          />

          <InputLabel>Telefone</InputLabel>
          <InputMask
            mask="(99) 99999-9999"
            value={values.phone_number || ''}
            onChange={(e) =>
              setValues({ ...values, phone_number: e.target.value })
            }
          >
            {(inputProps) => (
              <TextField {...inputProps} size="small" fullWidth />
            )}
          </InputMask>

          <InputLabel>Data de Nascimento</InputLabel>
          <TextField
            size="small"
            type="date"
            value={values.birth_date || ''}
            onChange={(e) =>
              setValues({ ...values, birth_date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              '& input[type="date"]::-webkit-calendar-picker-indicator': {
                filter: 'invert(1)',
              },
            }}
          />

          <InputLabel>Tamanho da Camisa</InputLabel>
          <TextField
            select
            size="small"
            value={values.shirt_size || ''}
            onChange={(e) =>
              setValues({ ...values, shirt_size: e.target.value })
            }
            fullWidth
          >
            {['P', 'M', 'G', 'GG'].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </TextField>

          <InputLabel>Gênero</InputLabel>
          <RadioGroup
            row
            value={values.gender || ''}
            onChange={(e) => setValues({ ...values, gender: e.target.value })}
          >
            <FormControlLabel value="m" control={<Radio />} label="Masculino" />
            <FormControlLabel value="f" control={<Radio />} label="Feminino" />
          </RadioGroup>

          <LoadingButton
            variant="contained"
            color="primary"
            loading={loading}
            onClick={putData}
            sx={{ marginTop: 2 }}
          >
            Salvar
          </LoadingButton>
        </DrawerContainer>
      </Drawer>
      <EventImage src={EventLogo} width={318} alt="event logo" />
      <Content>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignSelf: 'flex-start' }}>
          <TextField
            size="small"
            label="Buscar Atleta"
            variant="outlined"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          <TextField
            size="small"
            label="Buscar Time"
            variant="outlined"
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
          />
        </Box>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Atleta</Th>
                <Th>CPF</Th>
                <Th>Contato</Th>
                <Th>Time</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
              {filteredAthletes?.map((athlete) => (
                <Tr key={athlete.id}>
                  <Td>
                    <PairName>{athlete?.name}</PairName>
                  </Td>
                  <Td>
                    <PairName>{athlete?.cpf}</PairName>
                  </Td>

                  <Td>
                    <a
                      href={`https://wa.me/55${athlete.phone_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#f04c12', textDecoration: 'none' }}
                    >
                      {athlete?.phone_number}
                    </a>
                  </Td>
                  <Td>
                    <PairName>{athlete?.teamName}</PairName>
                  </Td>
                  <Td>
                    <Edit
                      onClick={() => {
                        openDrawer('edit', athlete);
                        setAthleteSelected(athlete.id);
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
