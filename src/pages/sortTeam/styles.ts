import styled from "styled-components";
import { theme } from "../../styles/global";

export const Container = styled.div`
  background-color: ${theme.palette.secondary.main};
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
`;

export const EventImage = styled.img`
  @media only screen and (max-width: 768px) {
    width: 360px;
  }
`;

export const Content = styled.div`
  background: #29282e;
  padding: 128px 96px;
  max-width: 724px;
  width: 100%;
  border-radius: 4px;
  flex-direction: column;

  @media only screen and (max-width: 768px) {
    padding: 24px 16px;
  }
`;

export const LoginTitle = styled.h1`
  color: #f5f5f5;

  font-size: 35px;
`;

export const LoginEmail = styled.h2`
  color: #f5f5f5;
  font-size: 16px;

  margin-top: 35px;
  margin-bottom: 4px;
`;

export const LoginPassword = styled.h2`
  color: #f5f5f5;
  font-size: 16px;

  margin-top: 18px;
  margin-bottom: 4px;
`;
