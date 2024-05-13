import { Card, Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
require('dayjs/locale/es');

function Block1({ activatedCards }) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        px: 2,
        pb: 3,
        pt: 3,
        flexGrow: 1
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
          Tarjetas en Custodia del mes
        </Typography>
        {activatedCards && activatedCards.map((item) => (
          <>
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
              {item.TotalRecords}
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
              Tarjetas {item.name}
            </Typography>
          </>
        ))}
      </Grid>
    </Card>
  );
}

export default Block1;
