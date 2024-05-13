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
import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import dayjs from 'dayjs';
import { useSelector } from '@/store';
import GenReport from '../../mocks/xlsx';
import { bacFetch } from '@/utils/service_config';

export const TableButtonStyles = {
  paddingTop: 12,
  paddingBottom: 8,
  justifyContent: 'flex-end',
  display: 'flex'
};

const FilterSection = () => {
  const [startDate, setstartDate] = useState('');
  const [endDate, setendDate] = useState('');
  const { user } = useSelector((state) => state.permissions);
  const [listStatus, setdatalistStatus] = useState([]);
  const [listStatusSelected, setdatalistStatusSelected] = useState('0');
  const [selectedFormalizer, setSelectedFormalizer] = useState('0');
  const [listFormalizer, setdatalistformalizer] = useState([]);
  const [visibleProvider, SetVisibleProvider] = useState(true);
  const [visibleSupervisor, SetVisibleSupervisor] = useState(true);
  const GenReporte = new GenReport();

  const listFormalizerData = useCallback(async () => {
    // TODO: no api
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

  const listStatusData = useCallback(async () => {
    // TODO: no api
    const res = await bacFetch('/api/connection/GetreportStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: ``
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const sp_GetRepDetailProvider = useCallback(
    async (startDate, endDate, Estatus, user) => {
      // TODO: no api
      const res = await bacFetch('/api/connection/GetRepDetailProviderNew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: `'${Estatus}','${startDate}','${endDate}','${user}' `
        })
      });

      const jsonData = await res.json();
      return jsonData;
    },
    []
  );

  const sp_GetRepSummary = useCallback(async (user, startDate, endDate) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/GetRepSummaryNew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${user}','${startDate}','${endDate}' `
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  const sp_GetInfoRepType = useCallback(
    async (type, officerid, startDate, endDate, officers) => {
      // TODO: no api
      const res = await bacFetch('/api/connection/GetInfoRepType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: `'${type}','${officerid}','${startDate}','${endDate}','${officers}' `
        })
      });

      const jsonData = await res.json();
      return jsonData;
    },
    []
  );
  
  useEffect(() => {
    setstartDate(dayjs().startOf('month').format('MM/DD/YYYY'));
    setendDate(dayjs().format('MM/DD/YYYY'));
    if (user.roleCode == 'rol_6') {
      SetVisibleProvider(true);
      SetVisibleSupervisor(false);
    } else {
      SetVisibleSupervisor(true);
      SetVisibleProvider(true);
    }
  }, [listFormalizerData]);

  const GenerateProviderReport = async (startDate, endDate, Estatus, user) => {
    const result = await sp_GetRepDetailProvider(
      startDate,
      endDate,
      Estatus,
      user.providerId
    );
    GenerateExcel(result, 101);
  };

  const GenerateSummaryReport = async (user, startDate, endDate) => {
    const result = await sp_GetRepSummary(user.providerId, startDate, endDate);
    GenerateExcel(result, 20);
  };

  const GenerateReportByType = async (
    type,
    officerid,
    startDate,
    endDate,
    officers
  ) => {
    const result = await sp_GetInfoRepType(
      type,
      officerid,
      startDate,
      endDate,
      officers
    );
    GenerateExcel(result, type);
  };
  const GenerateExcel = (DATA, type) => {
    GenReporte.GenExcelReport(DATA, type);
  };

  const handleSendAllFormalizer = () => {
    let allStatus = '';
    for (let index = 0; index < listFormalizer.length; index++) {
      const element = listFormalizer[index];
      allStatus = allStatus + `${String(element.text)},`;
    }
    return allStatus.substring(0, allStatus.length - 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      listStatusData()
        .then((res) => {
          setdatalistStatus(res);
        })
        .catch((_err) => {
          setdatalistStatus([]);
        });
      listFormalizerData()
        .then((res) => {
          setdatalistformalizer(res);
        })
        .catch(() => {
          setdatalistformalizer([]);
        });
    };

    fetchData();
  }, [listStatusData, listFormalizerData]);

  return (
    <>
      <Grid item md={12}>
        <Card
          sx={{
            px: 2,
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
                  Rango de fechas:
                </Typography>
                <DatePicker
                  inputFormat="MM/DD/YYYY"
                  value={startDate}
                  onChange={(date) => {
                    setstartDate(date);
                  }}
                  label="Desde"
                  renderInput={(props) => (
                    <TextField {...props} style={{ width: '45%' }} />
                  )}
                />
                <DatePicker
                  inputFormat="MM/DD/YYYY"
                  value={endDate}
                  onChange={(date) => {
                    setendDate(date);
                  }}
                  label="Hasta"
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      style={{ marginLeft: 15, width: '45%' }}
                    />
                  )}
                />
              </Grid>
              <Grid
                md={6}
                style={{
                  paddingRight: 10
                }}
              >
                <Typography variant="h5">Estatus:</Typography>
                <FormControl style={{ marginTop: 20 }} fullWidth>
                  <InputLabel>Selecciona una opción</InputLabel>
                  <Select
                    label="Selecciona una opción"
                    value={listStatusSelected}
                    onChange={(e) => {
                      setdatalistStatusSelected(e.target.value);
                    }}
                  >
                    {listStatus.map((_row, index) => {
                      return (
                        <MenuItem
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                          key={index}
                          value={_row.valor}
                        >
                          {_row.descripcion}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </>
          </Grid>
          <Grid
            md={6}
            style={{
              paddingRight: 10
            }}
          ></Grid>
          {visibleSupervisor && (
            <Grid
              md={6}
              style={{
                paddingRight: 93
              }}
            >
              <Typography variant="h5" style={{ marginTop: 40 }}>
                Formalizador:
              </Typography>

              <FormControl style={{ marginTop: 10 }} fullWidth>
                <InputLabel>Selecciona una opción</InputLabel>
                <Select
                  label="Selecciona un formalizador"
                  value={selectedFormalizer[0]}
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
          )}
        </Card>
      </Grid>
      <Grid item md={12}>
        <Card
          sx={{
            px: 3,
            pb: 2,
            pt: 2
          }}
        >
          {visibleSupervisor && (
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
                    Reportes:
                  </Typography>

                  <Typography
                    style={{ marginBottom: 5, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE DE ASIGNACION
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                ></Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles
                  }}
                >
                  <Typography
                    style={{ marginBottom: 20, color: 'white' }}
                    variant="h4"
                  ></Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      selectedFormalizer !== '0'
                        ? GenerateReportByType(
                            1,
                            0,
                            dayjs(startDate).format('MM/DD/YYYY'),
                            dayjs(endDate).format('MM/DD/YYYY'),
                            selectedFormalizer
                          )
                        : GenerateReportByType(
                            1,
                            -1,
                            dayjs(startDate).format('MM/DD/YYYY'),
                            dayjs(endDate).format('MM/DD/YYYY'),
                            handleSendAllFormalizer()
                          );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
              </>
            </Grid>
          )}
          {visibleSupervisor && <Divider style={{ marginTop: 5 }} />}
          {visibleSupervisor && (
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
                    style={{ marginBottom: 0 }}
                    variant="h5"
                  ></Typography>

                  <Typography
                    style={{ marginBottom: -20, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE EFECTIVIDAD POR ENTREGA DE FORMALIZADOR
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                ></Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles
                  }}
                >
                  <Typography
                    style={{ marginBottom: 0, color: 'white' }}
                    variant="h4"
                  ></Typography>

                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      selectedFormalizer !== '0'
                        ? GenerateReportByType(
                            2,
                            0,
                            dayjs(startDate).format('MM/DD/YYYY'),
                            dayjs(endDate).format('MM/DD/YYYY'),
                            selectedFormalizer
                          )
                        : GenerateReportByType(
                            2,
                            -1,
                            dayjs(startDate).format('MM/DD/YYYY'),
                            dayjs(endDate).format('MM/DD/YYYY'),
                            handleSendAllFormalizer()
                          );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
              </>
            </Grid>
          )}
          {visibleSupervisor && <Divider style={{ marginTop: 5 }} />}
          {visibleSupervisor && (
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
                    style={{ marginBottom: 0 }}
                    variant="h5"
                  ></Typography>

                  <Typography
                    style={{ marginBottom: -20, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE ENTREGA REALIZADAS POR FORMALIZADOR
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                ></Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles
                  }}
                >
                  <Typography
                    style={{ marginBottom: 0, color: 'white' }}
                    variant="h4"
                  ></Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      selectedFormalizer !== '0'
                        ? GenerateReportByType(
                            3,
                            0,
                            dayjs(startDate).format('MM/DD/YYYY'),
                            dayjs(endDate).format('MM/DD/YYYY'),
                            selectedFormalizer
                          )
                        : GenerateReportByType(
                            3,
                            -1,
                            dayjs(startDate).format('MM/DD/YYYY'),
                            dayjs(endDate).format('MM/DD/YYYY'),
                            handleSendAllFormalizer()
                          );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
              </>
            </Grid>
          )}
          <Divider style={{ marginTop: 5 }} />
          {visibleSupervisor && (
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
                    style={{ marginBottom: 0 }}
                    variant="h5"
                  ></Typography>

                  <Typography
                    style={{ marginBottom: -20, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE MOTIVO DE REPARO
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                ></Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles
                  }}
                >
                  <Typography
                    style={{ marginBottom: 0, color: 'white' }}
                    variant="h4"
                  ></Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      selectedFormalizer !== '0'
                        ? GenerateReportByType(
                            4,
                            0,
                            dayjs(startDate).format('MM/DD/YYYY'),
                            dayjs(endDate).format('MM/DD/YYYY'),
                            selectedFormalizer
                          )
                        : GenerateReportByType(
                            4,
                            -1,
                            dayjs(startDate).format('MM/DD/YYYY'),
                            dayjs(endDate).format('MM/DD/YYYY'),
                            handleSendAllFormalizer()
                          );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
              </>
            </Grid>
          )}
          {visibleSupervisor && <Divider style={{ marginTop: 5 }} />}
          {visibleSupervisor && (
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
                    style={{ marginBottom: 0 }}
                    variant="h5"
                  ></Typography>

                  <Typography
                    style={{ marginBottom: -20, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE MOTIVO DE DEVOLUCIÓN
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                ></Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles
                  }}
                >
                  <Typography
                    style={{ marginBottom: 0, color: 'white' }}
                    variant="h4"
                  ></Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      selectedFormalizer !== '0'
                        ? GenerateReportByType(
                            5,
                            0,
                            dayjs(startDate).format('MM/DD/YYYY'),
                            dayjs(endDate).format('MM/DD/YYYY'),
                            selectedFormalizer
                          )
                        : GenerateReportByType(
                            5,
                            -1,
                            dayjs(startDate).format('MM/DD/YYYY'),
                            dayjs(endDate).format('MM/DD/YYYY'),
                            handleSendAllFormalizer()
                          );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
              </>
            </Grid>
          )}
          {visibleSupervisor && <Divider style={{ marginTop: 5 }} />}

          {visibleSupervisor && (
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
                    style={{ marginBottom: 0 }}
                    variant="h5"
                  ></Typography>

                  <Typography
                    style={{ marginBottom: -20, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE GEO UBICACION
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                ></Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles
                  }}
                >
                  <Typography
                    style={{ marginBottom: 0, color: 'white' }}
                    variant="h4"
                  ></Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      GenerateReportByType(
                        8,
                        '',
                        dayjs(startDate).format('MM/DD/YYYY'),
                        dayjs(endDate).format('MM/DD/YYYY'),
                        ''
                      );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
              </>
            </Grid>
          )}
          {visibleSupervisor && <Divider style={{ marginTop: 5 }} />}
          {visibleSupervisor && (
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
                    style={{ marginBottom: 0 }}
                    variant="h5"
                  ></Typography>

                  <Typography
                    style={{ marginBottom: -20, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE DE BITACORA
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                ></Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles
                  }}
                >
                  <Typography
                    style={{ marginBottom: 0, color: 'white' }}
                    variant="h4"
                  ></Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      GenerateReportByType(
                        9,
                        '',
                        dayjs(startDate).format('MM/DD/YYYY'),
                        dayjs(endDate).format('MM/DD/YYYY'),
                        ''
                      );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
              </>
            </Grid>
          )}

          {visibleSupervisor && <Divider style={{ marginTop: 5 }} />}
          {visibleSupervisor && (
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
                    style={{ marginBottom: 0 }}
                    variant="h5"
                  ></Typography>

                  <Typography
                    style={{ marginBottom: -20, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE POR ACTIVADOR
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                ></Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles
                  }}
                >
                  <Typography
                    style={{ marginBottom: 0, color: 'white' }}
                    variant="h4"
                  ></Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      GenerateReportByType(
                        10,
                        '',
                        dayjs(startDate).format('MM/DD/YYYY'),
                        dayjs(endDate).format('MM/DD/YYYY'),
                        ''
                      );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
              </>
            </Grid>
          )}

          {visibleSupervisor && <Divider style={{ marginTop: 5 }} />}
          {visibleSupervisor && (
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
                    style={{ marginBottom: 0 }}
                    variant="h5"
                  ></Typography>

                  <Typography
                    style={{ marginBottom: -20, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE DE INVENTARIO DE TARJETAS CHIRIQUÍ Y COLÓN
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                ></Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles
                  }}
                >
                  <Typography
                    style={{ marginBottom: 0, color: 'white' }}
                    variant="h4"
                  ></Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      GenerateReportByType(
                        11,
                        '',
                        dayjs(startDate).format('MM/DD/YYYY'),
                        dayjs(endDate).format('MM/DD/YYYY'),
                        ''
                      );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
              </>
            </Grid>
          )}

          {visibleSupervisor && <Divider style={{ marginTop: 5 }} />}
          {visibleProvider && (
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
                    style={{ marginBottom: 0 }}
                    variant="h5"
                  ></Typography>

                  <Typography
                    style={{ marginBottom: -20, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE DETALLE DE PROVEEDOR
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                ></Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles
                  }}
                >
                  <Typography
                    style={{ marginBottom: 0, color: 'white' }}
                    variant="h4"
                  ></Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      GenerateProviderReport(
                        dayjs(startDate).format('MM/DD/YYYY'),
                        dayjs(endDate).format('MM/DD/YYYY'),
                        listStatusSelected,
                        user
                      );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
              </>
            </Grid>
          )}
          {visibleProvider && <Divider style={{ marginTop: 5 }} />}
          {visibleProvider && (
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
                    style={{ marginBottom: 0 }}
                    variant="h5"
                  ></Typography>

                  <Typography
                    style={{ marginBottom: -20, color: 'black' }}
                    variant="h5"
                  >
                    REPORTE RESUMEN DE PROVEEDOR
                  </Typography>
                </Grid>

                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                ></Grid>

                <Grid
                  md={3}
                  style={{
                    ...TableButtonStyles
                  }}
                >
                  <Typography
                    style={{ marginBottom: 0, color: 'white' }}
                    variant="h4"
                  ></Typography>
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<DownloadIcon />}
                    style={{ height: '40px' }}
                    onClick={() => {
                      GenerateSummaryReport(
                        user,
                        dayjs(startDate).format('MM/DD/YYYY'),
                        dayjs(endDate).format('MM/DD/YYYY')
                      );
                    }}
                  >
                    Descargar
                  </Button>
                </Grid>
                <Divider style={{ marginTop: 20, marginBottom: 20 }} />
              </>
            </Grid>
          )}
        </Card>
      </Grid>
    </>
  );
};

export default FilterSection;
