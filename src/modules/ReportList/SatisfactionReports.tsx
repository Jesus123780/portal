import DownloadIcon from '@mui/icons-material/Download';
import { DatePicker } from '@mui/lab';
import {
  Card,
  FormControl,
  Grid,
  Divider,
  MenuItem,
  Typography,
  Select,
  InputLabel,
  TextField,
  Button
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import { useSelector } from '@/store';
import { bacFetch } from '@/utils/service_config';
import GenerateReport from '@/mocks/xlsx';

export const TableButtonStyles = {
  paddingTop: 12,
  paddingBottom: 8,
  justifyContent: 'flex-end',
  display: 'flex',
};

const GenReporte = new GenerateReport();

const SatisfactionReports = () => {
  const [cif, setCif] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [client, setClient] = React.useState('');
  const [activationDate, setActivationDate] = React.useState('');
  const [satisfactionStatus, setSatisfactionStatus] = React.useState('');

  const [listStatuses, setListStatuses] = React.useState([]);
  const [visibleSupervisor, SetVisibleSupervisor] = React.useState(false);
  const { user } = useSelector((state) => state.permissions);

  useEffect(() => {
    setActivationDate(dayjs().startOf('month').format('MM/DD/YYYY'));
    if (user.roleCode == 'rol_1') {
      SetVisibleSupervisor(true);
    }
  }, []);

  const listStatusesData = useCallback(async () => {
    const res = await bacFetch('/api/connection/GetReviewStatuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: ` `
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      listStatusesData()
        .then((res) => {
          setListStatuses(res);
        })
        .catch(() => {
          setListStatuses([]);
        });
    };

    fetchData();
  }, []);

  const GenerateProviderReport = async (cif, cardNumber, client, activationDate, satisfactionStatus) => {
    const DATA = await sp_GenerateSurveysReport(cif, cardNumber, client, activationDate, satisfactionStatus);
    GenReporte.GenExcelReport(DATA, 12);
  };

  const sp_GenerateSurveysReport = useCallback(
    async (cif, cardNumber, client, activationDate, satisfactionStatus) => {
      // TODO: no api
      const res = await bacFetch('/api/connection/GetRepSurveySatisfaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: `'${cif}','${cardNumber}', '${client}', '${activationDate}', '${satisfactionStatus}'  `
        })
      });

      const jsonData = await res.json();
      return jsonData;
    },
    []
  );

  return (
    <>
      {visibleSupervisor && (
        <Grid item md={12}>
          <Card
            sx={{
              px: 3,
              pb: 3,
              pt: 3
            }}
          >
            <Grid
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                placeItems: 'end'
              }}
            >
              <>
                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Typography style={{ marginBottom: 20 }} variant="h5">
                  CIF
                  </Typography>
                  <TextField
                    variant="outlined"
                    value={cif}
                    onChange={(event) => {
                      setCif(event.target.value);
                    }}
                    label="CIF"
                    fullWidth
                  />
                </Grid>
                <Grid
                  md={2}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Typography style={{ marginBottom: 20 }} variant="h5">
                  Número de la Tarjeta (enmascarado)
                  </Typography>
                  <TextField
                    variant="outlined"
                    value={cardNumber}
                    onChange={(event) => {
                      setCardNumber(event.target.value);
                    }}
                    label="Tarjeta"
                    fullWidth
                  />
                </Grid>
                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Typography style={{ marginBottom: 20 }} variant="h5">
                  Nombre del cliente
                  </Typography>
                  <TextField
                    variant="outlined"
                    value={client}
                    onChange={(event) => {
                      setClient(event.target.value);
                    }}
                    label="Cliente"
                    fullWidth
                  />
                </Grid>
                <Grid
                  md={2}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Typography style={{ marginBottom: 20 }} variant="h5">
                    Fecha de activación
                  </Typography>
                  <DatePicker
                    inputFormat="MM/DD/YYYY"
                    value={activationDate}
                    onChange={(date) => {
                      setActivationDate(date);
                    }}
                    label="Fecha"
                    renderInput={(props) => (
                      <TextField {...props} style={{ width: '100%' }} />
                    )}
                  />
                </Grid>
                
                <Grid
                  md={2}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Typography variant="h5">Estatus de la satisfacción del cliente:</Typography>
                  <FormControl style={{ marginTop: 20 }} fullWidth>
                    <InputLabel>Selecciona una opción</InputLabel>
                    <Select
                      label="Selecciona un formalizador"
                      value={satisfactionStatus}
                      onChange={(e) => {
                        setSatisfactionStatus(e.target.value);
                      }}
                    >
                      {listStatuses.map((_row, index) => {
                        return (
                          <MenuItem
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                            key={index}
                            value={_row.value}
                          >
                            {_row.text}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            </Grid>
            <Divider style={{ marginTop: 20, marginBottom: 20 }} />
            <Grid
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <>
                <Grid
                  md={6}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Typography
                    style={{ marginBottom: 20, color: 'black' }}
                    variant="h5"
                  >
                    Reporte:
                  </Typography>

                  <Typography
                    style={{ marginBottom: 0, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE ENCUESTA DE SATISFACCIÓN
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                >
                  {' '}
                </Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles,
                  }}
                >
                  <Typography
                    style={{ marginBottom: 19, color: 'white' }}
                    variant="h5"
                  >
                  </Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      GenerateProviderReport(
                        cif, cardNumber, client, dayjs(activationDate).format('MM/DD/YYYY'), satisfactionStatus
                      );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
              </>
            </Grid>
          </Card>
        </Grid>
      )}
    </>
  );
};

export default SatisfactionReports;
