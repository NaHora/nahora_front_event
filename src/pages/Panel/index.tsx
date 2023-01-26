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
  DrawerContainer,
  InputLabel,
  ResultForm,
  TableContainer,
} from "./styles";
import EventLogo from "../../assets/event-logo.png";
import { toast } from "react-toastify";
import * as Yup from "yup";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  MenuItem,
  Modal,
  TextField,
  useMediaQuery,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import getValidationErrors from "../../utils";
import { secondToTimeFormater, timeToSecondFormater } from "../../utils/time";
import { theme } from "../../styles/global";

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
  type: "REP" | "FORTIME";
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
  score: number | string;
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

export const Panel = () => {
  const [workoutFiltered, setWorkoutFiltered] = useState("");
  const [categoryFiltered, setCategoryFiltered] = useState("");
  const [pairSelected, setPairSelected] = useState("");
  const [workoutSelected, setWorkoutSelected] = useState("");
  const [categorySelected, setCategorySelected] = useState("");
  const [score, setScore] = useState("");
  const [tieBreak, setTieBreak] = useState("");
  const [loading, setLoading] = useState(false);
  const [workoutList, setWorkoutList] = useState<WorkoutDTO[]>([]);
  const [categoryList, setCategoryList] = useState<SelectPropsDTO[]>([]);
  const [pairList, setPairList] = useState<SelectPropsDTO[]>([]);
  const [scoreList, setScoreList] = useState<ScoreDTO[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [resultSelected, setResulSelected] = useState("");
  const [values, setValues] = useState<ScoreInputDTO>({
    id: "",
    pair_id: "",
    score: 0,
    tieBreak: "",
    workout_id: "",
  });

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
    setErrors({});
    setLoading(true);

    try {
      const schema = Yup.object().shape({
        workout_id: Yup.string().required("Workout obrigatório"),
        score: Yup.number().required("Score obrigatório"),
        pair_id: Yup.string().required("Dupla obrigatória"),
        tieBreak: Yup.string().required("Tie Break obrigatório"),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      const body = {
        score: values.score,
        tieBreak: timeToSecondFormater(values.tieBreak),
        pair_id: values.pair_id,
        workout_id: values.workout_id,
      };

      const response = await api.post(`/score`, body);
      // console.log(body);
      setErrors({});
      toast.success("Resultado criado com sucesso!");
      getScore();
      setIsDrawerOpen(false);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));
        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            "Ocorreu um erro ao adicionar o resultado, tente novamente"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutById = (currentWorkoutId: string) => {
    const workoutType = workoutList.find(
      (workout) => currentWorkoutId === workout.id
    );

    return workoutType?.type;
  };

  useEffect(() => {
    if (values.workout_id) {
      getWorkoutById();
    }
  }, [values.workout_id]);

  const filterScore = () => {
    if (workoutFiltered && categoryFiltered) {
      return scoreList
        ?.filter(
          (currentScore) =>
            workoutFiltered && currentScore.workout_id === workoutFiltered
        )

        ?.filter(
          (currentScore) =>
            categoryFiltered &&
            currentScore.pair?.category_id === categoryFiltered
        );
    } else if (workoutFiltered && !categoryFiltered) {
      return scoreList?.filter(
        (currentScore) =>
          workoutFiltered && currentScore.workout_id === workoutFiltered
      );
    } else if (!workoutFiltered && categoryFiltered) {
      return scoreList?.filter(
        (currentScore) =>
          categoryFiltered &&
          currentScore.pair?.category_id === categoryFiltered
      );
    } else {
      return scoreList;
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const deleteResult = async () => {
    setLoading(true);
    try {
      //desestruturando o estado, pegando os valores que guardamos la, atraves dos inputs

      // await api.delete(`/score/${itemToDeleteId}`);
      toast.success("Resultado deletado com sucesso!");
      getScore();
    } catch (err: any) {
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            "Ocorreu um erro ao adicionar o resultado, tente novamente"
        );
      }
    } finally {
      setLoading(false);
    }
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
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}}>Disagree</Button>
          <Button onClick={() => {}} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerContainer>
          <DrawerTitle>Adicionar Resultados</DrawerTitle>
          <ResultForm>
            <InputLabel>Workout</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              onChange={(e) =>
                setValues({ ...values, workout_id: e.target.value })
              }
              value={values.workout_id}
              error={errors.workout_id}
              variant="outlined"
              helperText={errors.workout_id}
              select
              sx={{
                width: "100%",
                borderRadius: "10px",
              }}
              InputProps={{
                style: {
                  borderRadius: "10px",
                  backgroundColor: "#121214",
                },
              }}
            >
              {workoutList?.map((workout) => {
                return (
                  <MenuItem key={workout.id} value={workout.id}>
                    {workout.name}
                  </MenuItem>
                );
              })}
            </TextField>

            <InputLabel>Categoria</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              value={categorySelected}
              onChange={(e) => setCategorySelected(e.target.value)}
              variant="outlined"
              select
              sx={{
                width: "100%",
                borderRadius: "10px",
              }}
              InputProps={{
                style: {
                  borderRadius: "10px",
                  backgroundColor: "#121214",
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

            <InputLabel>Dupla</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              onChange={(e) =>
                setValues({ ...values, pair_id: e.target.value })
              }
              value={values.pair_id}
              error={errors.pair_id}
              variant="outlined"
              helperText={errors.pair_id}
              select
              sx={{
                width: "100%",
                borderRadius: "10px",
              }}
              InputProps={{
                style: {
                  borderRadius: "10px",
                  backgroundColor: "#121214",
                },
              }}
            >
              {pairList?.map((pair) => {
                return (
                  <MenuItem key={pair.id} value={pair.id}>
                    {pair.name}
                  </MenuItem>
                );
              })}
            </TextField>

            <InputLabel>Score</InputLabel>
            {getWorkoutById(values.workout_id) === "FORTIME" ? (
              <TextField
                id="outlined-basic"
                label=""
                size="small"
                onChange={(e) =>
                  setValues({ ...values, score: e.target.value })
                }
                value={values.score}
                error={errors.score}
                variant="outlined"
                helperText={errors.score}
                type="time"
                sx={{
                  width: "100%",
                  borderRadius: "10px",
                }}
                InputProps={{
                  style: {
                    borderRadius: "10px",
                    backgroundColor: "#121214",
                  },
                }}
              />
            ) : (
              <TextField
                id="outlined-basic"
                label=""
                size="small"
                onChange={(e) =>
                  setValues({ ...values, score: Number(e.target.value) })
                }
                value={values.score}
                error={errors.score}
                variant="outlined"
                helperText={errors.score}
                sx={{
                  width: "100%",
                  borderRadius: "10px",
                }}
                InputProps={{
                  style: {
                    borderRadius: "10px",
                    backgroundColor: "#121214",
                  },
                }}
              />
            )}

            <InputLabel>Tie-Break</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              onChange={(e) =>
                setValues({ ...values, tieBreak: e.target.value })
              }
              value={values.tieBreak}
              error={errors.tieBreak}
              variant="outlined"
              helperText={errors.tieBreak}
              type="time"
              sx={{
                width: "100%",
                borderRadius: "10px",
              }}
              InputProps={{
                style: {
                  borderRadius: "10px",
                  backgroundColor: "#121214",
                },
              }}
            />

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
          </ResultForm>
        </DrawerContainer>
      </Drawer>

      <EventImage src={EventLogo} alt="event logo" />
      <Content>
        <ContentHeader>
          <FilteredContainer>
            <FilteredSelect>
              <InputLabel style={{ marginTop: 0 }}>Workout:</InputLabel>
              <TextField
                id="outlined-basic"
                label=""
                size="small"
                onChange={(e) => setWorkoutFiltered(e.target.value)}
                value={workoutFiltered}
                variant="outlined"
                select
                sx={{
                  width: "250px",
                  borderRadius: "10px",
                }}
                InputProps={{
                  style: {
                    borderRadius: "10px",
                    backgroundColor: "#121214",
                  },
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                {workoutList.map((workout) => {
                  return (
                    <MenuItem key={workout.id} value={workout.id}>
                      {workout.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </FilteredSelect>
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
                  width: "250px",
                  borderRadius: "10px",
                }}
                InputProps={{
                  style: {
                    borderRadius: "10px",
                    backgroundColor: "#121214",
                  },
                }}
              >
                <MenuItem value="">Todos</MenuItem>
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
            onClick={() => setIsDrawerOpen(true)}
          >
            Adicionar Resultados
          </Button>
        </ContentHeader>
        <TableContainer>
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
              {filterScore()?.map((score) => (
                <Tr key={score.id}>
                  <Td>
                    <FlexColumnAlignStart>
                      <PairName>{score?.pair?.name}</PairName>
                      <CompetitorsName>
                        {score?.pair?.first_member} /{" "}
                        {score?.pair?.second_member}
                      </CompetitorsName>
                    </FlexColumnAlignStart>
                  </Td>
                  <Td>
                    <Points>
                      {getWorkoutById(workoutFiltered) === "FORTIME"
                        ? secondToTimeFormater(score?.score)
                        : score?.score}
                    </Points>
                  </Td>
                  <Td>
                    <TieBreak>{secondToTimeFormater(score?.tieBreak)}</TieBreak>
                  </Td>
                  <Td>
                    <FlexRow>
                      <Delete>
                        <DeleteForeverIcon
                          fontSize={isMobile ? "small" : "medium"}
                        />
                        {!isMobile && "Excluir"}
                      </Delete>
                      <Edit>
                        <EditIcon fontSize={isMobile ? "small" : "medium"} />
                        {!isMobile && "Editar"}
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
