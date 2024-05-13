import React, { useCallback, useEffect, useState } from 'react';
import Block1 from './Block1';
import { useSelector } from '@/store';
import { Card, Grid, Skeleton, useTheme } from '@mui/material';
import { bacFetch } from '@/utils/service_config';

const ChartSection = () => {
  const { user } = useSelector((state) => state.permissions);
  const [cardData, setCardData] = useState({
    totalPending: '0',
    totalDelivered: '0',
    totalDeniedProvider: '0',
    totalReturnedProvider: '0'
  });
  const [loading, setloading] = useState(true);
  const theme = useTheme();

  const getData = useCallback(async (sp, providerID) => {
    // TODO: no api
    const res = await bacFetch(`/api/connection/${sp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${providerID}'`
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  useEffect(() => {
    setloading(true);
    getData('GetCountPendingProviderByDayNewAll', user.providerId)
      .then((res) => {
        const newData = {
          totalPending: res[0].total_pending,
          totalDelivered: res[0].total_delivered,
          totalDeniedProvider: res[0].total_denied,
          totalReturnedProvider: res[0].total_return
        };
        setCardData(newData);
        setloading(false);
      })
      .catch(() => {
        setloading(false);
      });
  }, [user, getData]);

  return (
    <>
      {loading ? (
        <>
          <Grid item md={3}>
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
          <Grid item md={3}>
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
          <Grid item md={3}>
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
          <Grid item md={3}>
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
          <Block1
            quantity={cardData.totalPending}
            color={theme.colors.secondary.main}
            title={'Pendiente de revisar por QA'}
            subtitle={'QA_REVISAR'}
          />
          <Block1
            quantity={cardData.totalDelivered}
            color={theme.colors.success.main}
            title={'Entregadas a BAC'}
            subtitle={'ENTREGADO'}
          />
          <Block1
            quantity={cardData.totalDeniedProvider}
            color={theme.colors.warning.main}
            title={'Denegadas a BAC'}
            subtitle={'REPARO'}
          />
          <Block1
            quantity={cardData.totalReturnedProvider}
            color={theme.colors.primary.main}
            title={'Denegadas por proveedor'}
            subtitle={'QA_RECHAZAR'}
          />
        </>
      )}
    </>
  );
};

export default ChartSection;
