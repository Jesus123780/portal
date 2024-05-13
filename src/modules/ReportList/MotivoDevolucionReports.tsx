import DownloadIcon from '@mui/icons-material/Download';
import { DatePicker } from '@mui/lab';
import {
  Card,
  Grid,
  Divider,
  Typography,
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

const MotivoDevolucionReports = () => {
  const [search, setCif] = React.useState('');
  const [devolucionDate, setDevolucionDate] = React.useState<string|null>(null);
  const [asignacionDate, setAsignacionDate] = React.useState<string|null>(null);
  const [visibleSupervisor, SetVisibleSupervisor] = React.useState(false);
  const { user } = useSelector((state) => state.permissions);

  useEffect(() => {
    if (user.roleCode == 'rol_1') {
      SetVisibleSupervisor(true);
    }
  }, []);

  

  const GenerateProviderReport = async (search, devolucionDate,asignacionDate) => {
    const DATA = await sp_GetRepDevolucionMotivoReport(search,devolucionDate,asignacionDate);
    GenReporte.GenExcelReport(DATA, 13);
  };

  
  const sp_GetRepDevolucionMotivoReport = useCallback(
    async (search, devolucionDate,asignacionDate) => {
      // TODO: no api
      const res = await bacFetch('/api/connection/sp_GetRepDevolucionMotivo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            params: `'${search}', ${devolucionDate ? `'${devolucionDate}'`: null},${asignacionDate ? `'${asignacionDate}'`: null}`
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
                  md={6}
                  style={{
                    paddingRight: 20
                  }}
                >
                  <Typography style={{ marginBottom: 10 }} variant="h5">
                  CIF/Nombre del cliente
                  </Typography>
                  <TextField
                    variant="outlined"
                    value={search}
                    onChange={(event) => {
                      setCif(event.target.value);
                    }}
                    label="CIF/Nombre del cliente/Número de la Tarjeta (enmascarado)"
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
                    Fecha de devolución
                  </Typography>
                  <DatePicker
                    inputFormat="MM/DD/YYYY"
                    value={devolucionDate}
                    onChange={(date) => {
                      setDevolucionDate(date || null);
                    }}
                    label="Fecha"
                    renderInput={(props) => (
                      <TextField {...props} style={{ width: '100%' }} />
                    )}
                  />
                </Grid>
                
                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Typography style={{ marginBottom: 20 }} variant="h5">
                    Fecha de Asignación
                  </Typography>
                  <DatePicker
                    inputFormat="MM/DD/YYYY"
                    value={asignacionDate}
                    onChange={(date) => {
                      setAsignacionDate(date || null);
                    }}
                    label="Fecha"
                    renderInput={(props) => (
                      <TextField {...props} style={{ width: '100%' }} />
                    )}
                  />
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
                    REPORTE MOTIVO DEVOLUCION DE TARJETA
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
                         search,
                         devolucionDate  ? dayjs(devolucionDate).format('MM/DD/YYYY') : null,
                         asignacionDate  ? dayjs(asignacionDate).format('MM/DD/YYYY') : null
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

export default MotivoDevolucionReports;
