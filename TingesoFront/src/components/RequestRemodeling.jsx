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
  CircularProgress
} from '@mui/material';
import {
  Upload as UploadIcon,
  ArrowBack,
  SaveAlt,
  Person,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import service from '../services/request.service';

const RequestRemodeling = () => {
  const { loanType } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    rut: '',
    typeLoan: loanType,
    term: '',
    interestRate: '',
    maximumAmount: '',
    proofIncome: null,
    appraisalCertificate: null,
    remodelingBudget: null,
    creditHistory: null,
    bankAccountState: null,
    workCertificate: null,
  });

  // Mantener los documentos originales de Remodeling
  const documentFields = [
    { name: 'proofIncome', label: 'Comprobante de Ingresos', icon: <UploadIcon /> },
    { name: 'appraisalCertificate', label: 'Certificado de Avalúo', icon: <UploadIcon /> },
    { name: 'remodelingBudget', label: 'Presupuesto de Remodelación', icon: <UploadIcon /> },
    { name: 'creditHistory', label: 'Historial Crediticio', icon: <UploadIcon /> },
    { name: 'bankAccountState', label: 'Estado de Cuenta Bancario', icon: <UploadIcon /> },
    { name: 'workCertificate', label: 'Certificado Laboral', icon: <UploadIcon /> },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (event, fieldName) => {
    const file = event.target.files[0];
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await service.remodeling(formData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setError('Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Solicitud de Préstamo para Remodelación
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
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
                label="Plazo (años)"
                name="term"
                type="number"
                value={formData.term}
                onChange={handleChange}
                fullWidth
                required
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
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
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
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                Documentos Requeridos
              </Typography>
            </Grid>

            {documentFields.map((doc) => (
              <Grid item xs={12} sm={6} key={doc.name}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<UploadIcon />}
                  sx={{
                    py: 2,
                    textTransform: 'none'
                  }}
                >
                  {formData[doc.name] ? formData[doc.name].name : doc.label}
                  <input
                    type="file"
                    hidden
                    onChange={(event) => handleFileUpload(event, doc.name)}
                    accept=".pdf,.doc,.docx"
                  />
                </Button>
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
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveAlt />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  {loading ? 'Enviando...' : 'Enviar Solicitud'}
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
