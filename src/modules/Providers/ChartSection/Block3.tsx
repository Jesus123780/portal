import Gauge from '@/components/Gauge';
import { Card, Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import { buildStyles } from 'react-circular-progressbar';

const Block3 = ({ delivered }) => {
  const theme = useTheme();

  return (
    <Grid item md={6}>
      <Card
        sx={{
          px: 2,
          pb: 3,
          pt: 3
        }}
        style={{ height: '350px' }}
      >
        <Typography
          component="div"
          sx={{
            mt: 3,
            fontSize: `${theme.typography.pxToRem(17)}`
          }}
          textAlign="center"
          variant="h3"
        ></Typography>
        <Gauge
          circleRatio={1}
          styles={buildStyles({ rotation: 1 / 2 + 1 / 5.7 })}
          value={delivered}
          strokeWidth={13}
          text={`${delivered}`}
          color="warning"
          size="xxlarge"
        />
        <Typography
          component="div"
          sx={{
            mt: 1,
            fontSize: `${theme.typography.pxToRem(17)}`
          }}
          textAlign="center"
          variant="h3"
        >
          Entregadas
        </Typography>
      </Card>
    </Grid>
  );
};

export default Block3;
