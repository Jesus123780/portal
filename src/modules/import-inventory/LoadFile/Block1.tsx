import { bacFetch } from '@/utils/service_config';
import { Card, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

const Block1 = ({ refreshData }) => {
  const [totalRegister, setTotalRegister] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const loadData = useCallback(async () => {
    // TODO: no api
    const res = await bacFetch('/api/connection/GetDailyInventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'T'`
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const fetchData = useCallback(() => {
    setLoading(true);
    loadData()
      .then((res) => {
        setTotalRegister(res[0].TOTAL_REGISTROS);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setTotalRegister(0);
      });
  }, [loadData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refreshData) {
      fetchData();
    }
  }, [fetchData, refreshData]);

  if (loading) {
    return (
      <Grid item md={3}>
        <Card
          sx={{
            px: 2,
            pb: 3,
            pt: 3
          }}
        >
          <Skeleton height={200} />
        </Card>
      </Grid>
    );
  }

  return (
    <Card
      sx={{
        px: 2,
        pb: 3,
        pt: 3,
        flexGrow: 1,
      }}
    >
      <Grid
        style={{
          width: '100%',
          backgroundColor: theme.colors.primary.main,
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 8,
          paddingRight: 8,
          borderRadius: 5
        }}
      >
        <Typography
          sx={{
            fontSize: {
              sm: `${theme.typography.pxToRem(16)}`,
              md: `${theme.typography.pxToRem(16)}`,
              lg: `${theme.typography.pxToRem(18)}`,
              xl: `${theme.typography.pxToRem(22)}`,
            },
            color: 'white'
          }}
          variant="h1"
        >
          Registros de hoy
        </Typography>
        <Typography
          sx={{
            fontSize: `${theme.typography.pxToRem(32)}`,
            color: 'white'
          }}
          variant="h3"
        >
          {totalRegister}
        </Typography>
        <Typography
          sx={{
            fontSize: {
              sm: `${theme.typography.pxToRem(10)}`,
              md: `${theme.typography.pxToRem(10)}`,
              lg: `${theme.typography.pxToRem(10)}`,
              xl: `${theme.typography.pxToRem(12)}`,
            },
            color: 'white'
          }}
          variant="h4"
        >
          Total de registros el día de hoy
        </Typography>
      </Grid>
    </Card>
  );
};

export default Block1;
