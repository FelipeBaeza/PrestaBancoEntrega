import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Divider, InputAdornment, Alert, CircularProgress, IconButton, Popover, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Person, Search, CheckCircle, Cancel, MonetizationOn, Delete as DeleteIcon, HelpOutline } from '@mui/icons-material';
import service from '../services/client.service';
import evaluationService from '../services/evaluation.service';
import requestService from '../services/request.service';

const FIELD_ICONS = {
  rut: Person,
};

const FIELD_HELP = {
  rut: "Formato: 12345678-9",
};

const INSTRUCTIONAL_GUIDE = (
  <List>
    <ListItem>
      <ListItemText primary="1. Ingrese su RUT en el campo proporcionado. Asegúrese de que el formato sea correcto (ej: 12345678-9)." />
    </ListItem>
    <ListItem>
      <ListItemText primary='2. Haga clic en el botón "Buscar Solicitudes" para obtener el estado de sus solicitudes.' />
    </ListItem>
    <ListItem>
      <ListItemText primary='3. Si tiene solicitudes "Pre-Aprobadas", puede ver los costos del préstamo y decidir si aceptarlo o rechazarlo.' />
    </ListItem>
    <ListItem>
      <ListItemText primary='4. También puede eliminar cualquier solicitud haciendo clic en el botón "Eliminar".' />
    </ListItem>
  </List>
);

const StatusRequest = () => {
  const [rut, setRut] = useState('');
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [totalCosts, setTotalCosts] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showDetails, setShowDetails] = useState(false); 

  const handleRutChange = (e) => {
    setRut(e.target.value);
    setError(null);
    setFieldErrors(prev => ({ ...prev, rut: validateRut(e.target.value) }));
  };

  const validateRut = (rut) => {
    const rutPattern = /^\d{7,8}-[0-9kK]$/;
    return rutPattern.test(rut) ? "" : "Formato inválido (ej: 12345678-9)";
  };

  const fetchRequests = async () => {
    const rutError = validateRut(rut);
    if (rutError) {
      setFieldErrors({ rut: rutError });
      setError('Formato de RUT incorrecto. Debe ser 12345678-9.');
      return;
    }

    setLoading(true);
    try {
      const response = await service.getAllStatus(rut);
      const formattedRequests = [];
      for (let i = 0; i < response.data.length; i += 2) {
        formattedRequests.push({
          status: response.data[i],
          id: response.data[i + 1]
        });
      }
      if (formattedRequests.length === 0) {
        setError('No se encontró ninguna solicitud vigente para el RUT ingresado.');
      } else {
        setRequests(formattedRequests);
        setError(null);
      }
    } catch (error) {
      setError('Error al obtener las solicitudes. Verifica el RUT e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = async (idRequest) => {
    setLoading(true);
    try {
      const response = await evaluationService.totalCosts(idRequest);
      setTotalCosts(response.data);
      setSelectedRequest(idRequest);
      setShowDetails(true);
    } catch (error) {
      setError('Error al obtener los costos totales.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrReject = async (id, isAccepted) => {
    setLoading(true);
    try {
      const status = isAccepted ? 'E5' : 'E8';
      await requestService.editStates({ id, status });
      await fetchRequests();
      setShowDetails(false);
    } catch (error) {
      setError('Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta solicitud?')) {
      setLoading(true);
      try {
        await requestService.deleteRequest(id);
        await fetchRequests();
        setError(null);
      } catch (error) {
        setError('Error al eliminar la solicitud.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Consulta de Solicitudes
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="RUT"
            value={rut}
            onChange={handleRutChange}
            fullWidth
            required
            error={Boolean(fieldErrors.rut)}
            helperText={fieldErrors.rut}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color={fieldErrors.rut ? "error" : "primary"} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Search />}
            sx={{
              py: 1.5,
              mb: 4
            }}
          >
            {loading ? 'Buscando...' : 'Buscar Solicitudes'}
          </Button>
        </form>

        {requests.length > 0 && (
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request, index) => (
                  <TableRow
                    key={request.id}
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Typography>{request.status}</Typography>
                        {request.status === "Pre-Aprobada" && (
                          <Box sx={{ width: '100%', mt: 1 }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handleDetailClick(request.id)}
                              startIcon={<MonetizationOn />}
                              sx={{ mb: 2 }}
                            >
                              Ver Costos del Préstamo
                            </Button>

                            {showDetails && selectedRequest === request.id && (
                              <Box sx={{
                                mt: 2,
                                p: 2,
                                backgroundColor: 'background.paper',
                                borderRadius: 1,
                                boxShadow: 1
                              }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                  Costo total del préstamo: ${totalCosts}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleAcceptOrReject(request.id, true)}
                                    startIcon={<CheckCircle />}
                                    disabled={loading}
                                  >
                                    Aceptar Préstamo
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleAcceptOrReject(request.id, false)}
                                    startIcon={<Cancel />}
                                    disabled={loading}
                                  >
                                    Rechazar Préstamo
                                  </Button>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteRequest(request.id)}
                        startIcon={<DeleteIcon />}
                        disabled={loading}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default StatusRequest;
