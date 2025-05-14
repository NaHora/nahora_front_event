import {
  Box,
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
} from '@mui/material';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import KitIcon from '@mui/icons-material/AssignmentTurnedIn';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { useAuth } from '../hooks/auth';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { EvStationOutlined } from '@mui/icons-material';
import StadiumIcon from '@mui/icons-material/Stadium';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import Diversity3Icon from '@mui/icons-material/Diversity3';
const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { getCurrentEventsData, events, setCurrentEvent } = useEvent();
  const { signOut } = useAuth();

  const handleChange = (event: SelectChangeEvent) => {
    setCurrentEvent(event.target.value as string);
  };
  const toggleDrawer = (status: boolean) => {
    setOpen(status);
  };

  return (
    <React.Fragment>
      <Box sx={{ justifyContent: 'flex', justifyItems: 'left', width: '100%' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => toggleDrawer(!open)}
          edge="start"
          sx={{
            marginRight: 5,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer anchor={'left'} open={open} onClose={() => toggleDrawer(false)}>
        <Box
          sx={{ width: 250, paddingTop: '16px' }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          {events.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex',
                width: '100%',
                paddingRight: '16px',
                paddingLeft: '16px',
              }}
            >
              <FormControl variant="outlined" style={{ width: '100%' }}>
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
            </Box>
          )}
          <List>
            {[
              {
                name: 'Dashboard',
                page: '/dashboard',
                icon: <DashboardIcon />,
              },
              { name: 'Resultados', page: '/painel', icon: <ScoreboardIcon /> },
              {
                name: 'Eventos',
                page: '/eventos',
                icon: <StadiumIcon />,
              },
              {
                name: 'Atletas',
                page: '/atletas',
                icon: <AccessibilityNewIcon />,
              },
              {
                name: 'Times',
                page: '/times',
                icon: <Diversity3Icon />,
              },
              {
                name: 'Categorias',
                page: '/categorias',
                icon: <CategoryIcon />,
              },
              {
                name: 'Lotes',
                page: '/lotes',
                icon: <ConfirmationNumberIcon />,
              },
              {
                name: 'Kits',
                page: '/kits',
                icon: <KitIcon />,
              },
              { name: 'Wod', page: '/wod', icon: <FormatListNumberedIcon /> },
              {
                name: 'Wod Descricao',
                page: '/wod-descricao',
                icon: <FitnessCenterIcon />,
              },
              {
                name: 'Pagamentos',
                page: '/pagamentos',
                icon: <AttachMoneyIcon />,
              },
              // {
              //   name: 'Inscritos',
              //   page: '/inscritos',
              //   icon: <PeopleAltIcon />,
              // },
              // { name: 'Resultados', page: '/painel', icon: <ScoreboardIcon /> },
            ].map((text, index) => (
              <ListItem key={text.page} disablePadding>
                <ListItemButton onClick={() => navigate(text.page)}>
                  <ListItemIcon>{text.icon}</ListItemIcon>
                  <ListItemText primary={text.name} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItemButton onClick={() => signOut()}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText>Sair</ListItemText>
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default Navbar;
