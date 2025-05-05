import {
  CircularProgress,
  MenuItem,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import EventLogo from '../../assets/event-logo.png';
import api from '../../services/api';
import { theme } from '../../styles/global';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
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
  InputLabel,
} from './styles';
import { secondToTimeFormater } from '../../utils/time';
import { useParams } from 'react-router-dom';
import { Athletes } from '../Athletes';

type Category = {
  id: string;
  name: string;
  event_id: string;
};

export type Workout = {
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

type Pair = {
  id: string;
  name: string;
  first_member: string;
  second_member: string;
};

type Rank = {
  id: string;
  score: number;
  tieBreak: number;
  pair_id: string;
  workout_id: string;
  point: number;
  position: number;
  pair: Pair;
};

type WorkoutDescription = {
  id: string;
  description: string;
  hour: string;
  workout_id: string;
  category_id: string;
};

export const Filter = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<string>('todos');
  const [rank, setRank] = useState<Rank[]>([] as Rank[]);
  const [rankGeral, setRankGeral] = useState<RankGeral[]>();
  const [workoutsDescription, setWorkoutsDescription] =
    useState<WorkoutDescription[]>();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  async function getWorkoutDescriptions() {
    const response = await api.get(`/workout-description/event/${eventId}`);
    setWorkoutsDescription(response.data);
  }

  async function getRankGeral() {
    setRankGeral([]);
    const response = await api.get(
      `/score/rank/total/category_id/${currentCategory}/event/${eventId}`
    );
    setRankGeral(response.data);
  }

  async function getCategories() {
    const response = await api.get(`/category/event/${eventId}`);
    setCategories(response.data);
    setCurrentCategory(response.data[0]?.id);
  }

  async function getWorkouts() {
    const response = await api.get(`/workout/event/${eventId}`);
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
      if (currentWorkout === 'todos') {
        getRankGeral();
      } else {
        getRank();
      }
    }
  }, [currentWorkout, currentCategory]);

  useEffect(() => {
    Promise.all([getCategories(), getWorkouts(), getWorkoutDescriptions()]);
  }, [eventId]);

  function getWorkoutPoint(index: number) {
    switch (index) {
      case 0:
        return '1';
        break;
      case 1:
        return '2.1';
        break;
      case 2:
        return '2.2';
        break;
      case 3:
        return '2.3';
        break;
      case 4:
        return '3';

        break;
      default:
        return '0';
    }
  }

  function getCurrentWorkoutDescription() {
    const myWorkoutsDescription = workoutsDescription?.find(
      (currentWorkoutDescription) =>
        currentWorkoutDescription.workout_id === currentWorkout &&
        currentWorkoutDescription.category_id === currentCategory
    );
    return myWorkoutsDescription?.description.split('\n');
  }

  const getWorkoutById = (currentWorkoutId: string) => {
    const workoutType = workouts.find(
      (workout) => currentWorkoutId === workout.id
    );

    return workoutType?.type;
  };

  return (
    <Container>
      <EventImage src={EventLogo} width={320} alt="event logo" />
      <Content>
        <SelectContent>
          <SelectContainer>
            <InputLabel>Rank</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              onChange={(e) => setCurrentWorkout(e.target.value)}
              value={currentWorkout}
              variant="outlined"
              select
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
            >
              <MenuItem value="todos">Geral</MenuItem>
              {workouts?.map((workout) => {
                return (
                  <MenuItem key={workout.id} value={workout.id}>
                    {workout.number} - {workout.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </SelectContainer>

          <SelectContainer>
            <InputLabel>Categorias:</InputLabel>
            <TextField
              id="outlined-basic"
              label=""
              size="small"
              onChange={(e) => setCurrentCategory(e.target.value)}
              value={currentCategory}
              variant="outlined"
              select
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
            >
              {categories?.map((category) => {
                return (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </SelectContainer>
        </SelectContent>

        {currentWorkout !== 'todos' && (
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

        {currentWorkout !== 'todos' ? (
          <Table>
            <Thead>
              <Tr>
                <Th>Posição</Th>
                <Th style={{ textAlign: 'left' }}>Equipe</Th>
                <Th>Score</Th>
                <Th>Tie-Break</Th>
                <Th>Pontuação</Th>
              </Tr>
            </Thead>

            <Tbody>
              {rank.length === 0 ? (
                <Tr style={{ transform: 'skew(-10deg)' }}>
                  <Td colSpan={5} style={{ textAlign: 'center' }}>
                    Scores ainda não cadastrados
                  </Td>
                </Tr>
              ) : (
                rank?.map((row) => (
                  <Tr style={{ transform: 'skew(-10deg)' }} key={row.id}>
                    <Td style={{ textAlign: 'center' }}>
                      {row.position === 1 && (
                        <MilitaryTechIcon
                          style={{
                            color: '#f04c12',
                            fontSize: 60,
                            position: 'absolute',
                            left: isMobile ? -20 : 0,
                            top: 0,
                          }}
                        />
                      )}
                      <Position>{row.position}</Position>
                    </Td>
                    <Td>
                      <FlexColumnAlignStart>
                        <PairName>{row.team.name}</PairName>
                        {row.team.athletes && (
                          <CompetitorsName>
                            {row.team.athletes.map((athlete, index) =>
                              index > 0 ? '/' + athlete.name : athlete.name
                            )}
                          </CompetitorsName>
                        )}
                      </FlexColumnAlignStart>
                    </Td>
                    <Td>
                      <FlexRow>
                        <Score style={{ color: '#f04c12' }}>
                          {getWorkoutById(currentWorkout) === 'FORTIME'
                            ? secondToTimeFormater(row.score)
                            : row.score}
                        </Score>
                      </FlexRow>
                    </Td>
                    <Td>
                      <FlexRow>
                        <Score>{secondToTimeFormater(row.tieBreak)}</Score>
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
                <Th style={{ textAlign: 'left' }}>Equipe</Th>
                {!isMobile && <Th>Workouts</Th>}
                <Th>Pontuação</Th>
              </Tr>
            </Thead>

            <Tbody>
              {rankGeral?.map((row, index) => (
                <Tr style={{ transform: 'skew(-10deg)' }} key={row.pairName}>
                  <Td style={{ textAlign: 'center' }}>
                    {row.position === 1 && (
                      <MilitaryTechIcon
                        style={{
                          color: '#f04c12',
                          fontSize: 60,
                          position: 'absolute',
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
                      {row.competitors !== ' / ' && (
                        <CompetitorsName>{row.competitors}</CompetitorsName>
                      )}
                    </FlexColumnAlignStart>
                  </Td>
                  {!isMobile && (
                    <Td>
                      <FlexRow>
                        {row.workouts.map((workoutPoint, index) => {
                          return (
                            <FlexColumn key={getWorkoutPoint(index)}>
                              <WorkoutName>
                                {workouts[index].number}
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
