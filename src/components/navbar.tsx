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
} from '@mui/material';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
// import { Container } from './styles';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
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
const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { currentEvent, events, isLoading, setCurrentEvent } = useEvent();
  const { signOut } = useAuth();

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
                  value={currentEvent?.label}
                  onChange={setCurrentEvent}
                  label="Evento"
                >
                  {events.map((event) => (
                    <MenuItem key={event.value} value={event.value}>
                      {event.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          <List>
            {[
              { name: 'Resultados', page: '/panel', icon: <ScoreboardIcon /> },
              {
                name: 'Eventos',
                page: '/eventos',
                icon: <StadiumIcon />,
              },
              {
                name: 'Lotes',
                page: '/lotes',
                icon: <ConfirmationNumberIcon />,
              },
              {
                name: 'Pagamentos',
                page: '/pagamentos',
                icon: <AttachMoneyIcon />,
              },
              {
                name: 'Categorias',
                page: '/categorias',
                icon: <CategoryIcon />,
              },
              { name: 'Wod', page: '/wod', icon: <FormatListNumberedIcon /> },
              {
                name: 'Wod Descricao',
                page: '/wod-descricao',
                icon: <FitnessCenterIcon />,
              },
              { name: 'Duplas', page: '/duplas', icon: <PeopleAltIcon /> },
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
