import styled from 'styled-components';

const surface = `
  background:
    linear-gradient(180deg, rgba(13, 21, 33, 0.9), rgba(9, 14, 23, 0.94));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(14px);
`;

export const Container = styled.div`
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  color: var(--text-primary);
`;

export const Content = styled.div`
  ${surface};
  width: min(1240px, 100%);
  border-radius: 30px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const WithdrawForm = styled.form`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const Table = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  background: rgba(255, 255, 255, 0.03);
`;

export const Tr = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const Th = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 14px 12px;
  font-size: 0.92rem;
  white-space: nowrap;
`;
