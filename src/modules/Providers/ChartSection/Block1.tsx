import { Card, Grid, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
require('dayjs/locale/es')

function Block1({ activatedCards, productivity }) {
  const theme = useTheme();
  return (
    <Grid item md={4}>
      <Card
        sx={{
          px: 2, 
          pb: 3,
          pt: 3
        }}
        style={{ height: '350px' }}
      >
        <Grid
          style={{
            width: '100%',
            backgroundColor: theme.colors.primary.main,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 5,
            height: '100%'
          }}
        >
          <Typography
            component="div"
            sx={{
              fontSize: `${theme.typography.pxToRem(21)}`,
              mb: 3
            }}
            textAlign="center"
            variant="h3"
            color={'white'}
          >
            Activaciones este mes
          </Typography>
          <Typography
            component="div"
            sx={{
              mt: 2,
              fontSize: `${theme.typography.pxToRem(17)}`
            }}
            color={'white'}
            textAlign="center"
            variant="h3"
          >
            {activatedCards}
          </Typography>
          <Typography
            component="div"
            sx={{
              mt: 1,
              fontSize: `${theme.typography.pxToRem(17)}`
            }}
            color={'white'}
            textAlign="center"
            variant="h3"
          >
            Tarjetas activadas
          </Typography>
          <Typography
            component="div"
            sx={{
              mt: 3,
              fontSize: `${theme.typography.pxToRem(17)}`
            }}
            color={'white'}
            textAlign="center"
            variant="h3"
          >
            {`${productivity}%`}
          </Typography>
          <Typography
            component="div"
            sx={{
              mt: 1,
              fontSize: `${theme.typography.pxToRem(17)}`
            }}
            color={'white'}
            textAlign="center"
            variant="h3"
          >
            Efectividad {dayjs().locale('es').format('MMMM')}
          </Typography>
        </Grid>
      </Card>
    </Grid>
  );
}

export default Block1;
