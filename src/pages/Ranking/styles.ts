import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f5f5f5;
  background-color: #121214;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
`;

export const CategoryTitle = styled.h1`
  color: #f5f5f5;
  font-size: 40px;
`;

export const TableContainer = styled.div`
  background-color: #29282e;
`;

export const Table = styled.table`
  align-items: center;
  height: 100vh;
  width: 100vw;
`;
export const Tr = styled.tr`
  height: 72px;
  background-color: #313037;
  box-shadow: 0px 4px 9px #121214, inset 0px -17px 32px #121214, inset 0px 17px 32px #121214;
`;

export const Th = styled.th`
  text-align: center;
  background-color: #121214;
  margin-bottom: 18px;
`;

export const Td = styled.td`
  text-align: center;
`;
