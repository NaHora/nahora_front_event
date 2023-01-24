import { Button } from '@mui/material';
import { Container } from './styles';
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Button onClick={() => navigate('/signup')}>SignIn</Button>
    </Container>
  );
};
