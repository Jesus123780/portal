import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import dayjs from 'dayjs';

const Filters = ({ fillObjectFilter }) => {
  const [startDate, setstartDate] = useState('');
  const [endDate, setendDate] = useState('');
  const [isDisabledDatesFilter, setIsDisabledDatesFilter] = useState(false);
  const [monthSelected, setMonthSelected] = useState(
    dayjs().startOf('month').format('MM')
  );

  useEffect(() => {
    setstartDate(dayjs().startOf('month').format('MM/DD/YYYY'));
    setendDate(dayjs().format('MM/DD/YYYY'));
  }, []);

  useEffect(() => {
    setIsDisabledDatesFilter(monthSelected !== '');
  }, [monthSelected]);

  const handleChangeMonth = (event) => {
    setMonthSelected(event.target.value);
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
              display: 'flex'
            }}
          >
            <Grid item md={3}>
              <Typography variant="h5">Meses:</Typography>
              <FormControl style={{ marginTop: 20 }} fullWidth>
                <InputLabel>Selecciona un mes</InputLabel>
                <Select
                  label="Selecciona un mes"
                  value={monthSelected}
                  onChange={handleChangeMonth}
                >
                  <MenuItem value={''}>
                    {'Seleccionar'}
                  </MenuItem>
                  <MenuItem value={'01'}>
                    {dayjs().locale('es').month(0).format('MMMM')}
                  </MenuItem>
                  <MenuItem value={'02'}>
                    {dayjs().locale('es').month(1).format('MMMM')}
                  </MenuItem>
                  <MenuItem value={'03'}>
                    {dayjs().locale('es').month(2).format('MMMM')}
                  </MenuItem>
                  <MenuItem value={'04'}>
                    {dayjs().locale('es').month(3).format('MMMM')}
                  </MenuItem>
                  <MenuItem value={'05'}>
                    {dayjs().locale('es').month(4).format('MMMM')}
                  </MenuItem>
                  <MenuItem value={'06'}>
                    {dayjs().locale('es').month(5).format('MMMM')}
                  </MenuItem>
                  <MenuItem value={'07'}>
                    {dayjs().locale('es').month(6).format('MMMM')}
                  </MenuItem>
                  <MenuItem value={'08'}>
                    {dayjs().locale('es').month(7).format('MMMM')}
                  </MenuItem>
                  <MenuItem value={'09'}>
                    {dayjs().locale('es').month(8).format('MMMM')}
                  </MenuItem>
                  <MenuItem value={'10'}>
                    {dayjs().locale('es').month(9).format('MMMM')}
                  </MenuItem>
                  <MenuItem value={'11'}>
                    {dayjs().locale('es').month(10).format('MMMM')}
                  </MenuItem>
                  <MenuItem value={'12'}>
                    {dayjs().locale('es').month(11).format('MMMM')}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} style={{ paddingLeft: 10, paddingRight: 10 }}>
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
                  <TextField
                    {...props}
                    style={{ marginLeft: 15, width: '45%' }}
                  />
                )}
                disabled={isDisabledDatesFilter}
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
                disabled={isDisabledDatesFilter}
              />
            </Grid>
            <Grid item md={3}>
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
                    month: monthSelected,
                  });
                }}
              >
                Filtrar búsqueda
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default Filters;
