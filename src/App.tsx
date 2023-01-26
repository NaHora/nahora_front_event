import AppRoutes from "./routes";

import { ThemeProvider, Box } from "@mui/system";
import { theme } from "./styles/global";
import AppProvider from "./hooks";
import { GlobalStyle, ToastContainerStyled } from "./styles/styledGlobal";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
          <ToastContainerStyled autoClose={3000} />
        </AppProvider>
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
