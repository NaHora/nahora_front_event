import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#EF144D",
    },
    secondary: {
      main: "#0b0b0b",
    },
    info: {
      main: "#111111",
    },
    error: {
      main: "#D54C46",
    },
    mode: "dark",
  },
  typography: {
    fontFamily: "Epilogue",
  },
});
