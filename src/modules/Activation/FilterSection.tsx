import { Search } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import {
  Card,
  FormControl,
  Grid,
  MenuItem,
  Typography,
  Select,
  InputLabel,
  TextField,
  Button,
  Skeleton
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import { useSelector } from '@/store';
import { bacFetch } from '@/utils/service_config';

const FilterSection = ({ fillObjectFilter }) => {
  const [startDate, setstartDate] = React.useState('');
  const [endDate, setendDate] = React.useState('');
  const [providerSelected, setproviderselected] = React.useState('0');
  const [statusSelected, setStatusselected] = React.useState('0');
  const [listProviders, setdatalistProviders] = React.useState([]);
  const [listStatus, setdatalistStatus] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { user } = useSelector((state) => state.permissions);

  const listStatusData = useCallback(async () => {
    const res = await bacFetch('/api/connection/GetMSTStatusTypeByRol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${user.roleCode}' `
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const listProvidersData = useCallback(async () => {
    const res = await bacFetch('/api/connection/GetMSTProviders', {
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

  useEffect(() => {
    setstartDate(dayjs().startOf('month').format('MM/DD/YYYY'));
    setendDate(dayjs().format('MM/DD/YYYY'));
  }, []);

  useEffect(() => {
    setLoading(true);

    listProvidersData()
      .then((res) => {
        setdatalistProviders(res);
      })
      .catch(() => {
        setdatalistProviders([]);
      });

    listStatusData()
      .then((res) => {
        setdatalistStatus(res);
        setLoading(false);
      })
      .catch(() => {
        setdatalistStatus([]);
        setLoading(false);
      });
  }, [listProvidersData, listStatusData]);

  const handleChangeSelectProv = (event) => {
    setproviderselected(event.target.value);
  };

  const handleChangeSelectStatus = (event) => {
    setStatusselected(event.target.value);
  };

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
            {loading ? (
              <>
                <Grid item md={3} style={{ paddingRight: 5 }}>
                  <Skeleton height={70} />
                </Grid>
                <Grid item md={3} style={{ paddingRight: 5 }}>
                  <Skeleton height={70} />
                </Grid>
                <Grid item md={4} style={{ paddingRight: 5 }}>
                  <Skeleton height={70} />
                </Grid>
                <Grid item md={2} style={{ paddingRight: 5 }}>
                  <Skeleton height={70} />
                </Grid>
              </>
            ) : (
              <>
                <Grid
                  item
                  md={6}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap'
                  }}
                >
                  <Grid
                    md={6}
                    style={{
                      paddingRight: 10
                    }}
                  >
                    <Typography variant="h5">Proveedores:</Typography>
                    <FormControl style={{ marginTop: 20 }} fullWidth>
                      <InputLabel>Selecciona una opción</InputLabel>
                      <Select
                        label="Selecciona una opción"
                        value={providerSelected}
                        onChange={handleChangeSelectProv}
                      >
                        {listProviders.map((_row, index) => {
                          return (
                            <MenuItem
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0
                                }
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
                  <Grid
                    md={6}
                    style={{
                      paddingRight: 10
                    }}
                  >
                    <Typography variant="h5">Estado:</Typography>
                    <FormControl style={{ marginTop: 20 }} fullWidth>
                      <InputLabel>Selecciona estatus</InputLabel>
                      <Select
                        label="Selecciona estatus"
                        value={statusSelected}
                        onChange={handleChangeSelectStatus}
                      >
                        {listStatus.map((_row, index) => {
                         if (_row.searchapp == 1){
                          return (
                            <MenuItem
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0
                                }
                              }}
                              key={index}
                              value={_row.status_id}
                            >
                              {_row.text}
                            </MenuItem>
                          );
                            }
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item md={4}>
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
                <Grid md={2}>
                  <Typography
                    style={{ marginBottom: 19, color: 'white' }}
                    variant="h5"
                  >
                    d
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    color="info"
                    startIcon={<Search />}
                    style={{ height: '53px' }}
                    onClick={() => {
                      fillObjectFilter({
                        startDate: dayjs(startDate).format('MM/DD/YYYY'),
                        endDate: dayjs(endDate).format('MM/DD/YYYY'),
                        providerSelected: providerSelected,
                        listStatusSelected: statusSelected,
                        SLASelected: '0',
                        LocalizeSelected: '0'
                      });
                    }}
                  >
                    Filtrar búsqueda
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default FilterSection;
