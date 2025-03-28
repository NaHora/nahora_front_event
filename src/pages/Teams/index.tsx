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
import EventLogo from '../../assets/event-logo.png';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { Drawer, MenuItem, TextField, useMediaQuery } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import getValidationErrors from '../../utils';
import { theme } from '../../styles/global';
import { LoadingButton } from '@mui/lab';
import Navbar from '../../components/navbar';
import api from '../../services/api';
import { useEvent } from '../../contexts/EventContext';

interface TeamDTO {
  id: string;
  active?: boolean;
  name: string;
  box: string;
  category_id: string;
  categoryName?: string;
}

interface CategoryDTO {
  id: string;
  name: string;
}

interface StateProps {
  [key: string]: any;
}

export const Teams = () => {
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
  });
  const { currentEvent } = useEvent();
  const [filterTeam, setFilterTeam] = useState('');
  const [filteredTeams, setFilteredTeams] = useState<TeamDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  const openDrawer = (drawerType: string, item: TeamDTO) => {
    setValues({
      id: item?.id,
      name: item?.name,
      box: item?.box,
      category_id: item?.category_id,
      categoryName: item?.categoryName,
    });
    setIsDrawerOpen(true);
  };

  const getTeamsAndCategories = async () => {
    setLoading(true);
    try {
      const [teamsRes, categoriesRes] = await Promise.all([
        api.get('/teams'),
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
    getTeamsAndCategories();
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
