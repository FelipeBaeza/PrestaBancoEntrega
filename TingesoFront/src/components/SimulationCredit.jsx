import React, { useState } from 'react';
import { Container, Paper, Grid, TextField, Button, Typography, Box, Divider }
  from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import clientService from '../services/client.service';

const SimulationCredit = () => {
  const [formValues, setFormValues] = useState({
    amount: '',
    interestRate: '',
    term: ''
  });
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await clientService.simulation(formValues);
      setSimulationResult(response.data);
    } catch (error) {
      console.error('Error al obtener la simulación:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Simulador de Crédito
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                label="Monto del Préstamo"
                name="amount"
                value={formValues.amount}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
                helperText="Ingrese el monto que desea solicitar"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tasa de Interés Anual"
                name="interestRate"
                value={formValues.interestRate}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                InputProps={{
                  endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                }}
                helperText="Ingrese la tasa de interés anual"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Plazo en Años"
                name="term"
                value={formValues.term}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                helperText="Ingrese el plazo en años"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<CalculateIcon />}
                  type="submit"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  {loading ? 'Calculando...' : 'Simular Cuota'}
                </Button>
              </Box>
            </Grid>

            {simulationResult && (
              <Grid item xs={12}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    mt: 2,
                    backgroundColor: 'primary.light',
                    color: 'white'
                  }}
                >
                  <Typography variant="h6" align="center">
                    Cuota Mensual Estimada: ${simulationResult}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SimulationCredit;