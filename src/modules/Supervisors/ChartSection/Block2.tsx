import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { Chart } from '@/components/Chart';
import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';

const Block2 = ({ chartData }) => {
  const theme = useTheme();

  const chart1Options: ApexOptions = {
    chart: {
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '60%'
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    labels: [
      dayjs().add(-4, 'month').locale('es').format('MMMM'),
      dayjs().add(-3, 'month').locale('es').format('MMMM'),
      dayjs().add(-2, 'month').locale('es').format('MMMM'),
      dayjs().add(-1, 'month').locale('es').format('MMMM'),
      dayjs().add(-0, 'month').locale('es').format('MMMM')
    ],
    fill: {
      opacity: 1,
      colors: [theme.colors.warning.main, theme.colors.primary.main]
    },
    colors: [theme.colors.warning.main, theme.colors.primary.main],
    legend: {
      show: false
    },
    grid: {
      strokeDashArray: 6,
      borderColor: theme.palette.divider
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
  };

  const chart1Data = [
    {
      name: 'Pendientes',
      data: chartData.map((data) => {
        return data?.delivered;
      })
    },
    {
      name: 'Entregas',
      data: chartData.map((data) => {
        return data?.activated;
      })
    }
  ];

  return (
    <Card
      sx={{
        px: 2,
        pt: 3,
        flexGrow: 1,
      }}
      style={{ height: '350px' }}
    >
      <Typography
        component="div"
        sx={{
          fontSize: `${theme.typography.pxToRem(17)}`
        }}
        textAlign="center"
        variant="h3"
      >
        Pendientes vs Entregas
      </Typography>
      <CardContent>
        <Chart
          options={chart1Options}
          series={chart1Data}
          type="bar"
          height={200}
        />
      </CardContent>
    </Card>
  );
};

export default Block2;
