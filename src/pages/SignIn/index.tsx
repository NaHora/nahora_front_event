import { Button, InputAdornment, TextField } from "@mui/material";
import {
  Container,
  Content,
  EventImage,
  LoginTitle,
  LoginEmail,
  LoginPassword,
} from "./styles";
import { useNavigate } from "react-router-dom";
import EventLogo from "../../assets/event-logo-login.png";
import { Box } from "@mui/system";
import EmailSharpIcon from "@mui/icons-material/EmailSharp";
import LockSharpIcon from "@mui/icons-material/LockSharp";

export const SignIn = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <EventImage src={EventLogo} alt="event logo" />
      <Box
        sx={{
          width: "724px",
          height: "660px",
          backgroundColor: "#29282E",
        }}
      >
        <Content>
          <LoginTitle>Login</LoginTitle>
          <LoginEmail>E-mail</LoginEmail>
          <TextField
            id="outlined-basic"
            label=""
            variant="outlined"
            type={"email"}
            sx={{
              width: "100%",
              backgroundColor: "#121214",
              borderRadius: "4px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailSharpIcon sx={{ fontSize: 24, color: "#29282E4D" }} />
                </InputAdornment>
              ),
            }}
          />
          <LoginPassword>Senha</LoginPassword>
          <TextField
            id="outlined-basic"
            label=""
            variant="outlined"
            sx={{
              width: "100%",
              backgroundColor: "#121214",
              borderRadius: "4px",
              color: "#fff",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockSharpIcon sx={{ fontSize: 24, color: "#29282E4D" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#EF144D",
              width: "100%",
              height: "58px",
              marginTop: "70px",
            }}
            onClick={() => navigate("/signup")}
          >
            Login
          </Button>
        </Content>
      </Box>
    </Container>
  );
};
