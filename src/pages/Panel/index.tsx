import { useEffect, useState } from "react";
import api from "../../services/api";
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
  Select,
  SelectDiv,
  SelectOption,
  SelectLabel,
  FilteredContainer,
  FilteredSelect,
  Delete,
  Edit,
  DrawerTitle,
  DrawerSelect,
  DrawerSelectDiv,
  DrawerInput,
  Input,
  DrawerContainer,
} from "./styles";
import EventLogo from "../../assets/event-logo.png";

import { Alert, Box, Button, Drawer, TextField } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

type SelectPropsDTO = {
  id: string;
  name: string;
  category_id?: string;
  event_id?: string;
};

type ScoreDTO = {
  id: string;
  pair_id: string;
  score: number;
  tieBreak: number;
  workout_id: string;
  pair: PairDTO;
};

type PairDTO = {
  category_id: string;
  first_member: string;
  id: string;
  name: string;
  second_member: string;
};

export const Panel = () => {
  const [workoutFiltered, setWorkoutFiltered] = useState("");
  const [categoryFiltered, setCategoryFiltered] = useState("");
  const [pairSelected, setPairSelected] = useState("");
  const [workoutSelected, setWorkoutSelected] = useState("");
  const [categorySelected, setCategorySelected] = useState("");
  const [score, setScore] = useState("");
  const [tieBreak, setTieBreak] = useState("");
  const [loading, setLoading] = useState(false);
  const [workoutList, setWorkoutList] = useState<SelectPropsDTO[]>([]);
  const [categoryList, setCategoryList] = useState<SelectPropsDTO[]>([]);
  const [pairList, setPairList] = useState<SelectPropsDTO[]>([]);
  const [scoreList, setScoreList] = useState<ScoreDTO[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getScore = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/score`);

      setScoreList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  console.log(scoreList);

  const getWorkout = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/workout`);

      setWorkoutList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/category`);

      setCategoryList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getPairs = async () => {
    setLoading(true);

    try {
      const response = await api.get(
        `/pair/listByCategory/${categorySelected}`
      );

      setPairList(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkout();
    getCategories();
    getScore();
  }, []);

  useEffect(() => {
    if (categorySelected) {
      getPairs();
    }
  }, [categorySelected]);

  const postResults = async () => {
    setLoading(true);

    try {
      const body = {
        score: Number(score),
        tieBreak: Number(tieBreak),
        pair_id: pairSelected,
        workout_id: workoutSelected,
      };

      const response = await api.post(`/score`, body);
      getScore();
      setIsDrawerOpen(false);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerContainer>
          <DrawerTitle>Adicionar Resultados</DrawerTitle>
          <DrawerSelectDiv>
            <DrawerSelect
              value={workoutSelected}
              onChange={(e) => setWorkoutSelected(e.target.value)}
            >
              <SelectOption value="" disabled selected>
                Workout
              </SelectOption>
              {workoutList.map((workout) => {
                return (
                  <SelectOption key={workout.id} value={workout.id}>
                    {workout.name}
                  </SelectOption>
                );
              })}
            </DrawerSelect>
          </DrawerSelectDiv>
          <DrawerSelectDiv>
            <DrawerSelect
              value={categorySelected}
              onChange={(e) => setCategorySelected(e.target.value)}
            >
              <SelectOption value="" disabled selected>
                Categoria
              </SelectOption>
              {categoryList.map((category) => {
                return (
                  <SelectOption key={category.id} value={category.id}>
                    {category.name}
                  </SelectOption>
                );
              })}
            </DrawerSelect>
          </DrawerSelectDiv>
          <DrawerSelectDiv>
            <DrawerSelect
              value={pairSelected}
              onChange={(e) => setPairSelected(e.target.value)}
            >
              <SelectOption value="" disabled selected>
                Dupla
              </SelectOption>
              {pairList?.map((pair) => {
                return (
                  <SelectOption key={pair.id} value={pair.id}>
                    {pair.name}
                  </SelectOption>
                );
              })}
            </DrawerSelect>
          </DrawerSelectDiv>
          <DrawerInput>
            <Input
              value={score}
              placeholder="Score"
              onChange={(e) => setScore(e.target.value)}
            />
          </DrawerInput>
          <DrawerInput>
            <Input
              value={tieBreak}
              placeholder="Tie Break"
              onChange={(e) => setTieBreak(e.target.value)}
            />
          </DrawerInput>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: "60px", borderRadius: "10px" }}
            fullWidth
            onClick={postResults}
          >
            Adicionar
          </Button>
        </DrawerContainer>
      </Drawer>

      <EventImage src={EventLogo} alt="event logo" />
      <Content>
        <ContentHeader>
          <FilteredContainer>
            <FilteredSelect>
              <SelectLabel>Workout:</SelectLabel>
              <SelectDiv>
                <Select
                  value={workoutFiltered}
                  onChange={(e) => setWorkoutFiltered(e.target.value)}
                >
                  <SelectOption value="" disabled selected>
                    Selecione
                  </SelectOption>
                  {workoutList.map((workout) => {
                    return (
                      <SelectOption key={workout.id} value={workout.name}>
                        {workout.name}
                      </SelectOption>
                    );
                  })}
                </Select>
              </SelectDiv>
            </FilteredSelect>
            <FilteredSelect>
              <SelectLabel>Categorias:</SelectLabel>
              <SelectDiv>
                <Select
                  value={categoryFiltered}
                  onChange={(e) => setCategoryFiltered(e.target.value)}
                >
                  <SelectOption value="" disabled selected>
                    Selecione
                  </SelectOption>
                  {categoryList.map((category) => {
                    return (
                      <SelectOption key={category.id} value={category.name}>
                        {category.name}
                      </SelectOption>
                    );
                  })}
                </Select>
              </SelectDiv>
            </FilteredSelect>
          </FilteredContainer>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Adicionar Resultados
          </Button>
        </ContentHeader>
        <Table>
          <Thead>
            <Tr>
              <Th>Equipe</Th>
              <Th>Score</Th>
              <Th>Tie Break</Th>
              <Th style={{ textAlign: "center" }}>Ações</Th>
            </Tr>
          </Thead>

          <Tbody>
            {scoreList?.map((score) => (
              <Tr key={score.id}>
                <Td>
                  <FlexColumnAlignStart>
                    <PairName>{score?.pair?.name}</PairName>
                    <CompetitorsName>
                      {score?.pair?.first_member} / {score?.pair?.second_member}
                    </CompetitorsName>
                  </FlexColumnAlignStart>
                </Td>
                <Td>
                  <Points>{score?.score}</Points>
                </Td>
                <Td>
                  <TieBreak>{score?.tieBreak}</TieBreak>
                </Td>
                <Td>
                  <FlexRow>
                    <Delete>
                      <DeleteForeverIcon />
                      Excluir
                    </Delete>
                    <Edit>
                      <EditIcon />
                      Editar
                    </Edit>
                  </FlexRow>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Content>
    </Container>
  );
};
