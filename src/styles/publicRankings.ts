import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(6px);
  }
`;

const surface = `
  background:
    linear-gradient(180deg, rgba(15, 23, 37, 0.9), rgba(8, 12, 22, 0.94));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
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

  @media only screen and (max-width: 768px) {
    padding: 16px;
  }
`;

export const EventImage = styled.img`
  width: min(100%, 320px);
  max-height: 120px;
  object-fit: contain;
`;

export const Content = styled.div`
  ${surface};
  padding: 24px;
  border-radius: 30px;
  width: min(1240px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  margin-bottom: 28px;

  .hide {
    animation: ${fadeOut} 120ms linear forwards;
  }

  @media only screen and (max-width: 768px) {
    padding: 18px;
    border-radius: 24px;
  }
`;

export const SelectContent = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  gap: 16px;
  justify-content: space-between;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
`;

export const SelectTitle = styled.p`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

export const SelectDiv = styled.div`
  width: 100%;
  padding-right: 12px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
`;

export const Select = styled.select`
  border-radius: 18px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  width: 100%;
  padding: 14px 16px;
`;

export const SelectOption = styled.option`
  color: #08111d;
`;

export const WorkoutDiv = styled.div`
  ${surface};
  width: 100%;
  border-radius: 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  color: var(--text-primary);
  font-weight: 700;
  font-size: clamp(1.4rem, 3vw, 2.4rem);
  text-align: center;

  span:first-child {
    margin-bottom: 10px;
  }
`;

export const WorkoutDescription = styled.span`
  font-weight: 400;
  margin-top: 8px;
  font-size: 1rem;
  color: var(--text-secondary);
`;

export const CategoryTitle = styled.h1`
  color: var(--text-primary);
  font-size: clamp(1.8rem, 4vw, 3.1rem);
  text-align: center;
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 24px;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: separate;
  border-spacing: 0 10px;
`;

export const Tbody = styled.tbody``;

export const Thead = styled.thead``;

export const Tr = styled.tr`
  background: rgba(255, 255, 255, 0.04);

  td:first-child,
  th:first-child {
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
  }

  td:last-child,
  th:last-child {
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
  }
`;

export const Th = styled.th`
  padding: 16px 12px;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.06);
`;

export const Td = styled.td`
  padding: 16px 12px;
  text-align: center;
`;

export const Position = styled.span`
  font-weight: 800;
  font-size: clamp(1rem, 2vw, 1.35rem);
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
`;

export const FlexColumnAlignStart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const PairName = styled.span`
  font-weight: 800;
  font-size: 1rem;
`;

export const CompetitorsName = styled.span`
  font-weight: 400;
  font-size: 0.82rem;
  color: var(--text-secondary);
`;

export const WorkoutName = styled.span`
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--accent-2);
`;

export const Point = styled.span`
  font-weight: 800;
  font-size: 1rem;
`;

export const Score = styled.span`
  font-weight: 800;
  font-size: 1.1rem;
`;

export const Total = styled.div`
  min-width: 56px;
  padding: 10px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #09111c;
  font-weight: 900;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

export const InputLabel = styled.h2`
  color: var(--text-muted);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 8px;
`;
