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
} from "./styles";
import EventLogo from "../../assets/event-logo.png";
import React, { useEffect, useState } from "react";
import api from "../../services/api";

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
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentOpacity, setCurrentOpacity] = useState(false);

  async function getRankGeral() {
    const response = await api.get("/score/rank/total");
    setRankGeral(response.data);
  }

  useEffect(() => {
    getRankGeral();
  }, []);

  const MINUTE_MS = 5000;

  useEffect(() => {
    console.log(currentOpacity);
    setCurrentOpacity(!currentOpacity);
    if (Array.isArray(rankGeral) && rankGeral.length > 0) {
      const interval = setInterval(() => {
        setCurrentOpacity(!currentOpacity);
        let newCategory = currentCategory + 1;
        if (newCategory === rankGeral.length) {
          newCategory = 0;
        }

        setCurrentCategory(newCategory);
      }, MINUTE_MS);

      return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }
  }, [currentCategory, rankGeral]);

  useEffect(() => {}, [currentCategory]);

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
        // Expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        return "0";
    }
  }

  return (
    <Container>
      <EventImage src={EventLogo} alt="event logo" />
      {Array.isArray(rankGeral) && rankGeral.length > 0 ? (
        <Content>
          <CategoryTitle className={currentOpacity ? "show" : "hide"}>
            {rankGeral[currentCategory][0]?.category}
          </CategoryTitle>
          <Table>
            <Thead>
              <Tr>
                <Th>Posição</Th>
                <Th style={{ textAlign: "left" }}>Equipe</Th>
                <Th>Workouts</Th>
                <Th>Pontuação</Th>
              </Tr>
            </Thead>

            <Tbody className={currentOpacity ? "show" : "hide"}>
              {rankGeral[currentCategory].map((row) => (
                <Tr style={{ transform: "skew(-10deg)" }} key={row.pairName}>
                  <Td style={{ textAlign: "center" }}>
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
        <span>Carregando</span>
      )}
    </Container>
  );
};
