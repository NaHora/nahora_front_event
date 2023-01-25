import { Button, TextField } from "@mui/material";
import { Container, Content, EventImage, LoginTitle } from "./styles";
import { useNavigate } from "react-router-dom";
import EventLogo from "../../assets/event-logo.png";
import { Box, height } from "@mui/system";

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
          <TextField
            id="outlined-basic"
            label=""
            variant="outlined"
            type={"email"}
            sx={{
              width: "100%",
              marginTop: "71px",
              backgroundColor: "#121214",
              borderRadius: "4px",
            }}
          />
          <TextField
            id="outlined-basic"
            label=""
            variant="outlined"
            sx={{
              width: "100%",
              marginTop: "60px",
              borderColor: "#fff",
              color: "#fff",
              backgroundColor: "#121214",
              borderRadius: "4px",
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
          >
            Login
          </Button>
        </Content>
      </Box>
    </Container>
  );
};
