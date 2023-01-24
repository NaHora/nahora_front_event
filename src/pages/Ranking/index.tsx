import { Container, CategoryTitle, TableContainer, Table, Tr, Th, Td } from './styles';
import { useTable } from 'react-table';
import React from 'react';

export const Ranking = () => {
  const resultado = [
    {
      colocacao: 1,
      nomeDupla: 'Dupla 1',
      competidores: 'Competidor 1 e Competidor 2',
      resultados: '100, 200, 10, 90, 80',
      total: 100,
    },
    {
      colocacao: 2,
      nomeDupla: 'Dupla 1',
      competidores: 'Competidor 1 e Competidor 2',
      resultados: '100, 200, 10, 90, 80',
      total: 200,
    },
    {
      colocacao: 3,
      nomeDupla: 'Dupla 1',
      competidores: 'Competidor 1 e Competidor 2',
      resultados: '100, 200, 10, 90, 80',
      total: 300,
    },
    {
      colocacao: 4,
      nomeDupla: 'Dupla 1',
      competidores: 'Competidor 1 e Competidor 2',
      resultados: '100, 200, 10, 90, 80',
      total: 400,
    },
    {
      colocacao: 5,
      nomeDupla: 'Dupla 1',
      competidores: 'Competidor 1 e Competidor 2',
      resultados: '100, 200, 10, 90, 80',
      total: 100,
    },
    {
      colocacao: 6,
      nomeDupla: 'Dupla 1',
      competidores: 'Competidor 1 e Competidor 2',
      resultados: '100, 200, 10, 90, 80',
      total: 100,
    },
    {
      colocacao: 7,
      nomeDupla: 'Dupla 1',
      competidores: 'Competidor 1 e Competidor 2',
      resultados: '100, 200, 10, 90, 80',
      total: 100,
    },
    {
      colocacao: 8,
      nomeDupla: 'Dupla 1',
      competidores: 'Competidor 1 e Competidor 2',
      resultados: '100, 200, 10, 90, 80',
      total: 100,
    },
  ];

  const data = React.useMemo(() => resultado, []);
  const columns = React.useMemo(
    () => [
      { Header: 'Posição', accessor: 'colocacao' },
      { Header: 'Equipe', accessor: 'nomeDupla' },
      { Header: 'Workouts', accessor: 'resultados' },
      { Header: 'Pontuação', accessor: 'total' },
    ],
    []
  );

  return (
    <Container>
      <CategoryTitle>RX - MASCULINO</CategoryTitle>
      <TableContainer>
        <Table>
          <Tr>
            {columns.map((column) => (
              <Th>{column.Header}</Th>
            ))}
          </Tr>

          {data.map((row) => (
            <Tr>
              <Td>{row.colocacao}</Td>
              <Td>{row.competidores}</Td>
              <Td>{row.resultados}</Td>
              <Td>{row.total}</Td>
            </Tr>
          ))}
        </Table>
      </TableContainer>
    </Container>
  );
};
