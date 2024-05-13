import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Box,
  useTheme,
} from '@mui/material';
import { Chart } from 'src/components/Chart';
import type { ApexOptions } from 'apexcharts';
import BoxStatus from '@/components/Status/BoxStatus';


function Block3({data}) {
  const theme = useTheme();
  const colors = data ? data.map(x => x.color) : [];
  const labels = data ? data.map(x => x.name) : [];
  const values = data ? data.map(x => x.TotalRecords) : [];

  const sales = {
    datasets: [
      {
        backgroundColor: colors
      }
    ],
    labels: labels
  };

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '55%'
        }
      }
    },
    colors: colors,
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return val + '%';
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },
    labels: labels,
    legend: {
      labels: {
        colors: theme.colors.alpha.trueWhite[100]
      },
      show: false
    },
    stroke: {
      width: 2
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const chartSeries = values;

  return (
    <Card sx={{flexGrow: 1, display: 'flex', height: '350px', justifyContent: 'center', alignItems: 'center'}}>
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid
            md={6}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Chart
              height={228}
              options={chartOptions}
              series={chartSeries}
              type="donut"
            />
          </Grid>
          <Grid md={6} item display="flex" alignItems="center">
            <Box>
            <Typography
              style={{ marginTop: 20, textAlign: 'left' }}
              variant="h5"
            >
              Estados:
            </Typography>
              {sales.labels.map((label: string, i: number) => (
                <Typography
                  key={label}
                  variant="body2"
                  sx={{
                    py: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    mr: 2
                  }}
                >
                  <BoxStatus
                    color={sales.datasets[0].backgroundColor[i]}
                    label={label}
                  />
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Block3;
