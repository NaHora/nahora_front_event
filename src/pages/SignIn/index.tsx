import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
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
import EmailSharpIcon from "@mui/icons-material/EmailSharp";
import LockSharpIcon from "@mui/icons-material/LockSharp";
import * as Yup from "yup";
import { useAuth } from "../../hooks/auth";
import { useState } from "react";
import getValidationErrors from "../../utils";
import { toast } from "react-toastify";
export interface StateProps {
  [key: string]: any;
}
type SignInFormData = {
  email: string;
  password: string;
};
export const SignIn = () => {
  const { signIn } = useAuth();
  const [errors, setErrors] = useState<StateProps>({} as StateProps);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  async function handleSignIn() {
    setErrors({});
    setLoading(true);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Email inválido")
          .required("Email obrigatório"),
        password: Yup.string()
          .min(6, "Minimo de 6 caracteres")
          .required("Senha obrigatória"),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      await signIn(values);
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(err));

        return;
      }
      if (err?.response) {
        return toast.error(
          err?.response?.data?.message ||
            "Ocorreu um erro ao fazer login, cheque as credenciais"
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <EventImage src={EventLogo} alt="event logo" />
      <Content>
        <LoginTitle>Login</LoginTitle>
        <LoginEmail>E-mail</LoginEmail>
        <TextField
          id="outlined-basic"
          label=""
          size="small"
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          value={values.email}
          error={!!errors.email}
          helperText={errors.email}
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
          size="small"
          variant="outlined"
          type={"password"}
          sx={{
            width: "100%",
            backgroundColor: "#121214",
            borderRadius: "4px",
            color: "#fff",
          }}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          value={values.password}
          error={!!errors.password}
          helperText={errors.password}
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
          size="small"
          sx={{
            backgroundColor: "#EF144D",
            width: "100%",
            marginTop: "24px",
          }}
          onClick={handleSignIn}
        >
          {loading ? <CircularProgress /> : "Login"}
        </Button>
      </Content>
    </Container>
  );
};
