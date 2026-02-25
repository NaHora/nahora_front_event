import styled from 'styled-components';

export const Container = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #f5f5f5;
`;

export const Content = styled.div`
  background: #29282e;
  padding: 32px;
  border-radius: 8px;
  max-width: 1120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: -40px;

  @media only screen and (max-width: 768px) {
    padding: 12px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const WithdrawForm = styled.form`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #f04c12;
`;

export const Thead = styled.thead``;

export const Tr = styled.tr`
  background-color: #121214;
`;

export const Th = styled.th`
  padding: 12px 8px;
  text-align: left;
  font-size: 14px;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 10px 8px;
  border-top: 1px solid rgba(240, 76, 18, 0.2);
  font-size: 14px;
  white-space: nowrap;
`;
