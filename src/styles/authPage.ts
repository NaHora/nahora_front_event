import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
`;

export const EventImage = styled.img`
  width: min(100%, 320px);
  max-height: 110px;
  object-fit: contain;
  margin-bottom: 20px;
`;

export const Content = styled.div`
  width: min(100%, 520px);
  padding: 38px;
  border-radius: 30px;
  background:
    radial-gradient(circle at top, rgba(243, 114, 44, 0.15), transparent 30%),
    linear-gradient(180deg, rgba(14, 22, 36, 0.92), rgba(9, 14, 23, 0.94));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 32px 90px rgba(0, 0, 0, 0.42);

  @media only screen and (max-width: 768px) {
    padding: 22px 18px;
    border-radius: 24px;
  }
`;

export const LoginTitle = styled.h1`
  color: var(--text-primary);
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1;
`;

export const LoginEmail = styled.h2`
  color: var(--text-secondary);
  font-size: 0.82rem;
  margin-top: 28px;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
`;

export const LoginPassword = styled(LoginEmail)`
  margin-top: 18px;
`;
