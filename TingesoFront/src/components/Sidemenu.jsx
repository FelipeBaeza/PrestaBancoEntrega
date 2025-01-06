import React from 'react';
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PaidIcon from "@mui/icons-material/Paid";
import CalculateIcon from "@mui/icons-material/Calculate";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DiscountIcon from "@mui/icons-material/Discount";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    id: 'home',
    label: 'Inicio',
    icon: <HomeIcon />,
    path: '/home',
    description: 'Página principal del sistema'
  },
  {
    id: 'simulation',
    label: 'Simulador de Crédito',
    icon: <CalculateIcon />,
    path: '/simulation',
    description: 'Calcule una simulación de crédito'
  },
  {
    id: 'register',
    label: 'Registro de Cliente',
    icon: <PeopleAltIcon />,
    path: '/register',
    description: 'Registre un nuevo cliente'
  },
  {
    id: 'credit',
    label: 'Solicitud de Crédito',
    icon: <PaidIcon />,
    path: '/selectType',
    description: 'Crear nueva solicitud de crédito'
  },
  {
    id: 'status',
    label: 'Estado de Solicitud',
    icon: <AnalyticsIcon />,
    path: '/statusRequest',
    description: 'Consulte el estado de una solicitud'
  },
  {
    id: 'list',
    label: 'Listado de Solicitudes',
    icon: <DiscountIcon />,
    path: '/requests',
    description: 'Ver todas las solicitudes'
  }
];

export default function Sidemenu({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    toggleDrawer(false)();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      aria-label="Menú principal de navegación"
    >
      <Box
        role="navigation"
        sx={{
          width: 280,
          bgcolor: 'background.paper',
          height: '100%',
          pt: 2
        }}
      >
        <Typography
          variant="h6"
          sx={{ px: 2, mb: 2 }}
          color="primary"
        >
          Sistema de Créditos
        </Typography>

        <Divider />

        <List sx={{ p: 1 }}>
          {menuItems.map((item) => (
            <Tooltip 
              key={item.id}
              title={item.description}
              placement="right"
            >
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: location.pathname === item.path ? 500 : 400
                    }
                  }}
                />
                <KeyboardArrowRightIcon 
                  sx={{ 
                    opacity: 0.5,
                    ml: 1,
                    visibility: location.pathname === item.path ? 'visible' : 'hidden'
                  }} 
                />
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}