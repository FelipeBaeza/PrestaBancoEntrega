import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField, Box, Button, Container, Grid, Typography, Paper, FormControl, FormControlLabel, RadioGroup, Radio, Divider, CircularProgress, Snackbar, Popover, List, ListItem, ListItemText, IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { HelpOutline } from '@mui/icons-material';
import service from '../services/request.service';
import evaluationService from '../services/evaluation.service';
import RequestService from '../services/request.service';
import ClientService from '../services/client.service';

const DOCUMENTS_BY_TYPE = {
  firstHome: [
    { id: 'proofIncome', nombre: 'Comprobante de Ingresos' },
    { id: 'appraisalCertificate', nombre: 'Certificado de Avalúo' },
    { id: 'creditHistory', nombre: 'Historial de Crédito' },
    { id: 'bankAccountState', nombre: 'Estado de Cuenta' },
    { id: 'workCertificate', nombre: 'Certificado Laboral' }
  ],
  secondHome: [
    { id: 'proofIncome', nombre: 'Comprobante de Ingresos' },
    { id: 'appraisalCertificate', nombre: 'Certificado de Avalúo' },
    { id: 'propertyWriting', nombre: 'Escritura de Propiedad' },
    { id: 'creditHistory', nombre: 'Historial de Crédito' },
    { id: 'bankAccountState', nombre: 'Estado de Cuenta' },
    { id: 'workCertificate', nombre: 'Certificado Laboral' }
  ],
  commercial: [
    { id: 'businessFinancialStatement', nombre: 'Estados Financieros' },
    { id: 'proofIncome', nombre: 'Comprobante de Ingresos' },
    { id: 'appraisalCertificate', nombre: 'Certificado de Avalúo' },
    { id: 'businessPlan', nombre: 'Plan de Negocios' },
    { id: 'bankAccountState', nombre: 'Estado de Cuenta' },
    { id: 'workCertificate', nombre: 'Certificado Laboral' }
  ],
  remodeling: [
    { id: 'proofIncome', nombre: 'Comprobante de Ingresos' },
    { id: 'appraisalCertificate', nombre: 'Certificado de Avalúo' },
    { id: 'remodelingBudget', nombre: 'Presupuesto Remodelación' },
    { id: 'creditHistory', nombre: 'Historial Crediticio' },
    { id: 'bankAccountState', nombre: 'Estado de Cuenta' },
    { id: 'workCertificate', nombre: 'Certificado Laboral' }
  ]
};

const EvaluationRequest = () => {
  const [evaluationData, setEvaluationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { applicationId, typeLoan } = useParams();
  const navigate = useNavigate();
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEvaluationData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await evaluationService.dataEvaluation({ idRequest: applicationId });
        if (isMounted) {
          setEvaluationData(response.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error al obtener datos de evaluación:', error);
          setError('Error al cargar los datos de evaluación');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (applicationId) {
      fetchEvaluationData();
    }

    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  const [formValues, setFormValues] = useState({
    incomeQuota: null,
    creditHistory: null,
    employmentSeniority: null,
    incomeDebtRelation: null,
    financingLimit: null,
    applicantAge: null,
    savingsCapacity: null,
    idRquest: applicationId
  });

  const [formSavings, setFormSavings] = useState({
    savingsBalance: null,
    positiveBalance: null,
    regularDeposits: null,
    accumulatedBalance: null,
    avoidWithdrawals: null
  });

  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [ratio, setRatio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(null);
  const [resultado, setResultado] = useState('');
  const [currentDebts, setCurrentDebts] = useState('');
  const [debtRatio, setDebtRatio] = useState(null);
  const [debtResult, setDebtResult] = useState('');
  const [debtError, setDebtError] = useState(null);
  const [savingStatus, setSavingStatus] = useState('');
  const [savingRatio, setSavingRatio] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value === 'si',
    });
    setFormSavings({
      ...formSavings,
      [name]: value === 'si',
    });
  };

  const calculate = async () => {
    try {
      const requestData = await RequestService.getRequest(applicationId);
      const request = requestData.data[0];

      const simulationData = await ClientService.simulation({
        amount: request.maximumAmount,
        interestRate: request.interestRate,
        term: request.term
      });

      const monthlyPayment = simulationData.data;
      const paymentToIncomeRatio = (monthlyPayment / monthlyIncome) * 100;
      setRatio(paymentToIncomeRatio);

      const isApproved = paymentToIncomeRatio <= 35;
      setApproved(isApproved);
      setResultado(isApproved ? "Aprobado: Relación cuota/ingreso adecuada" : "Rechazado: Relación cuota/ingreso demasiado alta");
    } catch (error) {
      console.error('Error al calcular la relación cuota/ingreso:', error);
    }
  };

  const calculateDebtRatio = async () => {
    try {
      const debtToIncomeRatio = (currentDebts / monthlyIncome) * 100;
      setDebtRatio(debtToIncomeRatio);

      const isDebtApproved = debtToIncomeRatio <= 50;
      setDebtResult(isDebtApproved ? "Aprobado: Relación deuda/ingreso adecuada" : "Rechazado: Relación deuda/ingreso demasiado alta");
    } catch (error) {
      setDebtError('Error al calcular la relación deuda/ingreso. Intenta nuevamente.');
    }
  };

  const checkSavings = () => {
    let positiveAnswers = 0;

    if (formValues.savingsCapacity) positiveAnswers++;
    if (formValues.savingsBalance) positiveAnswers++;
    if (formValues.positiveBalance) positiveAnswers++;
    if (formValues.regularDeposits) positiveAnswers++;
    if (formValues.accumulatedBalance) positiveAnswers++;
    if (formValues.avoidWithdrawals) positiveAnswers++;

    if (positiveAnswers >= 5) {
      const response = "Aprobación";
      setSavingStatus(response);
      formValues.savingsCapacity = true;
    } else if (positiveAnswers >= 3) {
      const response = "Revisión Adicional";
      setSavingStatus(response);
      formValues.savingsCapacity = false;
    } else {
      const response = "Rechazo";
      setSavingStatus(response);
      formValues.savingsCapacity = false;
    }
    setIsSubmitDisabled(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      console.log(formValues);
      const response = await evaluationService.dataEvaluation(formValues);
      if (response.status === 200) {
        navigate('/home');
        setSuccess(true);
      } else {
        setError('Error al enviar la solicitud. Intenta nuevamente.');
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setError('Error del servidor. Intenta nuevamente más tarde.');
      } else {
        setError('Error al enviar la solicitud. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (documentName) => {
    try {
      const response = await axios.get(
        `http://localhost:8090/api/v1/creditRequest/${applicationId}/documents/${documentName}`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar:', error);
      updateState({ error: 'Error al descargar documento' });
    }
  };

  const DocumentButtons = () => {
    const documentos = DOCUMENTS_BY_TYPE[typeLoan] || [];

    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h6" color="primary">Documentos del Préstamo</Typography>
        </Grid>
        {documentos.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadDocument(doc.id)}
              sx={{ mb: 2 }}
            >
              {doc.nombre}
            </Button>
          </Grid>
        ))}
      </Grid>
    );
  };

  const handleNavigateToList = () => {
    const response = service.editStates({ id: applicationId, status: 'E2' });
    navigate('/requests');
  };

  const handleMissingDocuments = () => {
    const response = service.editStates({ id: applicationId, status: 'E2' });
    navigate('/requests');
  };

  const handleNavigateToExit = () => {
    navigate('/requests');
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" color="primary" gutterBottom>
            Evaluación de Solicitud
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
              Pasos para la Evaluación
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="1. Descargue los documentos necesarios." />
              </ListItem>
              <ListItem>
                <ListItemText primary="2. Responda cada pregunta seleccionando 'Sí' o 'No' según corresponda." />
              </ListItem>
              <ListItem>
                <ListItemText primary="3. En la sección de 'Capacidad de Ahorro', seleccione 'Sí' o 'No' para cada requisito y presione 'Revisar Estado de Ahorro'." />
              </ListItem>
              <ListItem>
                <ListItemText primary="4. Finalmente, presione 'Enviar Solicitud' para completar el proceso." />
              </ListItem>
            </List>
          </Box>
        </Popover>

        <Divider sx={{ my: 4 }} />

        <Grid item xs={12}>
          <Box sx={{ mt: 3, width: '100%' }}>
            <DocumentButtons />
          </Box>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" color="primary" gutterBottom>
          Formulario de Solicitud de Préstamo
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 3, maxWidth: "400px", margin: "0 auto" }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Evaluación de Ingresos
          </Typography>
          <TextField
            label="Ingreso Mensual"
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{ startAdornment: <span>$</span> }}
          />
          <Button
            variant="contained"
            onClick={calculate}
            disabled={!monthlyIncome || loading}
            fullWidth
            sx={{ mb: 2 }}
          >
            Calcular Relación Cuota/Ingreso
          </Button>
          {ratio !== null && (
            <Typography sx={{ mt: 2 }} color={ratio > 40 ? 'error' : 'success'}>
              La relación cuota/ingreso es: {ratio.toFixed(2)}%
            </Typography>
          )}
          {resultado && <Typography>{resultado}</Typography>}
          {error && <Typography color="error">{error}</Typography>}
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <Typography variant="h6" color="primary" align="center">
                  ¿Presenta una relación cuota/ingreso menor al 35%?
                </Typography>
                <RadioGroup
                  row
                  name="incomeQuota"
                  value={formValues.incomeQuota === null ? '' : formValues.incomeQuota ? 'si' : 'no'}
                  onChange={handleChange}
                  sx={{ justifyContent: 'center', mt: 2 }}
                >
                  <FormControlLabel value="si" control={<Radio color="primary" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio color="secondary" />} label="No" />
                </RadioGroup>
              </FormControl>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <Typography variant="h6" color="primary" align="center">
                  ¿Tiene un buen historial crediticio sin morosidades recientes?
                </Typography>
                <RadioGroup
                  row
                  name="creditHistory"
                  value={formValues.creditHistory === null ? '' : formValues.creditHistory ? 'si' : 'no'}
                  onChange={handleChange}
                  sx={{ justifyContent: 'center', mt: 2 }}
                >
                  <FormControlLabel value="si" control={<Radio color="primary" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio color="secondary" />} label="No" />
                </RadioGroup>
              </FormControl>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <Typography variant="h6" color="primary" align="center">
                  ¿Cuenta con al menos 1 a 2 años de antigüedad en su empleo actual?
                </Typography>
                <RadioGroup
                  row
                  name="employmentSeniority"
                  value={formValues.employmentSeniority === null ? '' : formValues.employmentSeniority ? 'si' : 'no'}
                  onChange={handleChange}
                  sx={{ justifyContent: 'center', mt: 2 }}
                >
                  <FormControlLabel value="si" control={<Radio color="primary" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio color="secondary" />} label="No" />
                </RadioGroup>
              </FormControl>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Box sx={{ mb: 3, maxWidth: "400px", margin: "0 auto" }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Evaluación Deuda/Ingreso
              </Typography>
              <TextField
                label="Deudas Mensuales Actuales"
                type="number"
                value={currentDebts}
                onChange={(e) => setCurrentDebts(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{ startAdornment: <span>$</span> }}
              />
              <Button
                variant="contained"
                onClick={calculateDebtRatio}
                disabled={!currentDebts || !monthlyIncome || loading}
                fullWidth
                sx={{ mb: 2 }}
              >
                Calcular Relación Deuda/Ingreso
              </Button>
              {debtRatio !== null && (
                <Typography sx={{ mt: 2 }} color={debtRatio > 50 ? 'error' : 'success'}>
                  La relación deuda/ingreso es: {debtRatio.toFixed(2)}%
                </Typography>
              )}
              {debtResult && <Typography>{debtResult}</Typography>}
              {debtError && <Typography color="error">{debtError}</Typography>}
            </Box>

            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <Typography variant="h6" color="primary" align="center">
                  ¿Su relación deuda/ingreso es menor al 50% incluyendo el nuevo crédito?
                </Typography>
                <RadioGroup
                  row
                  name="incomeDebtRelation"
                  value={formValues.incomeDebtRelation === null ? '' : formValues.incomeDebtRelation ? 'si' : 'no'}
                  onChange={handleChange}
                  sx={{ justifyContent: 'center', mt: 2 }}
                >
                  <FormControlLabel value="si" control={<Radio color="primary" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio color="secondary" />} label="No" />
                </RadioGroup>
              </FormControl>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <Typography variant="h6" color="primary" align="center">
                  ¿El monto solicitado respeta el límite de financiamiento según el tipo de propiedad?
                </Typography>
                <RadioGroup
                  row
                  name="financingLimit"
                  value={formValues.financingLimit === null ? '' : formValues.financingLimit ? 'si' : 'no'}
                  onChange={handleChange}
                  sx={{ justifyContent: 'center', mt: 2 }}
                >
                  <FormControlLabel value="si" control={<Radio color="primary" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio color="secondary" />} label="No" />
                </RadioGroup>
              </FormControl>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <Typography variant="h6" color="primary" align="center">
                  ¿La edad del solicitante permite pagar el crédito antes de los 75 años?
                </Typography>
                <RadioGroup
                  row
                  name="applicantAge"
                  value={formValues.applicantAge === null ? '' : formValues.applicantAge ? 'si' : 'no'}
                  onChange={handleChange}
                  sx={{ justifyContent: 'center', mt: 2 }}
                >
                  <FormControlLabel value="si" control={<Radio color="primary" />} label="Sí" />
                  <FormControlLabel value="no" control={<Radio color="secondary" />} label="No" />
                </RadioGroup>
              </FormControl>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ mb: 3, maxWidth: "400px", margin: "0 auto" }}>


              <Typography variant="h5" color="primary" gutterBottom>
                Capacidad de Ahorro
              </Typography>

              <Divider sx={{ my: 4 }} />

              {error && (
                <Typography variant="body1" color="error" align="center" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              <Grid container spacing={3}>
                {[
                  { name: 'savingsBalance', question: '¿Su cuenta de ahorros o inversiones tiene un saldo equivalente al menos al 10% del monto del préstamo solicitado?' },
                  { name: 'positiveBalance', question: '¿Mantiene un saldo positivo en su cuenta de ahorros sin retiros significativos (más del 50%) en los últimos 12 meses?' },
                  { name: 'regularDeposits', question: '¿Realiza depósitos regulares en su cuenta de ahorros o inversión, sumando al menos el 5% de sus ingresos mensuales?' },
                  { name: 'accumulatedBalance', question: '¿Tiene un saldo acumulado en la cuenta de ahorros equivalente al 10% o 20% del préstamo según su antigüedad?' },
                  { name: 'avoidWithdrawals', question: '¿Ha evitado retiros superiores al 30% del saldo en los últimos 6 meses?' },
                ].map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <FormControl component="fieldset" fullWidth>
                      <Typography variant="h6" color="primary" align="center">
                        {item.question}
                      </Typography>
                      <RadioGroup
                        row
                        name={item.name}
                        value={formSavings[item.name] === null ? '' : formSavings[item.name] ? 'si' : 'no'} onChange={handleChange} sx={{ justifyContent: 'center', mt: 2 }}>
                        <FormControlLabel value="si" control={<Radio color="primary" />} label="Sí" />
                        <FormControlLabel value="no" control={<Radio color="secondary" />} label="No" />
                      </RadioGroup>
                    </FormControl>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={checkSavings}
                    sx={{ mb: 2 }}
                  >
                    Revisar Estado de Ahorro
                  </Button>
                  <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                    {savingStatus}
                  </Typography>

                </Grid>
              </Grid>
            </Box>


            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={isSubmitDisabled}
                      sx={{ padding: '10px 0' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Enviar Solicitud'}
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleMissingDocuments}
                      fullWidth
                      sx={{ padding: '10px 0' }}
                    >
                      Falta de Documentación
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleNavigateToList}
                      fullWidth
                      sx={{ padding: '10px 0' }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
        {error && <Snackbar open={true} message={error} />}
        {success && <Snackbar open={true} message="Request submitted successfully!" />}
      </Paper>
    </Container>
  );
};

export default EvaluationRequest;