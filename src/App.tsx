import AppRoutes from "./routes";
import GlobalStyle from "./styles/styledGlobal";
import { ThemeProvider, Box } from "@mui/system";
import { theme } from "./styles/global";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
