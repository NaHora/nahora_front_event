import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// Define the types for Player and Team
type Player = {
  id: number;
  name: string;
  rating: number;
};

type Team = Player[];

const SortTeam: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [bulkNames, setBulkNames] = useState<string>('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [numTeams, setNumTeams] = useState<number>(2);

  // Load players from localStorage on mount
  useEffect(() => {
    const storedPlayers = JSON.parse(
      localStorage.getItem('players') || '[]'
    ) as Player[];
    setPlayers(storedPlayers);
  }, []);

  // Save players to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  // Add new player
  const addPlayer = () => {
    if (playerName.trim()) {
      const newPlayer: Player = {
        id: Date.now(),
        name: playerName.trim(),
        rating: 3, // Default rating of 3
      };
      setPlayers([...players, newPlayer]);
      setPlayerName('');
    }
  };

  // Add players in bulk
  const addPlayersInBulk = () => {
    const names = bulkNames
      .split('\n') // Split by lines
      .map((line) => line.replace(/^\d+-/, '').trim()) // Remove numbering (e.g., "1-") and trim whitespace
      .filter((name) => name && name !== '-'); // Exclude empty or invalid names

    const newPlayers = names.map((name, index) => ({
      id: Date.now() + Math.random(), // Unique ID for each player
      name,
      rating: 3, // Default rating
    }));

    setPlayers([...players, ...newPlayers]);
    setBulkNames('');
  };

  // Update player rating
  const updateRating = (id: number, change: number) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === id
          ? {
              ...player,
              rating: Math.max(1, Math.min(5, player.rating + change)),
            }
          : player
      )
    );
  };

  // Delete player
  const deletePlayer = (id: number) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  };

  // Reset all players
  const resetPlayers = () => {
    setPlayers([]);
    setTeams([]);
  };

  // Sort players into balanced teams
  const sortTeams = () => {
    // Sort players by rating in descending order
    const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

    // Initialize empty teams
    const newTeams: Team[] = Array.from({ length: numTeams }, () => []);

    // Distribute players into teams to balance total ratings
    sortedPlayers.forEach((player) => {
      // Find the team with the lowest total rating
      const teamWithLowestRating = newTeams.reduce(
        (lowestTeamIndex, currentTeam, currentIndex, teams) => {
          const lowestRating = teams[lowestTeamIndex].reduce(
            (sum, p) => sum + p.rating,
            0
          );
          const currentRating = currentTeam.reduce(
            (sum, p) => sum + p.rating,
            0
          );
          return currentRating < lowestRating ? currentIndex : lowestTeamIndex;
        },
        0
      );

      // Add the player to the team with the lowest total rating
      newTeams[teamWithLowestRating].push(player);
    });

    setTeams(newTeams);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 2, md: 3 },
        color: 'var(--text-primary)',
      }}
    >
      <Box
        sx={{
          width: 'min(1100px, 100%)',
          mx: 'auto',
          display: 'grid',
          gap: 2,
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: '28px',
            background:
              'linear-gradient(180deg, rgba(13,21,33,0.92), rgba(9,14,23,0.96))',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 28px 80px rgba(0,0,0,0.34)',
          }}
        >
          <Typography variant="overline" sx={{ color: 'var(--text-muted)' }}>
            Pelada tools
          </Typography>
          <Typography variant="h3">Montador de times equilibrados</Typography>
          <Typography sx={{ color: 'var(--text-secondary)', mt: 1.5 }}>
            Adicione atletas, ajuste a forca de cada um e distribua em equipes
            com equilibrio de rating.
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mt={3}>
            <TextField
              fullWidth
              label="Nome do jogador"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <Button variant="contained" onClick={addPlayer}>
              Adicionar jogador
            </Button>
          </Stack>

          <TextField
            fullWidth
            multiline
            minRows={6}
            label="Lista em bloco"
            value={bulkNames}
            onChange={(e) => setBulkNames(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mt={2}>
            <TextField
              type="number"
              label="Numero de times"
              inputProps={{ min: 2 }}
              value={numTeams}
              onChange={(e) => setNumTeams(Number(e.target.value))}
              sx={{ maxWidth: 200 }}
            />
            <Button variant="outlined" onClick={addPlayersInBulk}>
              Importar lista
            </Button>
            <Button variant="contained" onClick={sortTeams}>
              Sortear equipes
            </Button>
            <Button variant="text" onClick={resetPlayers}>
              Limpar tudo
            </Button>
          </Stack>
        </Paper>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
          <Paper
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: '24px',
              background: 'rgba(13,21,33,0.9)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Typography variant="h5" mb={2}>
              Jogadores
            </Typography>
            <Stack spacing={1.2}>
              {players.map((player, index) => (
                <Stack
                  key={player.id}
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                  sx={{
                    p: 1.5,
                    borderRadius: '18px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <Box>
                    <Typography fontWeight={700}>
                      {index + 1}. {player.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      Rating atual: {player.rating}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button size="small" variant="outlined" onClick={() => updateRating(player.id, -1)}>
                      -
                    </Button>
                    <Chip label={player.rating} />
                    <Button size="small" variant="outlined" onClick={() => updateRating(player.id, 1)}>
                      +
                    </Button>
                    <Button size="small" color="error" onClick={() => deletePlayer(player.id)}>
                      Excluir
                    </Button>
                  </Stack>
                </Stack>
              ))}
              {players.length === 0 && (
                <Typography sx={{ color: 'var(--text-secondary)' }}>
                  Nenhum jogador adicionado ainda.
                </Typography>
              )}
            </Stack>
          </Paper>

          <Paper
            sx={{
              flex: 1,
              p: 2.5,
              borderRadius: '24px',
              background: 'rgba(13,21,33,0.9)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Typography variant="h5" mb={2}>
              Times sorteados
            </Typography>
            <Stack spacing={1.5}>
              {teams.map((team, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: '20px',
                    background:
                      'linear-gradient(135deg, rgba(243,114,44,0.14), rgba(255,255,255,0.04))',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Typography variant="h6">Time {index + 1}</Typography>
                  <Typography sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                    Rating total: {team.reduce((sum, player) => sum + player.rating, 0)}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    {team.map((player) => (
                      <Chip
                        key={player.id}
                        label={`${player.name} · ${player.rating}`}
                        sx={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
              {teams.length === 0 && (
                <Typography sx={{ color: 'var(--text-secondary)' }}>
                  Gere os times para visualizar a distribuicao.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default SortTeam;
