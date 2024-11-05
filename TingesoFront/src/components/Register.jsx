import React, { useState } from "react";
import axios from "axios";
import { 
  TextField, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Paper,
  InputAdornment,
  Box,
  Divider,
  Alert
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import LockIcon from "@mui/icons-material/Lock";
import CakeIcon from "@mui/icons-material/Cake";
import clientService from "../services/client.service";

const Register = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    lastName: '',
    rut: '',
    password: '',
    dateOfBirth: '',
    email: ''
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Función de validación
  const validateRutAndPassword = async (rut, password) => {
    try {
      const response = await clientService.validateRutAndPassword({ rut, password });
      return response.data; // Retorna true si está disponible, false si ya existe
    } catch (error) {
      console.error('Error en validación:', error);
      throw new Error('Error al validar RUT y contraseña');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Modificar handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Primero validar disponibilidad
      const isAvailable = await validateRutAndPassword(formValues.rut, formValues.password);

      if (!isAvailable) {
        setError("El RUT o contraseña ya están en uso. Por favor, intente con otros datos.");
        return;
      }

      // Si la validación es exitosa, continuar con el registro
      // Aquí va tu código existente para el registro
      const response = await clientService.saveClient(formValues);
      navigate('/home');
      
    } catch (error) {
      setError(error.message || "Error al procesar la solicitud");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Registro de Usuario
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="RUT"
                name="rut"
                value={formValues.rut}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                helperText="Formato: 12345678-9"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                name="dateOfBirth"
                type="date"
                value={formValues.dateOfBirth}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Registrarse
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
