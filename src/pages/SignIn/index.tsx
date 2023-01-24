import { Button } from "@mui/material";
import { Container, EventImage } from "./styles";
import { useNavigate } from "react-router-dom";
import EventLogo from "../../assets/event-logo.png";
import { Box } from "@mui/system";

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
      ></Box>
    </Container>
  );
};
