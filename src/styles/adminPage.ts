import styled from 'styled-components';

const cardSurface = `
  background:
    linear-gradient(180deg, rgba(17, 25, 40, 0.9), rgba(10, 15, 26, 0.92));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
`;

export const Container = styled.div`
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  color: var(--text-primary);

  @media only screen and (max-width: 768px) {
    padding: 16px;
    gap: 18px;
  }
`;

export const EventImage = styled.img`
  width: min(100%, 280px);
  max-height: 108px;
  object-fit: contain;
  filter: drop-shadow(0 18px 35px rgba(0, 0, 0, 0.35));
`;

export const Content = styled.div`
  ${cardSurface};
  width: min(1240px, 100%);
  border-radius: 30px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media only screen and (max-width: 768px) {
    border-radius: 24px;
    padding: 18px;
    gap: 18px;
  }
`;

export const ContentHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilteredContainer = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;

  @media only screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

export const FilteredSelect = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const HeaderContainer = styled.div`
  ${cardSurface};
  width: 100%;
  border-radius: 22px;
  padding: 18px;
  display: flex;
  gap: 18px;
  align-items: center;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(6, 10, 19, 0.58);
`;

export const SelectLabel = styled.span`
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-muted);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
`;

export const Tbody = styled.tbody``;

export const Thead = styled.thead`
  background: rgba(255, 255, 255, 0.03);
`;

export const Tr = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

export const Th = styled.th`
  padding: 18px 16px;
  text-align: left;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  white-space: nowrap;

  @media only screen and (max-width: 768px) {
    padding: 14px 12px;
    font-size: 0.72rem;
  }
`;

export const Td = styled.td`
  padding: 16px;
  color: var(--text-primary);
  vertical-align: middle;

  @media only screen and (max-width: 768px) {
    padding: 14px 12px;
  }
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FlexColumnAlignStart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

export const PairName = styled.span`
  font-weight: 700;
  font-size: 0.96rem;
  color: var(--text-primary);
`;

export const Points = styled.span`
  font-weight: 700;
  color: var(--text-primary);
`;

export const TieBreak = styled.span`
  color: var(--text-secondary);
`;

export const CompetitorsName = styled.span`
  font-size: 0.84rem;
  color: var(--text-secondary);
`;

const actionButton = `
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 999px;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(243, 114, 44, 0.16);
    border-color: rgba(243, 114, 44, 0.35);
  }
`;

export const Delete = styled.button`
  ${actionButton}
`;

export const Edit = styled.button`
  ${actionButton}
`;

export const Select = styled.select`
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text-primary);
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text-primary);

  &::placeholder {
    color: var(--text-muted);
  }
`;

export const DrawerSelect = styled.select`
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text-primary);
`;

export const SelectDiv = styled.div`
  min-width: 220px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
`;

export const DrawerSelectDiv = styled.div`
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  margin-top: 20px;
`;

export const DrawerContainer = styled.div`
  width: min(100vw, 520px);
  min-height: 100%;
  padding: 32px 28px;
  background:
    radial-gradient(circle at top, rgba(243, 114, 44, 0.18), transparent 28%),
    linear-gradient(180deg, #101826, #0a0f18 65%);

  @media only screen and (max-width: 768px) {
    width: min(100vw, 420px);
    padding: 24px 18px;
  }
`;

export const ResultForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const SelectOption = styled.option`
  color: #08111d;
`;

export const DrawerTitle = styled.span`
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
`;

export const InputLabel = styled.h2`
  color: var(--text-secondary);
  font-size: 0.84rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-top: 22px;
  margin-bottom: 8px;
`;
