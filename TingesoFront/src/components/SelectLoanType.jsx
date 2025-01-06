import React, { useState } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Button,
  Box,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Home,
  Business,
  Construction,
  Villa,
  HelpOutline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const loanTypes = [
  {
    value: 'firstHome',
    label: 'Primera Vivienda',
    icon: <Home fontSize="large" color="primary" />,
    description: 'Ideal para quienes compran su primera casa'
  },
  {
    value: 'secondHome',
    label: 'Segunda Vivienda',
    icon: <Villa fontSize="large" color="primary" />,
    description: 'Para adquirir una propiedad adicional'
  },
  {
    value: 'commercial',
    label: 'Propiedad Comercial',
    icon: <Business fontSize="large" color="primary" />,
    description: 'Financiamiento para locales o oficinas'
  },
  {
    value: 'remodeling',
    label: 'Remodelación',
    icon: <Construction fontSize="large" color="primary" />,
    description: 'Mejora tu propiedad actual'
  }
];

const FIELD_HELP = {
  firstHome: "Ideal para quienes compran su primera casa",
  secondHome: "Para adquirir una propiedad adicional",
  commercial: "Financiamiento para locales o oficinas",
  remodeling: "Mejora tu propiedad actual"
};

const INSTRUCTIONAL_GUIDE = (
  <List>
    <ListItem>
      <ListItemText primary="PrestaBanco ofrece una variedad de préstamos hipotecarios, adaptados a las diferentes necesidades de sus clientes. Los tipos de préstamos más comunes incluyen:" />
    </ListItem>
    <ListItem>
      <ListItemText primary="1. Préstamos Hipotecarios para Primera Vivienda: Ofrecen condiciones preferenciales para aquellos clientes que adquieren su primer hogar." />
    </ListItem>
    <ListItem>
      <ListItemText primary="2. Préstamos Hipotecarios para Segunda Vivienda: Diseñados para clientes que desean invertir en una segunda propiedad." />
    </ListItem>
    <ListItem>
      <ListItemText primary="3. Préstamos Hipotecarios para Propiedades Comerciales: Orientados a la compra de propiedades destinadas a actividades comerciales." />
    </ListItem>
    <ListItem>
      <ListItemText primary="4. Préstamos Hipotecarios para Remodelación: Ofrecen financiamiento para remodelar o ampliar propiedades existentes." />
    </ListItem>
    <ListItem>
      <ListItemText primary="Para seleccionar un tipo de préstamo:" />
    </ListItem>
    <ListItem>
      <ListItemText primary="1. Revise las opciones disponibles y sus descripciones." />
    </ListItem>
    <ListItem>
      <ListItemText primary='2. Haga clic en la tarjeta del tipo de préstamo que desea seleccionar.' />
    </ListItem>
    <ListItem>
      <ListItemText primary='3. Una vez seleccionado, haga clic en el botón "Continuar" para proceder con la solicitud.' />
    </ListItem>
  </List>
);

const SelectLoanType = () => {
  const [selectedLoan, setSelectedLoan] = useState('');
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSelectedLoan(e.target.value);
    setStatus({ ...status, error: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLoan) {
      setStatus({ ...status, error: 'Por favor, seleccione un tipo de préstamo.' });
      return;
    }
    setStatus({ loading: true, success: false, error: null });

    setTimeout(() => {
      setStatus({ loading: false, success: true, error: null });
      navigate(`/request${selectedLoan.charAt(0).toUpperCase() + selectedLoan.slice(1)}/${selectedLoan}`);
    }, 1000);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Selecciona el Tipo de Préstamo
          </Typography>
          <IconButton onClick={(e) => setHelpAnchorEl(e.currentTarget)} color="primary">
            <HelpOutline />
          </IconButton>
        </Box>

        <Popover
          open={Boolean(helpAnchorEl)}
          anchorEl={helpAnchorEl}
          onClose={() => setHelpAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box sx={{ p: 3, maxWidth: 350 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Instrucciones
            </Typography>
            {INSTRUCTIONAL_GUIDE}
          </Box>
        </Popover>

        {status.error && <Alert severity="error">{status.error}</Alert>}
        {status.success && <Alert severity="success">Préstamo seleccionado exitosamente</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedLoan}
                  onChange={handleChange}
                >
                  <Grid container spacing={2}>
                    {loanTypes.map((option) => (
                      <Grid item xs={12} sm={6} key={option.value}>
                        <Card
                          onClick={() => setSelectedLoan(option.value)}
                          sx={{
                            cursor: 'pointer',
                            transition: 'box-shadow 0.2s',
                            '&:hover': {
                              boxShadow: 2
                            },
                            backgroundColor: selectedLoan === option.value ? 'primary.light' : 'background.paper'
                          }}
                        >
                          <CardContent>
                            <Box>
                              <Grid container alignItems="center" spacing={1}>
                                <Grid item>{option.icon}</Grid>
                                <Grid item>
                                  <Typography
                                    variant="h6"
                                    color={selectedLoan === option.value ? 'white' : 'text.primary'}
                                  >
                                    {option.label}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 1,
                                  color: selectedLoan === option.value ? 'white' : 'text.secondary'
                                }}
                              >
                                {option.description}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  type="submit"
                  disabled={status.loading}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                  startIcon={status.loading ? <CircularProgress size={24} /> : null}
                >
                  {status.loading ? "Cargando..." : "Continuar"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SelectLoanType;