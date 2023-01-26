import { CircularProgress, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import EventLogo from "../../assets/event-logo.png";
import api from "../../services/api";
import { theme } from "../../styles/global";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import {
  CompetitorsName,
  Container,
  Content,
  EventImage,
  FlexColumn,
  FlexColumnAlignStart,
  FlexRow,
  PairName,
  Point,
  Position,
  SelectDiv,
  Select,
  SelectOption,
  SelectContainer,
  SelectTitle,
  WorkoutDiv,
  WorkoutDescription,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Total,
  Tr,
  WorkoutName,
  Score,
  SelectContent,
} from "./styles";

type Category = {
  id: string;
  name: string;
  event_id: string;
};

type Workout = {
  id: string;
  name: string;
  number: string;
  type: string;
  event_id: string;
};

type RankGeral = {
  category: string;
  competitors: string;
  pairName: string;
  position: number;
  total: number;
  workouts: number[];
};

type Rank = {
  id: string;
  score: number;
  tieBreak: number;
  pair_id: string;
  workout_id: string;
  point: number;
  position: number;
};

type WorkoutDescription = {
  id: string;
  description: string;
  hour: string;
  workout_id: string;
  category_id: string;
};

export const Filter = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [workouts, setWorkouts] = useState<Workout[]>();
  const [currentWorkout, setCurrentWorkout] = useState<string>("todos");
  const [rank, setRank] = useState<Rank>([]);
  const [rankGeral, setRankGeral] = useState<RankGeral[]>();
  const [workoutsDescription, setWorkoutsDescription] =
    useState<WorkoutDescription[]>();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  async function getWorkoutDescriptions() {
    const response = await api.get(`/workout-description`);
    setWorkoutsDescription(response.data);
  }

  async function getRankGeral() {
    const response = await api.get(
      `/score/rank/total/category_id/${currentCategory}`
    );
    setRankGeral(response.data);
  }

  async function getCategories() {
    const response = await api.get("/category");
    setCategories(response.data);
    setCurrentCategory(response.data[0]?.id);
  }

  async function getWorkouts() {
    const response = await api.get("/workout");
    setWorkouts(response.data);
  }

  async function getRank() {
    const response = await api.get(
      `/score/rank/workout_id/${currentWorkout}/category_id/${currentCategory}`
    );
    setRank(response.data);
  }

  useEffect(() => {
    if (currentCategory && currentWorkout) {
      if (currentWorkout === "todos") {
        getRankGeral();
      } else {
        getRank();
      }
    }
  }, [currentWorkout, currentCategory]);

  useEffect(() => {
    Promise.all([getCategories(), getWorkouts(), getWorkoutDescriptions()]);
  }, []);

  function getWorkoutPoint(index: number) {
    switch (index) {
      case 0:
        return "1";
        break;
      case 1:
        return "2.1";
        break;
      case 2:
        return "2.2";
        break;
      case 3:
        return "2.3";
        break;
      case 4:
        return "3";

        break;
      default:
        return "0";
    }
  }

  function getCurrentWorkoutDescription() {
    const myWorkoutsDescription = workoutsDescription?.find(
      (currentWorkoutDescription) =>
        currentWorkoutDescription.workout_id === currentWorkout &&
        currentWorkoutDescription.category_id === currentCategory
    );

    return myWorkoutsDescription?.description.split("|");
  }

  return (
    <Container>
      <EventImage src={EventLogo} alt="event logo" />
      <Content>
        <SelectContent>
          <SelectContainer>
            <SelectTitle>Workout:</SelectTitle>
            <SelectDiv>
              <Select
                onChange={(e) => setCurrentWorkout(e.target.value)}
                value={currentWorkout}
                placeholder="Selecione"
              >
                <SelectOption value="todos">Todos</SelectOption>
                {workouts?.map((workout) => {
                  return (
                    <SelectOption value={workout.id} key={workout.id}>
                      {workout.number} - {workout.name}
                    </SelectOption>
                  );
                })}
              </Select>
            </SelectDiv>
          </SelectContainer>

          <SelectContainer>
            <SelectTitle>Categorias:</SelectTitle>
            <SelectDiv>
              <Select
                onChange={(e) => setCurrentCategory(e.target.value)}
                value={currentCategory}
                placeholder="Selecione"
              >
                {categories?.map((category) => {
                  return (
                    <SelectOption value={category.id} key={category.id}>
                      {category.name}
                    </SelectOption>
                  );
                })}
              </Select>
            </SelectDiv>
          </SelectContainer>
        </SelectContent>

        {currentWorkout !== "todos" && (
          <WorkoutDiv>
            {getCurrentWorkoutDescription()?.map(
              (currentWorkoutDescription) => {
                return (
                  <WorkoutDescription>
                    {currentWorkoutDescription}
                  </WorkoutDescription>
                );
              }
            )}
          </WorkoutDiv>
        )}

        {currentWorkout !== "todos" ? (
          <Table>
            <Thead>
              <Tr>
                <Th>Posição</Th>
                <Th style={{ textAlign: "left" }}>Equipe</Th>
                <Th>Score</Th>
                <Th>Tie-Break</Th>
                <Th>Pontuação</Th>
              </Tr>
            </Thead>

            <Tbody>
              {rank.length === 0 ? (
                <Tr style={{ transform: "skew(-10deg)" }}>
                  <Td colSpan={5} style={{ textAlign: "center" }}>
                    Scores ainda não cadastrados
                  </Td>
                </Tr>
              ) : (
                rank?.map((row, index) => (
                  <Tr style={{ transform: "skew(-10deg)" }} key={row.pairName}>
                    <Td style={{ textAlign: "center" }}>
                      {row.position === 1 && (
                        <MilitaryTechIcon
                          style={{
                            color: "#F50057",
                            fontSize: 60,
                            position: "absolute",
                            left: isMobile ? -20 : 0,
                            top: 0,
                          }}
                        />
                      )}
                      <Position>{row.position}</Position>
                    </Td>
                    <Td>
                      <FlexColumnAlignStart>
                        <PairName>{row.pair.name}</PairName>
                        <CompetitorsName>
                          {row.pair.first_member} / {row.pair.second_member}
                        </CompetitorsName>
                      </FlexColumnAlignStart>
                    </Td>
                    <Td>
                      <FlexRow>
                        <Score style={{ color: "#F50057" }}>{row.score}</Score>
                      </FlexRow>
                    </Td>
                    <Td>
                      <FlexRow>
                        <Score>{row.tieBreak}</Score>
                      </FlexRow>
                    </Td>
                    <Td>
                      <FlexRow>
                        <Total>{row.point}</Total>
                      </FlexRow>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Posição</Th>
                <Th style={{ textAlign: "left" }}>Equipe</Th>
                {!isMobile && <Th>Workouts</Th>}
                <Th>Pontuação</Th>
              </Tr>
            </Thead>

            <Tbody>
              {rankGeral?.map((row, index) => (
                <Tr style={{ transform: "skew(-10deg)" }} key={row.pairName}>
                  <Td style={{ textAlign: "center" }}>
                    {row.position === 1 && (
                      <MilitaryTechIcon
                        style={{
                          color: "#F50057",
                          fontSize: 60,
                          position: "absolute",
                          left: isMobile ? -20 : 0,
                          top: 0,
                        }}
                      />
                    )}
                    <Position>{row.position}</Position>
                  </Td>
                  <Td>
                    <FlexColumnAlignStart>
                      <PairName>{row.pairName}</PairName>
                      <CompetitorsName>{row.competitors}</CompetitorsName>
                    </FlexColumnAlignStart>
                  </Td>
                  {!isMobile && (
                    <Td>
                      <FlexRow>
                        {row.workouts.map((workoutPoint, index) => {
                          return (
                            <FlexColumn key={getWorkoutPoint(index)}>
                              <WorkoutName>
                                {getWorkoutPoint(index)}
                              </WorkoutName>
                              <Point>{workoutPoint}</Point>
                            </FlexColumn>
                          );
                        })}
                      </FlexRow>
                    </Td>
                  )}
                  <Td>
                    <FlexRow>
                      <Total>{row.total}</Total>
                    </FlexRow>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Content>
    </Container>
  );
};
// true ? (
//   <CircularProgress />
// ) :