import React, { useState } from "react";
import { TextField, Button, Container, Grid, Typography, Paper, InputAdornment, Box, Alert, CircularProgress, IconButton, Popover, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import clientService from "../services/client.service";
import { Person, Email, Badge, Lock, Cake, HelpOutline } from "@mui/icons-material";

const FIELD_ICONS = {
  name: Person,
  lastName: Person,
  rut: Badge,
  password: Lock,
  email: Email,
  dateOfBirth: Cake,
};

const INSTRUCTIONAL_GUIDE = (
  <List>
    <ListItem>
      <ListItemText primary="1. Complete todos los campos obligatorios marcados con un asterisco (*)" />
    </ListItem>
    <ListItem>
      <ListItemText primary="2. El RUT debe estar en formato chileno (ej: 12345678-9)" />
    </ListItem>
    <ListItem>
      <ListItemText primary="3. La contraseña debe tener al menos 8 caracteres, una mayúscula y un número" />
    </ListItem>
    <ListItem>
      <ListItemText primary="4. El correo debe ser válido (ej: ejemplo@dominio.com)" />
    </ListItem>
    <ListItem>
      <ListItemText primary="5. Debe ser mayor de 18 años" />
    </ListItem>
  </List>
);

const validateField = (name, value) => {
  if (!value || value.trim() === "") return "Este campo es obligatorio";

  const validations = {
    name: (v) => (v.length >= 2 && v.length <= 50 ? "" : "El nombre debe tener entre 2 y 50 caracteres"),
    lastName: (v) => (v.length >= 2 && v.length <= 50 ? "" : "El apellido debe tener entre 2 y 50 caracteres"),
    rut: (v) => (/^[0-9]{7,8}-[0-9kK]{1}$/.test(v) ? "" : "Formato de RUT inválido"),
    password: (v) => 
      /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(v) 
        ? "" 
        : "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número",
    email: (v) => (/^[A-Za-z0-9+_.-]+@(.+)$/.test(v) ? "" : "Formato de email inválido"),
    dateOfBirth: (v) => {
      if (!v) return "La fecha de nacimiento es obligatoria";
      const today = new Date();
      const birthDate = new Date(v);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18 ? "" : "El cliente debe ser mayor de 18 años";
    },
  };
  return validations[name] ? validations[name](value) : "";
};

const Register = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    lastName: "",
    rut: "",
    password: "",
    dateOfBirth: "",
    email: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [backendMessage, setBackendMessage] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    setBackendMessage({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Movemos esto al inicio

    // Validate all fields
    const errors = {};
    Object.keys(formValues).forEach((field) => {
      const error = validateField(field, formValues[field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false); // Agregamos esto para cuando hay errores de validación
      return;
    }

    setBackendMessage({ type: "", message: "" });

    try {
      const isAvailable = await clientService.validateRutAndPassword({
        rut: formValues.rut,
        password: formValues.password,
      });

      if (!isAvailable) {
        setBackendMessage({ 
          type: "error", 
          message: "El RUT o contraseña ya están en uso." 
        });
        setLoading(false);
        return;
      }

      const response = await clientService.saveClient(formValues);
      
      if (response.data === "Cliente guardado") {
        setBackendMessage({ 
          type: "success", 
          message: "Registro exitoso" 
        });
        setTimeout(() => navigate("/home"), 3000);
      } else {
        setBackendMessage({ 
          type: "error", 
          message: response.data
        });
      }
    } catch (error) {
      setBackendMessage({ 
        type: "error", 
        message: error.response?.data || error.message || "Error al procesar el registro" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Registro de Usuario</Typography>
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

        {backendMessage.message && (
          <Alert severity={backendMessage.type}>
            {backendMessage.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {Object.keys(formValues).map((field) => (
              field !== "dateOfBirth" && (
                <Grid item xs={12} sm={field === "name" || field === "lastName" ? 6 : 12} key={field}>
                  <TextField
                    fullWidth
                    required
                    name={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    type={field === "password" ? "password" : "text"}
                    value={formValues[field]}
                    onChange={handleChange}
                    error={Boolean(fieldErrors[field])}
                    helperText={fieldErrors[field]}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {React.createElement(FIELD_ICONS[field], {
                            color: fieldErrors[field] ? "error" : "primary",
                          })}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )
            ))}

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="date"
                name="dateOfBirth"
                label="Fecha de Nacimiento"
                value={formValues.dateOfBirth}
                onChange={handleChange}
                error={Boolean(fieldErrors.dateOfBirth)}
                helperText={fieldErrors.dateOfBirth}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Cake color={fieldErrors.dateOfBirth ? "error" : "primary"} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
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
                  disabled={loading}
                  sx={{ py: 1.5, px: 4 }}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                >
                  {loading ? "Registrando..." : "Registrarse"}
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