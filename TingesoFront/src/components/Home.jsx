import { Button, Container, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Sistema de Gestión de Préstamos - PrestaBanco
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Bienvenido a PrestaBanco, tu plataforma integral para la gestión de préstamos hipotecarios. Nuestro sistema te permite evaluar, aprobar y dar seguimiento a solicitudes de préstamos de manera eficiente y segura.
      </Typography>
      <Typography variant="h6" color="primary" gutterBottom>
        Funcionalidades Generales
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/register')}>
            Registro de Cliente
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/selectType')}>
            Solicitud de Crédito
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/statusRequest')}>
            Estado de Solicitud
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/simulation')}>
            Simulador de Crédito
          </Button>
        </Grid>
      </Grid>
      <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4 }}>
        Funcionalidad Para El Ejecutivo
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/requests')}>
            Listado de Solicitudes
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MenuIcon sx={{ fontSize: 40, mr: 1 }} />
        <ArrowBackIcon sx={{ fontSize: 40, transform: 'rotate(50deg)' }} />
        <Typography variant="body1" sx={{ ml: 1 }}>
          Puede acceder a las funcionalidades usando el menú en la parte superior izquierda.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;