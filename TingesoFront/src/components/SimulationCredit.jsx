import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CalculateIcon from "@mui/icons-material/Calculate";
import { 
  AttachMoney, 
  Percent,
  Schedule,
  HelpOutline 
} from "@mui/icons-material";
import clientService from '../services/client.service';

const FIELD_ICONS = {
  amount: AttachMoney,
  interestRate: Percent,
  term: Schedule,
};

const FIELD_HELP = {
  amount: "Monto mínimo: $1.000.000, máximo: $100.000.000",
  interestRate: "Tasa entre 1% y 24.8% anual",
  term: "Plazo entre 1 y 58 años",
};

const INSTRUCTIONS = [
  "1. Ingrese el monto del préstamo deseado en el campo 'Monto del Préstamo'. (Monto mínimo: $1.000.000, máximo: $100.000.000)",
  "2. Ingrese la tasa de interés anual en el campo 'Tasa de Interés Anual'. (Tasa entre 1% y 24.8% anual)",
  "3. Ingrese el plazo del préstamo en años en el campo 'Plazo en Años'. (Plazo entre 1 y 58 años)",
  "4. Haga clic en el botón 'Simular Crédito' para calcular la cuota mensual estimada."
];

const validateField = (name, value) => {
  const validations = {
    amount: (v) => {
      const num = Number(v);
      return num >= 1000000 && num <= 100000000 
        ? "" 
        : "El monto debe estar entre $1.000.000 y $100.000.000";
    },
    interestRate: (v) => {
      const num = Number(v);
      return num >= 1 && num <= 24.8 
        ? "" 
        : "La tasa debe estar entre 1% y 24.8%";
    },
    term: (v) => {
      const num = Number(v);
      return num >= 1 && num <= 58 
        ? "" 
        : "El plazo debe estar entre 1 y 58 años";
    },
  };
  return validations[name] ? validations[name](value) : "";
};

const SimulationCredit = () => {
  const [formValues, setFormValues] = useState({
    amount: "",
    interestRate: "",
    term: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setStatus((prev) => ({ ...prev, error: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    // Validate all fields
    const errors = {};
    Object.entries(formValues).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) errors[name] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus({ loading: false, success: false, error: "Por favor, corrija los errores en el formulario." });
      return;
    }

    try {
      // Simulate a delay of 3 seconds
      setTimeout(async () => {
        const response = await clientService.simulation(formValues);
        setSimulationResult(response.data);
        setStatus({ loading: false, success: true, error: null });
      }, 2000);
    } catch (error) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: "Error al calcular la simulación. Por favor, intente nuevamente." 
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Simulador de Crédito</Typography>
          <IconButton 
            onClick={(e) => setHelpAnchorEl(e.currentTarget)} 
            color="primary"
            aria-label="ayuda"
          >
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
            <List>
              {INSTRUCTIONS.map((instruction, index) => (
                <ListItem key={index}>
                  <ListItemText primary={instruction} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Popover>

        {status.error && <Alert severity="error">{status.error}</Alert>}
        {status.loading && <Alert severity="success">Datos correctamente ingresados</Alert>}
        {status.success && <Alert severity="success">Simulación calculada exitosamente</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="amount"
                label="Monto del Préstamo"
                type="number"
                value={formValues.amount}
                onChange={handleChange}
                error={Boolean(fieldErrors.amount)}
                helperText={fieldErrors.amount || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color={fieldErrors.amount ? "error" : "primary"} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="interestRate"
                label="Tasa de Interés Anual"
                type="number"
                value={formValues.interestRate}
                onChange={handleChange}
                error={Boolean(fieldErrors.interestRate)}
                helperText={fieldErrors.interestRate || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Percent color={fieldErrors.interestRate ? "error" : "primary"} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="term"
                label="Plazo en Años"
                type="number"
                value={formValues.term}
                onChange={handleChange}
                error={Boolean(fieldErrors.term)}
                helperText={fieldErrors.term || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule color={fieldErrors.term ? "error" : "primary"} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={status.loading}
                  sx={{ py: 1.5, px: 4 }}
                  startIcon={status.loading ? <CircularProgress size={24} /> : <CalculateIcon />}
                >
                  {status.loading ? "Calculando..." : "Simular Crédito"}
                </Button>
              </Box>
            </Grid>

            {simulationResult && (
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, mt: 2, backgroundColor: "primary.main", color: "primary.contrastText" }}
                >
                  <Typography variant="h6" align="center" gutterBottom>
                    Resultado de la Simulación
                  </Typography>
                  <Typography variant="h4" align="center">
                    ${Number(simulationResult).toLocaleString("es-CL")}
                  </Typography>
                  <Typography variant="subtitle1" align="center">
                    Cuota Mensual Estimada
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