import styled from "styled-components";
import { theme } from "../../styles/global";

export const Container = styled.div`
  background-color: ${theme.palette.secondary.main};
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EventImage = styled.img``;

export const Content = styled.div`
  background: #29282e;
  padding: 125px 96px;

  flex-direction: column;
  align-items: flex-start;
`;

export const LoginTitle = styled.h1`
  color: #f5f5f5;
  font-size: 25px;
`;
