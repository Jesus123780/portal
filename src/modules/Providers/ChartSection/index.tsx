import React, { useCallback, useEffect, useState } from 'react';
import Block2 from './Block2';
import Block3 from './Block3';
import { useSelector } from '@/store';
import dayjs from 'dayjs';
import { Card, Grid, Skeleton } from '@mui/material';
import { bacFetch } from '@/utils/service_config';

const ChartSection = () => {
  const { user } = useSelector((state) => state.permissions);
  const [delivered, setdelivered] = useState('');
  const [chartData, setchartData] = useState([]);
  const [loading, setloading] = useState(true);

  const getEffectivity = useCallback(async (providerID, date) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/GetEffectivityProviderByMonthAllNew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${providerID}','${date}'`
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  useEffect(() => {
    setloading(true);
    getEffectivity(user.providerId, dayjs().format('MM/DD/YYYY'))
      .then((res) => {
        setdelivered(res[0]['TOTAL_DELIVERY']);
        const chart = [];
        for (let index = res.length - 1; index > -1; index--) {
          const data_per_month = {
            activated: res[index]?.TOTAL_ACTIVE,
            delivered: res[index]?.TOTAL_DELIVERY,
            month: dayjs().add(-index, 'month').locale('es').format('MMMM')
          };
          chart.push(data_per_month);
        }
        setchartData(chart);
        setloading(false);
      })
      .catch(() => {
        setloading(false);
      });
  }, [user, getEffectivity]);

  return (
    <>
      {loading ? (
        <>
          <Grid item md={4}>
            <Card
              sx={{
                px: 2,
                pb: 3,
                pt: 3
              }}
            >
              <Skeleton height={250} />
            </Card>
          </Grid>
          <Grid item md={4}>
            <Card
              sx={{
                px: 2,
                pb: 3,
                pt: 3
              }}
            >
              <Skeleton height={250} />
            </Card>
          </Grid>
          <Grid item md={4}>
            <Card
              sx={{
                px: 2,
                pb: 3,
                pt: 3
              }}
            >
              <Skeleton height={250} />
            </Card>
          </Grid>
        </>
      ) : (
        <>
          <Block2 chartData={chartData} />
          <Block3 delivered={delivered} />
        </>
      )}
    </>
  );
};

export default ChartSection;
