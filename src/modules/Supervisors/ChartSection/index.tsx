import React, { useCallback, useEffect, useState } from 'react';
import Block1 from './Block1';
import Block2 from './Block2';
import Block3 from './Block3';
import { useSelector } from '@/store';
import dayjs from 'dayjs';
import { Card, Grid, Skeleton } from '@mui/material';
import { bacFetch } from '@/utils/service_config';

const ChartSection = () => {
  const { user } = useSelector((state) => state.permissions);
  const [activatedCards, setactivatedCards] = useState('');
  const [productivity, setproductivity] = useState('');
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
        setactivatedCards(res[0]['TOTAL_ACTIVE']);
        setproductivity(res[0]['EFECTIVITY']);
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
        <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '36px 0 0 36px', width: '100%'}}>
          <Block1 activatedCards={activatedCards} productivity={productivity} />
          <Block2 chartData={chartData} />
          <Block3 delivered={delivered} />
        </div>
      )}
    </>
  );
};

export default ChartSection;
