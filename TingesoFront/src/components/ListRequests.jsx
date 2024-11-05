import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, Alert, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import service from '../services/request.service';
import RefreshIcon from '@mui/icons-material/Refresh';

const ListRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await service.getAllRequests();
      setRequests(data);
      setError(null);
    } catch {
      setError('Error al obtener las solicitudes.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRequest = (id, status,typeLoan) => {
    if (status === 'Finalizada') return;
    const statusMap = {
      'En Aprobación Final': 'E6',
      'Aprobada': 'E9'
    };
    statusMap[status] 
      ? service.editStates({ id, status: statusMap[status] }) 
      : navigate(`/evaluationRequest/${id}/${typeLoan}`);
  };

  const traducirTipoPrestamo = (tipo) => ({
    'firstHome': 'Primera Vivienda',
    'secondHome': 'Segunda Vivienda',
    'commercial': 'Propiedad Comercial',
    'remodeling': 'Remodelación'
  }[tipo] || tipo);

  const getButtonText = (status) => ({
    'En Aprobación Final': 'Aprobar Solicitud',
    'Aprobada': 'Desembolso',
    'En Desembolso': 'Finalizar'
  }[status] || 'Ver Detalle');

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Lista de Solicitudes
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Button
          onClick={() => window.location.reload()}
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          sx={{ mb: 2, mr: 2 }}
        >
          Recargar Página
        </Button>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {requests.length > 0 ? (
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  {['#', 'Tipo de Prestamo', 'RUT', 'Nombre', 'Apellido', 'Estado', 'Acciones']
                    .map((header, i) => (
                      <TableCell key={i} sx={{ color: 'white', fontWeight: 'bold' }}>
                        {header}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request, index) => (
                  <TableRow key={request.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{traducirTipoPrestamo(request.typeLoan)}</TableCell>
                    <TableCell>{request.rut}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.lastName}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewRequest(Number(request.id), request.status, request.typeLoan)}
                      >
                        {getButtonText(request.status)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No hay solicitudes para mostrar</Alert>
        )}
      </Paper>
    </Container>
  );
};

export default ListRequests;
