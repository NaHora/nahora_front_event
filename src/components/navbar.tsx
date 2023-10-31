import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          <List>
            {[
              { name: 'Resultados', page: '/panel', icon: <ScoreboardIcon /> },
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
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default Navbar;
