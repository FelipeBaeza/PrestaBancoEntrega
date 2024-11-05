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
  CardContent
} from '@mui/material';
import {
  Home,
  Business,
  Construction,
  Villa
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SelectLoanType = () => {
  const [selectedLoan, setSelectedLoan] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedLoan) {
      if(selectedLoan === 'firstHome') {
        navigate(`/requestFirstHome/${selectedLoan}`);
      } else if(selectedLoan === 'secondHome') {
        navigate(`/requestSecondHome/${selectedLoan}`);
      } else if(selectedLoan === 'commercial') {
        navigate(`/requestCommercialProperty/${selectedLoan}`);
      } else if(selectedLoan === 'remodeling') {
        navigate(`/requestRemodeling/${selectedLoan}`);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Selecciona el Tipo de Préstamo
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedLoan}
                  onChange={(e) => setSelectedLoan(e.target.value)}
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
                  disabled={!selectedLoan}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Continuar con {selectedLoan ? loanTypes.find(type => type.value === selectedLoan)?.label : 'el préstamo seleccionado'}
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