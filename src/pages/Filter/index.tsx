import { useEffect, useState } from 'react';
import EventLogo from '../../assets/event-logo.png';
import api from '../../services/api';
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
  WorkoutTitle,
  WourkoutTime,
  WorkoutDescription,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Total,
  Tr,
  WorkoutName,
} from './styles';

type Rank = {
  category: string;
  competitors: string;
  pairName: string;
  position: number;
  total: number;
  workouts: number[];
};

export const Filter = () => {
  const [rankGeral, setRankGeral] = useState<Rank[][]>();
  const [currentRankGeral, setCurrentRankGeral] = useState<Rank[]>();
  const [currentCategory, setCurrentCategory] = useState(0);
  const [changeCategory, setChangeCategory] = useState(false);
  const [currentItems, setCurrentItems] = useState<number[]>([]);

  async function getRankGeral() {
    const response = await api.get('/score/rank/total');
    setRankGeral(response.data);
    setCurrentRankGeral(response.data[0]);
    const rankSize = response.data[0].length;

    const eachItemFromRank = Array.from({ length: rankSize }, (_, index) => index);
    setCurrentItems(eachItemFromRank);
  }

  useEffect(() => {
    getRankGeral();
  }, []);

  useEffect(() => {
    // setCurrentOpacity(!currentOpacity);
    if (Array.isArray(rankGeral) && rankGeral.length > 0) {
      const MINUTE_MS = 10000 - rankGeral.length * 200;

      const interval = setInterval(() => {
        setChangeCategory(true);
      }, MINUTE_MS);

      return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }
  }, [currentCategory, rankGeral]);

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
        // Expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        return '0';
    }
  }

  return (
    <Container>
      <EventImage src={EventLogo} alt="event logo" />
      {Array.isArray(currentRankGeral) && currentRankGeral.length > 0 ? (
        <Content>
          <SelectContainer>
            <SelectTitle>Workout:</SelectTitle>
            <SelectDiv>
              <Select placeholder="Selecione">
                <SelectOption></SelectOption>
                <SelectOption>1</SelectOption>
                <SelectOption>2.1</SelectOption>
                <SelectOption>2.2</SelectOption>
                <SelectOption>2.3</SelectOption>
                <SelectOption>5</SelectOption>
              </Select>
            </SelectDiv>
          </SelectContainer>

          <SelectContainer>
            <SelectTitle>Categorias:</SelectTitle>
            <SelectDiv>
              <Select placeholder="Selecione">
                <SelectOption>Selecione</SelectOption>
                <SelectOption>Primeira</SelectOption>
                <SelectOption>Segunda</SelectOption>
                <SelectOption>Terceira</SelectOption>
              </Select>
            </SelectDiv>
          </SelectContainer>

          <WorkoutDiv>
            <WorkoutTitle>WORKOUT 1 - WAR MASCULINO</WorkoutTitle>
            <WourkoutTime>09:00</WourkoutTime>
            <WorkoutDescription>100m run</WorkoutDescription>
            <WorkoutDescription>200 box jump</WorkoutDescription>
          </WorkoutDiv>

          <Table>
            <Thead>
              <Tr>
                <Th>Posição</Th>
                <Th style={{ textAlign: 'left' }}>Equipe</Th>
                <Th>Workouts</Th>
                <Th>Pontuação</Th>
              </Tr>
            </Thead>

            <Tbody>
              {currentRankGeral.map((row, index) => (
                <Tr
                  className={!currentItems.includes(index) ? 'hide' : ''}
                  style={{ transform: 'skew(-10deg)' }}
                  key={row.pairName}
                >
                  <Td style={{ textAlign: 'center' }}>
                    <Position>{row.position}</Position>
                  </Td>
                  <Td>
                    <FlexColumnAlignStart>
                      <PairName>{row.pairName}</PairName>
                      <CompetitorsName>{row.competitors}</CompetitorsName>
                    </FlexColumnAlignStart>
                  </Td>
                  <Td>
                    <FlexRow>
                      {row.workouts.map((workoutPoint, index) => {
                        return (
                          <FlexColumn key={getWorkoutPoint(index)}>
                            <WorkoutName>{getWorkoutPoint(index)}</WorkoutName>
                            <Point>{workoutPoint}</Point>
                          </FlexColumn>
                        );
                      })}
                    </FlexRow>
                  </Td>
                  <Td>
                    <FlexRow>
                      <Total>{row.total}</Total>
                    </FlexRow>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Content>
      ) : (
        <span>Carregando...</span>
      )}
    </Container>
  );
};
