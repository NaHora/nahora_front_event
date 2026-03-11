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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px;
  color: var(--text-primary);

  @media (max-width: 768px) {
    padding: 16px;
    gap: 18px;
  }
`;

export const Content = styled.div`
  width: min(1240px, 100%);
  display: grid;
  gap: 18px;
`;

export const Hero = styled.section`
  ${surface};
  border-radius: 32px;
  padding: 28px;
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    border-radius: 24px;
    padding: 18px;
  }
`;

export const HeroCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Eyebrow = styled.span`
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--text-muted);
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.6rem);
  line-height: 0.95;
`;

export const HeroSubtitle = styled.p`
  max-width: 58ch;
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.65;
`;

export const HeroMeta = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const MetaPill = styled.div`
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
`;

export const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  ${surface};
  border-radius: 24px;
  padding: 18px;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StatLabel = styled.span`
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.74rem;
`;

export const StatValue = styled.strong`
  font-size: clamp(1.6rem, 4vw, 2.5rem);
  line-height: 1;
  font-family: 'Space Grotesk', sans-serif;
`;

export const StatNote = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

export const ActionsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ActionCard = styled.button`
  ${surface};
  border-radius: 24px;
  padding: 20px;
  text-align: left;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(243, 114, 44, 0.28);
  }
`;

export const ActionTitle = styled.strong`
  font-size: 1.1rem;
`;

export const ActionText = styled.span`
  color: var(--text-secondary);
  line-height: 1.55;
`;

export const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.section`
  ${surface};
  border-radius: 28px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 768px) {
    border-radius: 22px;
    padding: 18px;
  }
`;

export const PanelTitle = styled.h2`
  font-size: 1.3rem;
`;

export const PanelSubTitle = styled.p`
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
`;

export const MiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const MiniCard = styled.div`
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MiniLabel = styled.span`
  color: var(--text-muted);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

export const MiniValue = styled.strong`
  font-size: 1.25rem;
  font-family: 'Space Grotesk', sans-serif;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ListItem = styled.div`
  padding: 14px 16px;
  border-radius: 18px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const ListItemTitle = styled.strong`
  font-size: 0.98rem;
`;

export const ListItemMeta = styled.span`
  color: var(--text-secondary);
  font-size: 0.88rem;
`;

export const EmptyState = styled.div`
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
`;
