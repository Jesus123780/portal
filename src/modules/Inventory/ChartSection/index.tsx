import React, { useCallback, useEffect, useState } from 'react';
import Block1 from './Block1';
import Block2 from './Block2';
import Block3 from './Block3';
import dayjs from 'dayjs';
import { Card, Grid, Skeleton } from '@mui/material';
import { bacFetch } from '@/utils/service_config';

const ChartSection = ({ objectFilter }) => {
  const [activatedCards, setactivatedCards] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], chart: {} });
  const [statusData, setStatusData] = useState([]);
  const [loading, setloading] = useState(true);

  const getCustodyByMonth = useCallback(
    async ({ custodySelected, startDate }) => {
      // TODO: no api
      const res = await bacFetch('/api/connection/GetCustodyByMonth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: `'${custodySelected}','${startDate}'`,
        })
      });

      const jsonData = await res.json();
      return jsonData;
    },
    []
  );

  const getCustodyByMonthAll = useCallback(async ({custodySelected}) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/GetCustodyByMonthAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ params: `'${custodySelected}'` })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  const getCustodyByStatusAll = useCallback(async ({custodySelected, startDate}) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/GetCustodyByStatusAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ params: `'${custodySelected}','${startDate}'` })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  useEffect(() => {
    refreshData();
  }, [objectFilter]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setloading(true);
    getCustodyByMonth(objectFilter)
      .then((result) => {
        setactivatedCards(result);
      })
      .finally(() => {
        setloading(false);
      });

    getCustodyByMonthAll(objectFilter)
      .then((result) => {
        let chart = {};
        let months = {};
        for (let index = result.length - 1; index > -1; index--) {
          if (!chart[result[index]?.name]) {
            chart[result[index]?.name] = [];
          }
          months[
            dayjs(new Date(result[index]?.Mes)).locale('es').format('MMMM')
          ] = true;
          chart[result[index]?.name].push(result[index]?.TotalRecords);
        }
        setChartData({
          chart: chart,
          labels: Object.keys(months)
        });
      })
      .finally(() => {
        setloading(false);
      });

    getCustodyByStatusAll(objectFilter)
      .then((result) => {
        setStatusData(result);
      })
      .finally(() => {
        setloading(false);
      });
  };

  return (
    <>
      {loading ? (
        <>
          <Grid item md={4} sx={{ width: '100%' }}>
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
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            padding: '36px 0 0 36px',
            width: '100%'
          }}
        >
          <Block1 activatedCards={activatedCards} />
          <Block2 labels={chartData.labels} chart={chartData.chart} />
          <Block3 data={statusData} />
        </div>
      )}
    </>
  );
};

export default ChartSection;
