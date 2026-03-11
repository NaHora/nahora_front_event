import styled, { createGlobalStyle } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap');

  :root{
    --bg: #071018;
    --bg-soft: #0b1220;
    --surface: rgba(14, 22, 36, 0.82);
    --surface-2: rgba(255,255,255,0.04);
    --accent: #f3722c;
    --accent-2: #f9c74f;
    --text-primary: #f8fafc;
    --text-secondary: rgba(248,250,252,0.78);
    --text-muted: rgba(248,250,252,0.52);
    --line: rgba(255,255,255,0.08);
  }

  *{
    margin: 0;
    padding: 0;
    outline:0;
    box-sizing: border-box;
  }

  body{
    background:
      radial-gradient(circle at top left, rgba(243, 114, 44, 0.18), transparent 24%),
      radial-gradient(circle at top right, rgba(74, 222, 128, 0.12), transparent 22%),
      linear-gradient(180deg, #071018 0%, #0b1220 45%, #05080f 100%);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  body, input, button {
    font: 16px 'Instrument Sans', sans-serif;
  }

  #root {
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1,h2,h3,h4,h5,h6,strong {
    font-family: 'Space Grotesk', sans-serif;
  }

  button{
    cursor: pointer;
  }

  ::selection {
    background: rgba(243, 114, 44, 0.34);
  }
`;

export const ToastContainerStyled = styled(ToastContainer)`
  margin-top: 24px;
  padding: 0 16px;
  .Toastify__toast {
    border-radius: 18px;
    background: #101826;
    color: #f8fafc;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 18px 50px rgba(0,0,0,0.28);
  }
`;
