import styled from 'styled-components';
import { theme } from '../../styles/global';

export const Container = styled.div`
  background-color: ${theme.palette.secondary.main};
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const EventImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  margin-bottom: 16px;

  @media only screen and (max-width: 768px) {
    max-width: 300px;
  }
`;

export const Content = styled.div`
  background: #29282e;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 768px) {
    padding: 16px;
  }
`;

export const StepperWrapper = styled.div`
  width: 100%;
  margin-bottom: 24px;

  .MuiStepConnector-line {
    border-color: #f5f5f5;
  }

  @media only screen and (max-width: 768px) {
    .MuiStepLabel-label {
      font-size: 12px;
    }
  }
`;

export const LoginTitle = styled.h1`
  color: #f5f5f5;
  font-size: 28px;
  text-align: center;
  margin-bottom: 16px;

  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

export const StepTitle = styled.h1`
  color: #f5f5f5;
  font-size: 20px;

  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

export const Label = styled.label`
  color: #fff;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;

  button {
    width: 100%;
    max-width: 200px;
    font-size: 16px;
  }
`;
export const StepDiv = styled.div`
  margin-top: 16px;
`;
