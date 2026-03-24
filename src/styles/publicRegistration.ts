import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-primary);

  @media only screen and (max-width: 768px) {
    padding: 16px;
  }
`;

export const EventImage = styled.img`
  width: min(100%, 420px);
  max-height: 160px;
  object-fit: contain;
  margin-bottom: 24px;
`;

export const Content = styled.div`
  width: min(100%, 920px);
  padding: 28px;
  border-radius: 30px;
  background:
    radial-gradient(circle at top, rgba(243, 114, 44, 0.18), transparent 26%),
    linear-gradient(180deg, rgba(13, 21, 33, 0.93), rgba(9, 14, 22, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.4);

  @media only screen and (max-width: 768px) {
    padding: 18px;
    border-radius: 24px;
  }
`;

export const StepperWrapper = styled.div`
  margin-bottom: 26px;
`;

export const LoginTitle = styled.h1`
  color: var(--text-primary);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
`;

export const StepTitle = styled.h1`
  color: var(--text-primary);
  font-size: clamp(1.3rem, 3vw, 2rem);
  margin-bottom: 20px;
`;

export const RegisterPayment = styled.h1`
  color: var(--text-primary);
  font-size: clamp(1.1rem, 3vw, 1.7rem);
  margin-bottom: 14px;
`;

export const Label = styled.label`
  display: block;
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 6px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 22px;
  flex-wrap: wrap;
`;

export const StepDiv = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 18px;
`;
