import { Button } from '@mui/material';
import { Container } from './styles';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Button onClick={() => navigate('/signin')}>Ranking</Button>
    </Container>
  );
};
