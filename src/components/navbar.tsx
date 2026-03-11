import {
  Box,
  Chip,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import KitIcon from '@mui/icons-material/AssignmentTurnedIn';
import CategoryIcon from '@mui/icons-material/Category';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import StadiumIcon from '@mui/icons-material/Stadium';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SavingsIcon from '@mui/icons-material/Savings';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { useAuth } from '../hooks/auth';
import { useResolvedEventLogo } from '../hooks/useResolvedEventLogo';

const navigationItems = [
  { name: 'Dashboard', page: '/dashboard', icon: <DashboardIcon /> },
  { name: 'Resultados', page: '/painel', icon: <ScoreboardIcon /> },
  { name: 'Eventos', page: '/eventos', icon: <StadiumIcon /> },
  { name: 'Atletas', page: '/atletas', icon: <AccessibilityNewIcon /> },
  { name: 'Times', page: '/times', icon: <Diversity3Icon /> },
  { name: 'Categorias', page: '/categorias', icon: <CategoryIcon /> },
  { name: 'Lotes', page: '/lotes', icon: <ConfirmationNumberIcon /> },
  { name: 'Kits', page: '/kits', icon: <KitIcon /> },
  { name: 'WOD', page: '/wod', icon: <FormatListNumberedIcon /> },
  {
    name: 'WOD descrição',
    page: '/wod-descricao',
    icon: <FitnessCenterIcon />,
  },
  { name: 'Pagamentos', page: '/pagamentos', icon: <AttachMoneyIcon /> },
  {
    name: 'Extrato / saque',
    page: '/extrato-recebedor',
    icon: <SavingsIcon />,
  },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentEventsData, events, setCurrentEvent } = useEvent();
  const { signOut } = useAuth();
  const eventLogo = useResolvedEventLogo();

  const handleChange = (event: SelectChangeEvent) => {
    setCurrentEvent(event.target.value as string);
  };

  return (
    <>
      <Box
        sx={{
          width: 'min(1240px, 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: { xs: 2, md: 2.5 },
          py: 1.5,
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.08)',
          background:
            'linear-gradient(180deg, rgba(14,22,36,0.82), rgba(9,14,23,0.9))',
          boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 16,
          zIndex: 20,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={{
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '14px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Box
              component="img"
              src={eventLogo}
              alt="Evento"
              sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 0.5 }}
            />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
              Nahora Event Console
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '0.98rem', md: '1.05rem' },
              }}
            >
              {getCurrentEventsData?.name || 'Selecione um evento'}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          <Chip
            label={location.pathname.replace('/', '') || 'dashboard'}
            sx={{
              background: 'rgba(243,114,44,0.14)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(243,114,44,0.2)',
              textTransform: 'capitalize',
            }}
          />
          {events.length > 0 ? (
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="select-event-label">Evento</InputLabel>
              <Select
                labelId="select-event-label"
                value={getCurrentEventsData.id}
                onChange={handleChange}
                label="Evento"
              >
                {events.map((event) => (
                  <MenuItem key={event.id} value={event.id}>
                    {event.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
        </Stack>
      </Box>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{ width: 320, p: 2.5 }}
          role="presentation"
          onKeyDown={() => setOpen(false)}
        >
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                Navegação
              </Typography>
              <Typography variant="h5">Painel do evento</Typography>
            </Box>

            {events.length > 0 ? (
              <FormControl size="small" fullWidth>
                <InputLabel id="drawer-select-event-label">Evento</InputLabel>
                <Select
                  labelId="drawer-select-event-label"
                  value={getCurrentEventsData.id}
                  onChange={handleChange}
                  label="Evento"
                >
                  {events.map((event) => (
                    <MenuItem key={event.id} value={event.id}>
                      {event.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

            <List sx={{ p: 0 }}>
              {navigationItems.map((item) => {
                const active = location.pathname === item.page;
                return (
                  <ListItem key={item.page} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => {
                        navigate(item.page);
                        setOpen(false);
                      }}
                      sx={{
                        borderRadius: '18px',
                        background: active
                          ? 'linear-gradient(135deg, rgba(243,114,44,0.2), rgba(249,199,79,0.14))'
                          : 'transparent',
                        border: active
                          ? '1px solid rgba(243,114,44,0.24)'
                          : '1px solid transparent',
                      }}
                    >
                      <ListItemIcon sx={{ color: active ? '#f9c74f' : 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.name} />
                      <ChevronRightRoundedIcon fontSize="small" />
                    </ListItemButton>
                  </ListItem>
                );
              })}

              <ListItem disablePadding sx={{ mt: 1 }}>
                <ListItemButton
                  onClick={() => signOut()}
                  sx={{
                    borderRadius: '18px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sair" />
                </ListItemButton>
              </ListItem>
            </List>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
