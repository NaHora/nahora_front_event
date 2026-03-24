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
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

export const HeaderEyebrow = styled.span`
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

export const HeaderSubtitle = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.96rem;
  line-height: 1.5;
  max-width: 760px;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media only screen and (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media only screen and (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div<{ $tone?: 'available' | 'waiting' | 'neutral' | 'withdraw' }>`
  ${surface};
  border-radius: 24px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 142px;
  position: relative;
  overflow: hidden;

  ${({ $tone }) =>
    $tone === 'available' &&
    `
      background:
        radial-gradient(circle at top right, rgba(43, 214, 123, 0.18), transparent 34%),
        linear-gradient(180deg, rgba(13, 21, 33, 0.92), rgba(9, 14, 23, 0.96));
      border-color: rgba(43, 214, 123, 0.24);
    `}

  ${({ $tone }) =>
    $tone === 'waiting' &&
    `
      background:
        radial-gradient(circle at top right, rgba(249, 199, 79, 0.16), transparent 34%),
        linear-gradient(180deg, rgba(13, 21, 33, 0.92), rgba(9, 14, 23, 0.96));
      border-color: rgba(249, 199, 79, 0.2);
    `}

  ${({ $tone }) =>
    $tone === 'withdraw' &&
    `
      background:
        radial-gradient(circle at top right, rgba(243, 114, 44, 0.16), transparent 34%),
        linear-gradient(180deg, rgba(13, 21, 33, 0.92), rgba(9, 14, 23, 0.96));
      border-color: rgba(243, 114, 44, 0.22);
    `}
`;

export const SummaryLabel = styled.span`
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

export const SummaryValue = styled.strong`
  font-size: clamp(1.5rem, 2vw, 2rem);
  line-height: 1;
  color: var(--text-primary);
`;

export const SummaryDescription = styled.span`
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.5;
`;

export const WithdrawForm = styled.form`
  ${surface};
  border-radius: 24px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media only screen and (max-width: 860px) {
    padding: 16px;
  }
`;

export const WithdrawInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const WithdrawHint = styled.span`
  color: var(--text-muted);
  font-size: 0.82rem;
  line-height: 1.45;
`;

export const WithdrawControls = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 320px) repeat(2, auto);
  gap: 12px;
  align-items: end;

  @media only screen and (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const WithdrawMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media only screen and (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const WithdrawMetaCard = styled.div<{ $tone?: 'fee' | 'net' | 'warning' }>`
  border-radius: 18px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 6px;

  ${({ $tone }) =>
    $tone === 'fee'
      ? `
        border-color: rgba(255, 107, 107, 0.16);
        background: rgba(255, 107, 107, 0.08);
      `
      : ''}

  ${({ $tone }) =>
    $tone === 'net'
      ? `
        border-color: rgba(43, 214, 123, 0.18);
        background: rgba(43, 214, 123, 0.08);
      `
      : ''}

  ${({ $tone }) =>
    $tone === 'warning'
      ? `
        border-color: rgba(249, 199, 79, 0.18);
        background: rgba(249, 199, 79, 0.08);
      `
      : ''}
`;

export const WithdrawMetaLabel = styled.span`
  color: var(--text-muted);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const WithdrawMetaValue = styled.strong`
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.2;
`;

export const WithdrawMetaText = styled.span`
  color: var(--text-secondary);
  font-size: 0.84rem;
  line-height: 1.45;
`;

export const DisclaimerBox = styled.div`
  border-radius: 18px;
  padding: 14px 16px;
  border: 1px solid rgba(249, 199, 79, 0.18);
  background:
    linear-gradient(180deg, rgba(249, 199, 79, 0.1), rgba(249, 199, 79, 0.04));
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
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

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
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

export const StatusBadge = styled.span<{ $status?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 92px;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);

  ${({ $status }) =>
    ($status || '').toLowerCase() === 'paid' ||
    ($status || '').toLowerCase() === 'success' ||
    ($status || '').toLowerCase() === 'processed'
      ? `
        color: #8ff0b3;
        background: rgba(43, 214, 123, 0.12);
        border-color: rgba(43, 214, 123, 0.18);
      `
      : ''}

  ${({ $status }) =>
    ($status || '').toLowerCase() === 'pending' ||
    ($status || '').toLowerCase() === 'processing'
      ? `
        color: #f9c74f;
        background: rgba(249, 199, 79, 0.12);
        border-color: rgba(249, 199, 79, 0.18);
      `
      : ''}

  ${({ $status }) =>
    ($status || '').toLowerCase() === 'failed' ||
    ($status || '').toLowerCase() === 'canceled'
      ? `
        color: #ff8f8f;
        background: rgba(255, 107, 107, 0.12);
        border-color: rgba(255, 107, 107, 0.18);
      `
      : ''}
`;
