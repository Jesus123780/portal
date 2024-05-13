import {
  Card,
  Grid,
  Skeleton,
  Typography,
  Button,
  Divider,
  Tooltip,
  IconButton
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { Calendar, DateObject } from 'react-multi-date-picker';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import 'react-multi-date-picker/styles/colors/red.css';
import { Save } from '@mui/icons-material';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import es_locale from './es_locale';
import { bacFetch } from '@/utils/service_config';

const CalendarSection = () => {
  const [loading, setLoading] = React.useState(true);
  const [monthdate, setmonthdate] = React.useState(
    dayjs().format('MM/DD/YYYY')
  );
  const format = 'MM/DD/YYYY';
  const [values, setValues] = React.useState();
  const [Yearvalue, setYearValue] = React.useState(
    Number(dayjs().format('YYYY').toString())
  );
  const [DateSelected, setDateSelected] = React.useState([]);

  function newcurrdate(value) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const listMonthsData = useCallback(async (selectmonth) => {
    const newmonth = new Date(selectmonth);
    // TODO: no api
    const res = await bacFetch('/api/connection/GetMstCalendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${newmonth.toLocaleDateString('en-US')}'`
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const handleAddMonthSelected = async () => {
    Swal.fire({
      title: 'Agregar Días Feriados',
      text: '¿Esta seguro que desea agregar estas fechas?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await sp_PostMSTCalendarInsert(DateSelected);
        Swal.fire({
          title: 'OK!',
          text: 'Fechas guardadas correctamente',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
      }
    });
  };

  const sp_PostMSTCalendarInsert = useCallback(async (SelectDays) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/PostMSTCalendarInsertNew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${JSON.stringify({
          dates: SelectDays
        })}'`
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const SaveMonthsSelected = (e) => {
    const selectedays = e[e.length - 1].format('MM/DD/YYYY');
    setDateSelected([...DateSelected, selectedays]);
  };

  useEffect(() => {
    setmonthdate((Yearvalue + 1).toString());
  }, [Yearvalue]);

  const setDayMonths = useCallback((res) => {
    const selectedays = res.map((date) => {
      const newdate = new Date(date.calendar_date);
      return newdate.setDate(newdate.getDate() + 1); //Se adiciona un dia para fecha exacta
    });
    setValues(selectedays);
  }, []);

  useEffect(() => {
    setLoading(true);
    listMonthsData(monthdate)
      .then((res) => {
        setDayMonths(res);

        setLoading(false);
      })
      .catch(() => {
        setDayMonths([]);
      });
  }, [listMonthsData, setDayMonths, monthdate]);

  return (
    <>
      <Grid item md={12}>
        <Card
          sx={{
            pb: 3
          }}
        >
          <Grid>
            <>
              <Grid>
                <Grid
                  container
                  sx={{
                    p: 2
                  }}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Tooltip arrow placement="top" title={'Año anterior'}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setYearValue(Yearvalue - 1);
                        }}
                      >
                        <ArrowBackTwoToneIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip arrow placement="top" title={'Ir a año actual'}>
                      <IconButton
                        color="primary"
                        sx={{
                          mx: 1
                        }}
                        onClick={() => {
                          setYearValue(
                            Number(dayjs().format('YYYY').toString())
                          );
                        }}
                      >
                        <TodayTwoToneIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip arrow placement="top" title={'Año siguiente'}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setYearValue(Yearvalue + 1);
                        }}
                      >
                        <ArrowForwardTwoToneIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      display: { xs: 'none', sm: 'inline-block' }
                    }}
                  >
                    <Typography variant="h3" color="text.primary">
                      {Yearvalue}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      display: { xs: 'none', sm: 'inline-block' }
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleAddMonthSelected}
                    >
                      Guardar fechas
                    </Button>
                  </Grid>
                </Grid>
                <Divider />
                {loading ? (
                  <>
                    <Grid
                      item
                      md={12}
                      sx={{
                        px: 2
                      }}
                    >
                      <Skeleton height={300} />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 5
                      }}
                    >
                      <Calendar
                        hideYear
                        buttons={false}
                        fullYear
                        className="red"
                        value={values}
                        currentDate={new DateObject(newcurrdate(monthdate))}
                        onChange={(e) => {
                          SaveMonthsSelected(e);
                        }}
                        multiple
                        format={format}
                        locale={es_locale}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};
export default CalendarSection;
