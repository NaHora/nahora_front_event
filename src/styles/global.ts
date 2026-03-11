import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#f3722c',
      dark: '#cf5b1d',
      light: '#ff9f68',
    },
    secondary: {
      main: '#0b1220',
    },
    info: {
      main: '#101826',
    },
    error: {
      main: '#D54C46',
    },
    mode: 'dark',
  },
  typography: {
    fontFamily: '"Space Grotesk", "Instrument Sans", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
          paddingBlock: 10,
          boxShadow: 'none',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #f3722c, #f9c74f)',
          color: '#09111c',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 18,
            background: 'rgba(255,255,255,0.04)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #101826, #0b1220)',
          color: '#f8fafc',
        },
      },
    },
  },
});
