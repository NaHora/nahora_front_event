import React, { useState, useEffect } from 'react';

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
        name: playerName,
        rating: 3, // Default rating of 3
      };
      setPlayers([...players, newPlayer]);
      setPlayerName('');
    }
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
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        background: '#fff',
      }}
    >
      <h1>Player Manager</h1>
      <div>
        <input
          type="text"
          placeholder="Add Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={addPlayer}>Add Player</button>
      </div>
      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - Rating: {player.rating}
            <button onClick={() => updateRating(player.id, 1)}>+</button>
            <button onClick={() => updateRating(player.id, -1)}>-</button>
            <button onClick={() => deletePlayer(player.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={resetPlayers}>Reset Players</button>
      <h2>Sort Teams</h2>
      <div>
        <input
          type="number"
          min="2"
          value={numTeams}
          onChange={(e) => setNumTeams(Number(e.target.value))}
        />
        <button onClick={sortTeams}>Sort Teams</button>
      </div>
      <h2>Teams</h2>
      {teams.map((team, index) => (
        <div key={index}>
          <h3>Team {index + 1}</h3>
          <ul>
            {team.map((player) => (
              <li key={player.id}>
                {player.name} - Rating: {player.rating}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total Rating:</strong>{' '}
            {team.reduce((sum, player) => sum + player.rating, 0)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SortTeam;
