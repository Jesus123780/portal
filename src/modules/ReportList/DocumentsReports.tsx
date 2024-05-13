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
import PDF from '../../mocks/pdf';
import { useSelector } from '@/store';
import { bacFetch } from '@/utils/service_config';

export const TableButtonStyles = {
  paddingTop: 12,
  paddingBottom: 8,
  justifyContent: 'flex-end',
  display: 'flex',
};

const FilterSection = () => {
  const [startDate, setstartDate] = React.useState('');
  const [listFormalizer, setdatalistformalizer] = React.useState([]);
  const [selectedFormalizer, setSelectedFormalizer] = React.useState('0');
  const [visibleSupervisor, SetVisibleSupervisor] = React.useState(false);
  const { user } = useSelector((state) => state.permissions);

  const pdfGen = new PDF();
  useEffect(() => {
    setstartDate(dayjs().startOf('month').format('MM/DD/YYYY'));
    if (user.roleCode == 'rol_1') {
      SetVisibleSupervisor(true);
    }
  }, []);

  const listFormalizerData = useCallback(async () => {
    const res = await bacFetch('/api/connection/GetMSTOfficers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${user.roleId}'`
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      listFormalizerData()
        .then((res) => {
          setdatalistformalizer(res);
        })
        .catch(() => {
          setdatalistformalizer([]);
        });
    };

    fetchData();
  }, [listFormalizerData]);

  const GenerateProviderReport = async (startDate, officerId) => {
    const result = await sp_GetDocumentsByDeliveryDate(startDate, officerId);
    pdfGen.GeneratePDFReport(result, 'Reporte.pdf');
  };

  const sp_GetDocumentsByDeliveryDate = useCallback(
    async (startDate, Officerid) => {
      // TODO: no api
      const res = await bacFetch('/api/connection/GetDocumentsByDeliveryDate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: `'${startDate}','${Officerid}' `
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
                  <Typography style={{ marginBottom: 20 }} variant="h5">
                    REPORTE DE DOCUMENTOS :
                  </Typography>
                  <DatePicker
                    inputFormat="MM/DD/YYYY"
                    value={startDate}
                    onChange={(date) => {
                      setstartDate(date);
                    }}
                    label="Fecha"
                    renderInput={(props) => (
                      <TextField {...props} style={{ width: '45%' }} />
                    )}
                  />
                </Grid>
                
                <Grid
                  md={6}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Typography variant="h5">Formalizador:</Typography>
                  <FormControl style={{ marginTop: 20 }} fullWidth>
                    <InputLabel>Selecciona una opción</InputLabel>
                    <Select
                      label="Selecciona un formalizador"
                      value={selectedFormalizer}
                      onChange={(e) => {
                        setSelectedFormalizer(e.target.value);
                      }}
                    >
                      {listFormalizer.map((_row, index) => {
                        return (
                          <MenuItem
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                            key={index}
                            value={_row.text}
                          >
                            {_row.value}
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
                    REPORTE DOCUMENTO DE IDENTIFICACIÓN
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
                        dayjs(startDate).format('MM/DD/YYYY'),
                        selectedFormalizer
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

export default FilterSection;
