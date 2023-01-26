import AppRoutes from "./routes";

import { ThemeProvider, Box } from "@mui/system";
import { theme } from "./styles/global";
import AppProvider from "./hooks";
import { GlobalStyle, ToastContainerStyled } from "./styles/styledGlobal";


function App() {
  return (
    <ThemeProvider theme={theme}>

      <AppProvider>
        <AppRoutes />
        <ToastContainerStyled autoClose={3000} />
      </AppProvider>

      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
