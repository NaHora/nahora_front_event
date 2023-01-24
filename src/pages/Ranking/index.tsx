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

export const Ranking = () => {
  const resultado = [
    {
      colocacao: 1,
      nomeDupla: "Dupla 1",
      competidores: "Competidor 1 e Competidor 2",
      resultados: "100, 200, 10, 90, 80",
      total: 100,
    },
    {
      colocacao: 2,
      nomeDupla: "Dupla 1",
      competidores: "Competidor 1 e Competidor 2",
      resultados: "100, 200, 10, 90, 80",
      total: 200,
    },
    {
      colocacao: 3,
      nomeDupla: "Dupla 1",
      competidores: "Competidor 1 e Competidor 2",
      resultados: "100, 200, 10, 90, 80",
      total: 300,
    },
    {
      colocacao: 4,
      nomeDupla: "Dupla 1",
      competidores: "Competidor 1 e Competidor 2",
      resultados: "100, 200, 10, 90, 80",
      total: 400,
    },
    {
      colocacao: 5,
      nomeDupla: "Dupla 1",
      competidores: "Competidor 1 e Competidor 2",
      resultados: "100, 200, 10, 90, 80",
      total: 100,
    },
    {
      colocacao: 6,
      nomeDupla: "Dupla 1",
      competidores: "Competidor 1 e Competidor 2",
      resultados: "100, 200, 10, 90, 80",
      total: 100,
    },
    {
      colocacao: 7,
      nomeDupla: "Dupla 1",
      competidores: "Competidor 1 e Competidor 2",
      resultados: "100, 200, 10, 90, 80",
      total: 100,
    },
    {
      colocacao: 8,
      nomeDupla: "Dupla 1",
      competidores: "Competidor 1 e Competidor 2",
      resultados: "100, 200, 10, 90, 80",
      total: 100,
    },
  ];
  const [categories, setCategories] = useState([]);

  const data = React.useMemo(() => resultado, []);

  async function getCategories() {
    const response = await api.get("/category");
    setCategories(response.data);
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Container>
      <EventImage src={EventLogo} alt="event logo" />
      <Content>
        <CategoryTitle>RX - MASCULINO</CategoryTitle>
        <Table>
          <Thead>
            <Tr>
              <Th>Posição</Th>
              <Th style={{ textAlign: "left" }}>Equipe</Th>
              <Th>Workouts</Th>
              <Th>Pontuação</Th>
            </Tr>
          </Thead>

          <Tbody>
            {data.map((row) => (
              <Tr style={{ transform: "skew(-10deg)" }} key={row.colocacao}>
                <Td style={{ textAlign: "center" }}>
                  <Position>{row.colocacao}</Position>
                </Td>
                <Td>
                  <FlexColumnAlignStart>
                    <PairName>Nome da dupla</PairName>
                    <CompetitorsName>
                      Competidor 1 / Competidor 2
                    </CompetitorsName>
                  </FlexColumnAlignStart>
                </Td>
                <Td>
                  <FlexRow>
                    <FlexColumn>
                      <WorkoutName>1</WorkoutName>
                      <Point>00</Point>
                    </FlexColumn>
                    <FlexColumn>
                      <WorkoutName>2.1</WorkoutName>
                      <Point>00</Point>
                    </FlexColumn>
                    <FlexColumn>
                      <WorkoutName>2.2</WorkoutName>
                      <Point>00</Point>
                    </FlexColumn>
                    <FlexColumn>
                      <WorkoutName>2.3</WorkoutName>
                      <Point>00</Point>
                    </FlexColumn>
                    <FlexColumn>
                      <WorkoutName>3</WorkoutName>
                      <Point>00</Point>
                    </FlexColumn>
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
    </Container>
  );
};
