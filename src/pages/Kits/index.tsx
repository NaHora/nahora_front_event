import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  Paper,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import { QrReader } from 'react-qr-reader';
import api from '../../services/api';
import { useEvent } from '../../contexts/EventContext';
import { toast } from 'react-toastify';
import Navbar from '../../components/navbar';
import { Container } from '../Teams/styles';

type AthleteDto = {
  id: string;
  name: string;
  shirt_size: string;
  cpf: string;
};

type TeamDTO = {
  id: string;
  name: string;
  active: boolean;
  box: string;
  category_id: string;
  athletes: AthleteDto[];
  categoryName?: string;
  kit_delivered: boolean;
};

type CategoryDTO = {
  id: string;
  name: string;
};

export default function Kit() {
  const { currentEvent } = useEvent();

  const [teams, setTeams] = useState<TeamDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamDTO | null>(null);
  const [teamValid, setTeamValid] = useState<boolean | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [isProcessingQR, setIsProcessingQR] = useState(false);
  const fetchData = async () => {
    const [teamsRes, categoriesRes] = await Promise.all([
      api.get(`/teams/event/${currentEvent}`),
      api.get(`/category/event/${currentEvent}`),
    ]);

    const teamsData = teamsRes.data;
    const categoriesData = categoriesRes.data;

    const teamsWithCategory = teamsData.map((team: TeamDTO) => ({
      ...team,
      categoryName:
        categoriesData.find((cat: CategoryDTO) => cat.id === team.category_id)
          ?.name || 'Sem categoria',
    }));

    setTeams(teamsWithCategory);
    setCategories(categoriesData);
  };
  useEffect(() => {
    if (!currentEvent) return;

    fetchData();
  }, [currentEvent]);

  const handleSelectTeam = (team: TeamDTO | null) => {
    setSelectedTeam(team);
    setTeamValid(team?.active ?? false);
  };

  const handleQRResult = (result: string | null) => {
    console.log('QR Result:', result);
    if (result && !isProcessingQR) {
      setIsProcessingQR(true);

      const teamId = result.trim();
      const foundTeam = teams.find((t) => t.id === teamId);

      if (foundTeam) {
        handleSelectTeam(foundTeam);
        setShowQR(false); // fecha leitor apenas se for válido
      } else {
        // NÃO limpa seleção anterior
        // Só marca como inválido para deixar vermelho
        setTeamValid(false);
      }

      // Libera leitura novamente após 2s
      setTimeout(() => setIsProcessingQR(false), 2000);
    }
  };

  const reset = () => {
    setSelectedTeam(null);
    setShowQR(false);
    setTeamValid(null);
  };

  async function updateTeam() {
    if (!selectedTeam?.id) return;

    try {
      await api.put(`/teams/`, {
        teamId: selectedTeam.id,
        kit_delivered: true,
      });
      toast.success('Kit entregue com sucesso!');
      fetchData();
      reset(); // limpa os dados após entrega
    } catch (error) {
      console.error(error);
      toast.error('Erro ao registrar entrega do kit.');
    }
  }

  return (
    <Container>
      <Navbar />
      <Box p={4}>
        <Typography variant="h5" gutterBottom>
          Validação de Time
        </Typography>

        <Autocomplete
          options={teams.filter((team) => team.active)}
          getOptionLabel={(option) => option.name}
          value={selectedTeam}
          onChange={(e, value) => handleSelectTeam(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Digite o nome do time"
              variant="outlined"
              fullWidth
              sx={{
                mt: 2,
                border:
                  teamValid === null
                    ? undefined
                    : `2px solid ${teamValid ? 'green' : 'red'}`,
                borderRadius: 1,
              }}
            />
          )}
        />

        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => {
            reset();
            setShowQR(!showQR);
          }}
        >
          {showQR ? 'Fechar QR Code' : 'Ler QR Code'}
        </Button>

        {showQR && (
          <Box sx={{ mt: 2, maxWidth: 320 }}>
            <QrReader
              key={String(showQR)} // força desmontagem quando muda
              constraints={{ facingMode: 'environment' }}
              scanDelay={500}
              onResult={(result, error) => {
                if (result?.getText()) {
                  handleQRResult(result.getText());
                }
              }}
            />
          </Box>
        )}
        {teamValid === false && (
          <Typography color="error" sx={{ mt: 1 }}>
            QR Code inválido ou time inativo.
          </Typography>
        )}
        {selectedTeam && (
          <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6">{selectedTeam.name}</Typography>
            <Typography>Box: {selectedTeam.box}</Typography>
            <Typography>Categoria: {selectedTeam.categoryName}</Typography>
            <Typography>
              Kit Entregue: {selectedTeam.kit_delivered ? 'Sim' : 'Nâo'}
            </Typography>
            <Typography color={teamValid ? 'green' : 'red'}>
              {teamValid ? 'Time válido' : 'Time inativo ou não encontrado'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Atletas:</Typography>
            {selectedTeam.athletes.map((athlete) => (
              <Box key={athlete.id} sx={{ mb: 1 }}>
                <Typography>
                  {athlete.name} — Documento: {athlete.cpf} — Camiseta:{' '}
                  {athlete.shirt_size}
                </Typography>
              </Box>
            ))}
            <Stack direction="row" spacing={2} mt={3}>
              <Button variant="outlined" color="primary" onClick={reset}>
                Voltar
              </Button>
              <Button
                variant="contained"
                color="success"
                disabled={!teamValid || selectedTeam.kit_delivered}
                onClick={updateTeam}
              >
                Entregar Kit
              </Button>
            </Stack>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
