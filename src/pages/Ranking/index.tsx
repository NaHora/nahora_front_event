import {
  Container,
  CategoryTitle,
  TableContainer,
  Table,
  Tr,
  Th,
  Td,
  EventImage,
  Content,
  Tbody,
  Thead,
  Position,
  PairName,
  CompetitorsName,
  FlexRow,
  FlexColumn,
  WorkoutName,
  Point,
  FlexColumnAlignStart,
  Total,
} from './styles';
import EventLogo from '../../assets/event-logo.png';
import React, { useEffect, useState } from 'react';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { CircularProgress, useMediaQuery } from '@mui/material';
import { theme } from '../../styles/global';
import { Workout } from '../Filter';
import { api } from '../../services/apiClient';

type Rank = {
  category: string;
  competitors: string;
  pairName: string;
  position: number;
  total: number;
  workouts: number[];
};

export const Ranking = () => {
  const [rankGeral, setRankGeral] = useState<Rank[][]>();
  const [currentRankGeral, setCurrentRankGeral] = useState<Rank[]>();
  const [currentCategory, setCurrentCategory] = useState(0);
  const [changeCategory, setChangeCategory] = useState(false);
  const [currentItems, setCurrentItems] = useState<number[]>([]);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  async function getWorkouts() {
    const response = await api.get('/workout');
    setWorkouts(response.data);
  }
  useEffect(() => {
    const time = 300000; // milliseconds

    const reloadId = setTimeout(() => {
      window.location.reload();
    }, time);

    return () => {
      clearTimeout(reloadId);
    };
  }, []);

  async function getRankGeral() {
    const response = await api.get('/score/rank/total');
    setRankGeral(response.data);
    setCurrentRankGeral(response.data[0]);
    const rankSize = response.data[0].length;

    const eachItemFromRank = Array.from(
      { length: rankSize },
      (_, index) => index
    );
    setCurrentItems(eachItemFromRank);
  }

  useEffect(() => {
    getRankGeral();
    getWorkouts();
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

  useEffect(() => {
    if (
      Array.isArray(currentItems) &&
      currentItems.length > 0 &&
      changeCategory
    ) {
      const interval = setInterval(() => {
        const currentItemsCopied = [...currentItems];
        const rankSize = [...currentItemsCopied].length;

        currentItemsCopied.pop();

        if (Array.isArray(rankGeral) && rankGeral.length > 0) {
          if (rankSize === 1) {
            let newCategory = currentCategory + 1;
            if (newCategory === rankGeral.length) {
              newCategory = 0;
            }

            setCurrentCategory(newCategory);
            setCurrentRankGeral(rankGeral[newCategory]);
            const rankSize = rankGeral[newCategory].length;

            const eachItemFromRank = Array.from(
              { length: rankSize },
              (_, index) => index
            );
            setCurrentItems(eachItemFromRank);
            setChangeCategory(false);
          } else {
            setCurrentItems(currentItemsCopied);
          }
        }
      }, 200);

      return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }
  }, [currentItems, currentCategory, changeCategory]);

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
      <EventImage src={EventLogo} width={320} alt="event logo" />
      {Array.isArray(currentRankGeral) && currentRankGeral.length > 0 ? (
        <Content>
          <CategoryTitle className={!currentItems.includes(1) ? 'hide' : ''}>
            {currentRankGeral[0]?.category}
          </CategoryTitle>
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
                  <Td>
                    <FlexRow>
                      {row.workouts.map((workoutPoint, index) => {
                        return (
                          <FlexColumn key={getWorkoutPoint(index)}>
                            <WorkoutName>{workouts[index].number}</WorkoutName>
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
        <CircularProgress />
      )}
    </Container>
  );
};
