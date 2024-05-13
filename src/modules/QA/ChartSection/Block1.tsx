import { Card, Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

function Block1({ quantity, color, title, subtitle }) {
  const theme = useTheme();
  return (
    <Grid item md={3}>
      <Card
        sx={{
          px: 2,
          pb: 3,
          pt: 3
        }}
        style={{ height: '250px' }}
      >
        <Grid
          style={{
            width: '100%',
            backgroundColor: color,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 5,
            paddingRight: 5,
            borderRadius: 5,
            height: '100%'
          }}
        >
          <Typography
            component="div"
            sx={{
              fontSize: `${theme.typography.pxToRem(20)}`,
              mb:3,
              mt:3
            }}
            textAlign="center"
            variant="h3"
            color={'white'}
          >
            {title}
          </Typography>
          <div>
            <Typography
              component="div"
              sx={{
                fontSize: `${theme.typography.pxToRem(28)}`
              }}
              color={'white'}
              textAlign="center"
              variant="h2"
            >
              {quantity}
            </Typography>
            <Typography
              component="div"
              sx={{
                mt: 1,
                fontSize: `${theme.typography.pxToRem(12)}`
              }}
              color={'white'}
              textAlign="center"
            >
              {subtitle}
            </Typography>
          </div>
        </Grid>
      </Card>
    </Grid>
  );
}

export default Block1;
