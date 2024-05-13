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
  FormGroup,
  FormControlLabel,
  Checkbox,
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
  const [formalizerSelected, setformalizerselected] = React.useState('0');
  const [LocalizeSelected, setlocalizeselected] = React.useState('0');
  const [SLASelected, setSLAselected] = React.useState('0');
  const [listLocalization, setdatalistLocalization] = React.useState([]);
  const [listProviders, setdatalistProviders] = React.useState([]);
  const [listFormalizer, setdatalistformalizer] = React.useState([]);
  const [listSLA, setdatalistSLA] = React.useState([]);
  const [listStatus, setdatalistStatus] = React.useState([]);
  const [listStatusSelected, setdatalistStatusSelected] = React.useState('0');
  const [loading, setLoading] = React.useState(true);
  const { user } = useSelector((state) => state.permissions);

  useEffect(() => {
    setstartDate(dayjs().startOf('month').format('MM/DD/YYYY'));
    setendDate(dayjs().format('MM/DD/YYYY'));
  }, []);

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
    const res = await bacFetch('/api/supervisors/GetMSTProviders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const listFormalizerData = useCallback(async () => {
     const res = await bacFetch('/api/supervisors/GetMSTOfficers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: `${user.roleId}`
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const listLocalizationData = useCallback(async () => {
    const res = await bacFetch('/api/supervisors/GetMSTLocalization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const listSLAData = useCallback(async () => {
    const res = await bacFetch('/api/supervisors/GetMSTSLA', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      listProvidersData()
        .then((res) => {
          setdatalistProviders(res);
        })
        .catch((_err) => {
          setdatalistProviders([]);
        });

      listFormalizerData()
        .then((res) => {
          setdatalistformalizer(res);
        })
        .catch((_err) => {
          setdatalistformalizer([]);
        });

      listSLAData()
        .then((res) => {
          setdatalistSLA(res);
        })
        .catch((_err) => {
          setdatalistSLA([]);
        });

      listLocalizationData()
        .then((res) => {
          setdatalistLocalization(res);
        })
        .catch((_err) => {
          setdatalistLocalization([]);
        });

      listStatusData()
        .then((res) => {
          setdatalistStatus(res);
          setLoading(false);
        })
        .catch((_err) => {
          setdatalistStatus([]);
          setLoading(false);
        });
    };

    fetchData();
  }, [
    listProvidersData,
    listFormalizerData,
    listSLAData,
    listLocalizationData,
    listStatusData
  ]);

  const handleChangeSelectProv = (event) => {
    setproviderselected(event.target.value);
  };

  const handleChangeSelectForm = (event) => {
    setformalizerselected(event.target.value);
  };

  const handleChangeSelectLocal = (event) => {
    setlocalizeselected(event.target.value);
  };

  const handleChangeSelectSLA = (event) => {
    setSLAselected(event.target.value);
  };

  const handleCheckedStatus = (_row) => {
    const array = listStatusSelected.split(',', 30);
    if (
      array.filter((val) => {
        return val === String(_row.value);
      }).length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSendAllChecks = () => {
    let allStatus = '';
    for (let index = 0; index < listStatus.length; index++) {
      const element = listStatus[index];
      allStatus = allStatus + `${String(element.value)},`;
    }
    return allStatus.substring(0, allStatus.length - 1);
  };
  return (
    <>
      <Grid item xs={12} sm={12} md={12}>
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
                <Grid
                  xs={12}
                  sm={3}
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Skeleton height={80} />
                </Grid>
                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Skeleton height={80} />
                </Grid>
                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Skeleton height={80} />
                </Grid>
                <Grid
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Skeleton height={80} />
                </Grid>
              </>
            ) : (
              <>
                <Grid
                  xs={12}
                  sm={3}
                  md={3}
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
                <Grid
                  xs={12}
                  sm={3}
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Typography variant="h5">Localizadores:</Typography>
                  <FormControl style={{ marginTop: 20 }} fullWidth>
                    <InputLabel>Selecciona una opción</InputLabel>
                    <Select
                      label="Selecciona una opción"
                      value={LocalizeSelected}
                      onChange={handleChangeSelectLocal}
                    >
                      {listLocalization.map((_row, index) => {
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
                <Grid
                  xs={12}
                  sm={3}
                  md={3}
                  style={{
                    paddingRight: 10
                  }}
                >
                  <Typography variant="h5">SLA:</Typography>
                  <FormControl style={{ marginTop: 20 }} fullWidth>
                    <InputLabel>Selecciona una opción</InputLabel>
                    <Select
                      label="Selecciona una opción"
                      value={SLASelected}
                      onChange={handleChangeSelectSLA}
                    >
                      {listSLA.map((_row, index) => {
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
                <Grid md={3}>
                  <Typography variant="h5">Formalizadores:</Typography>
                  <FormControl style={{ marginTop: 20 }} fullWidth>
                    <InputLabel>Selecciona una opción</InputLabel>
                    <Select
                      label="Selecciona una opción"
                      value={formalizerSelected}
                      onChange={handleChangeSelectForm}
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
            )}
          </Grid>
        </Card>
      </Grid>
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
                <Grid item md={4} style={{ paddingRight: 5 }}>
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                </Grid>
                <Grid item md={4} style={{ paddingRight: 5 }}>
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                </Grid>
                <Grid item md={4} style={{ paddingRight: 5 }}>
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                  <Skeleton height={50} />
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
                  <Grid item md={6} lg={6} xl={4}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={listStatusSelected === '0'}
                            onClick={() => {
                              setdatalistStatusSelected('0');
                            }}
                            value={'0'}
                          />
                        }
                        label="Todos"
                      />
                    </FormGroup>
                  </Grid>

                  {listStatus.map((_row, index) => {
                     if (_row.searchapp == 1){
                        return (
                          <Grid item md={6} lg={6} xl={4} key={index}>
                            <FormGroup key={index}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={handleCheckedStatus(_row)}
                                    value={_row.value}
                                    onChange={(e) => {
                                      const array = listStatusSelected.split(
                                        ',',
                                        30
                                      );
                                      const exists = array.includes(e.target.value);
                                      if (exists) {
                                        array.splice(
                                          array.indexOf(e.target.value),
                                          1
                                        );
                                        setdatalistStatusSelected(array.toString());
                                      } else {
                                        array.push(e.target.value);
                                        setdatalistStatusSelected(array.toString());
                                      }
                                    }}
                                    sx={{
                                      '&.Mui-checked': {
                                        color: _row.color
                                      }
                                    }}
                                  />
                                }
                                label={_row.text}
                              />
                            </FormGroup>
                          </Grid>
                        );
                    }
                  })}
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
                        formalizerSelected: formalizerSelected,
                        SLASelected: SLASelected,
                        LocalizeSelected: LocalizeSelected,
                        listStatusSelected:
                          listStatusSelected !== '0'
                            ? listStatusSelected
                            : handleSendAllChecks()
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
