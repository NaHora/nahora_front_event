import styled, { createGlobalStyle } from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline:0;
    box-sizing: border-box;
  }

  body{
    background-color: #121214;
 
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font: 16px 'Roboto', serif;
  }

  h1,h2,h3,h4,h5,h6,strong {
    font-weight: 500;
  }

  button{
    cursor: pointer;
  }
`;

export const ToastContainerStyled = styled(ToastContainer)`
  margin-top: 80px;
  padding: 0 16px;
  .Toastify__toast--info {
    background: "#232746";
  }

  .Toastify__toast--success {
    background: "#2DB350";
  }

  .Toastify__toast--warning {
    background: "#EBA41D";
  }

  .Toastify__toast--error {
    background: "#FF595C";
  }
`;
