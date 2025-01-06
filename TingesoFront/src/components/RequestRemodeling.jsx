import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  Box,
  Alert,
  CircularProgress,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  Upload as UploadIcon,
  ArrowBack,
  SaveAlt,
  Person,
  AttachMoney,
  Schedule,
  Percent,
  HelpOutline,
  Receipt,
  Assessment,
  History,
  AccountBalance,
  Work,
  Description
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import service from '../services/request.service';
import clientService from '../services/client.service';

const FIELD_ICONS = {
  rut: Person,
  maximumAmount: AttachMoney,
  interestRate: Percent,
  term: Schedule,
};

const FIELD_HELP = {
  rut: "Formato: 12345678-9",
  maximumAmount: "Monto máximo a solicitar",
  interestRate: "Tasa de interés anual (entre 4.5% y 6%)",
  term: "Plazo en años (entre 1 y 15 años)",
};

const DOCUMENT_REQUIREMENTS = {
  proofIncome: "Comprobante de Ingresos",
  appraisalCertificate: "Certificado de Avalúo",
  remodelingBudget: "Presupuesto de Remodelación",
  creditHistory: "Historial Crediticio",
  bankAccountState: "Estado de Cuenta Bancario",
  workCertificate: "Certificado Laboral",
};

const DOCUMENT_ICONS = {
  proofIncome: Receipt,
  appraisalCertificate: Assessment,
  remodelingBudget: Description,  
  creditHistory: History,
  bankAccountState: AccountBalance,
  workCertificate: Work,
};

const validateField = (name, value) => {
  const validations = {
    rut: (v) => (/^[0-9]{7,8}-[0-9kK]{1}$/.test(v) ? "" : "Formato inválido (ej: 12345678-9)"),
    maximumAmount: (v) => {
      const amount = Number(v);
      return amount >= 1000000 && amount <= 100000000 
        ? "" 
        : "El monto debe estar entre 1.000.000 y 100.000.000";
    },
    interestRate: (v) => {
      const rate = Number(v);
      return rate >= 4.5 && rate <= 6 
        ? "" 
        : "La tasa debe estar entre 4.5% y 6%";
    },
    term: (v) => {
      const years = Number(v);
      return years >= 1 && years <= 15 
        ? "" 
        : "El plazo debe ser entre 1 y 15 años";
    },
  };
  return validations[name] ? validations[name](value) : "";
};

const RequestRemodeling = () => {
  const { loanType } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: false, success: false, error: null });
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [formData, setFormData] = useState({
    rut: '',
    typeLoan: loanType,
    term: '',
    maximumAmount: '',
    interestRate: '',
    proofIncome: null,
    appraisalCertificate: null,
    creditHistory: null,
    bankAccountState: null,
    workCertificate: null
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFieldErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
    setStatus(prev => ({ ...prev, error: null }));
  };

  const handleFileUpload = (event, fieldName) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    } else {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: 'Solo se permiten archivos PDF'
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Validate text fields
    Object.keys(FIELD_ICONS).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    
    // Validate documents
    Object.keys(DOCUMENT_REQUIREMENTS).forEach(doc => {
      if (!formData[doc]) {
        newErrors[doc] = 'Documento requerido';
      }
    });

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setStatus({
        loading: false,
        success: false,
        error: 'Por favor, complete todos los campos correctamente.'
      });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      // First validate the RUT
      const rutValidation = await clientService.validateRut(formData.rut);
      
      if (!rutValidation.data) {
        setStatus({
          loading: false,
          success: false,
          error: 'El RUT ingresado no está registrado. Por favor, regístrese primero.'
        });
        return;
      }

      // If RUT is valid, continue with form submission
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await service.remodeling(formDataToSend);
      if (response.status === 200) {
        setStatus({ loading: false, success: true, error: null });
        setTimeout(() => navigate('/home'), 3000);
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: 'Error al procesar la solicitud. Por favor, intente nuevamente.'
      });
    }
  };

  const INSTRUCTIONAL_GUIDE = (
    <List>
      <ListItem>
        <ListItemText primary="1. Complete todos los campos obligatorios marcados con un asterisco (*)" />
      </ListItem>
      <ListItem>
        <ListItemText primary="2. Asegúrese de que el RUT esté en el formato correcto (ej: 12345678-9)" />
      </ListItem>
      <ListItem>
        <ListItemText primary="3. El monto máximo debe estar entre 1.000.000 y 500.000.000" />
      </ListItem>
      <ListItem>
        <ListItemText primary="4. La tasa de interés anual debe estar entre 1% y 15%" />
      </ListItem>
      <ListItem>
        <ListItemText primary="5. El plazo debe ser entre 5 y 30 años" />
      </ListItem>
      <ListItem>
        <ListItemText primary="6. Adjunte todos los documentos requeridos en formato PDF" />
      </ListItem>
      <ListItem>
        <ListItemText primary='7. Haga clic en el botón "Enviar Solicitud" para completar el proceso' />
      </ListItem>
    </List>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" color="primary" gutterBottom>
            Solicitud de Remodelación
          </Typography>
          <IconButton onClick={(e) => setHelpAnchorEl(e.currentTarget)} color="primary">
            <HelpOutline />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 4 }} />

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

        {status.error && <Alert severity="error" sx={{ mb: 2 }}>{status.error}</Alert>}
        {status.success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Solicitud enviada exitosamente. Redirigiendo...
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>
                Datos Personales
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="RUT"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(fieldErrors.rut)}
                helperText={fieldErrors.rut}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color={fieldErrors.rut ? "error" : "primary"} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Datos del Préstamo
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Monto Máximo"
                name="maximumAmount"
                type="number"
                value={formData.maximumAmount}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(fieldErrors.maximumAmount)}
                helperText={fieldErrors.maximumAmount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color={fieldErrors.maximumAmount ? "error" : "primary"} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Tasa de Interés Anual"
                name="interestRate"
                type="number"
                value={formData.interestRate}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(fieldErrors.interestRate)}
                helperText={fieldErrors.interestRate}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Percent color={fieldErrors.interestRate ? "error" : "primary"} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Plazo"
                name="term"
                type="number"
                value={formData.term}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(fieldErrors.term)}
                helperText={fieldErrors.term}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Schedule color={fieldErrors.term ? "error" : "primary"} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Documentos Requeridos
              </Typography>
            </Grid>

            {Object.entries(DOCUMENT_REQUIREMENTS).map(([fieldName, label]) => (
              <Grid item xs={12} sm={6} key={fieldName}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={React.createElement(DOCUMENT_ICONS[fieldName])}
                  sx={{
                    height: '56px',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    borderColor: formData[fieldName] ? 'primary.main' : 'grey.300',
                    backgroundColor: formData[fieldName] ? 'primary.50' : 'transparent'
                  }}
                >
                  {formData[fieldName] ? formData[fieldName].name : label}
                  <input
                    type="file"
                    hidden
                    onChange={(event) => handleFileUpload(event, fieldName)}
                    accept=".pdf"
                  />
                </Button>
                {fieldErrors[fieldName] && (
                  <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                    {fieldErrors[fieldName]}
                  </Typography>
                )}
              </Grid>
            ))}

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/selectType')}
                  startIcon={<ArrowBack />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Volver
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={status.loading || status.success}
                  startIcon={status.loading ? <CircularProgress size={20} /> : <SaveAlt />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  {status.loading ? 'Enviando...' : status.success ? 'Enviado' : 'Enviar Solicitud'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default RequestRemodeling;
