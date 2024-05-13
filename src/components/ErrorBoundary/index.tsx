import React from 'react';
import { Box, Typography, Container, Button, Grid } from '@mui/material';

class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props) {
    super(props);
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    const { hasError } = this.state;

    if (hasError) {
      return (
        <Grid
          container
          sx={{ height: '100%' }}
          alignItems="stretch"
          spacing={0}
        >
          <Grid
            xs={12}
            alignItems="center"
            display="flex"
            justifyContent="center"
            item
          >
            <Container maxWidth="sm">
              <Box textAlign="center">
                <img
                  alt="500"
                  height={260}
                  src="/static/images/status/500.svg"
                />
                <Typography variant="h2" sx={{ my: 2 }}>
                  {'Ha ocurrido un error, por favor intente de nuevo más tarde'}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{ mb: 4 }}
                >
                  {
                    'El servidor encontró un error interno y no ha sido posible procesar su solicitud'
                  }
                </Typography>
                <Button
                  href="/"
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={() => {
                    location.replace('/');
                  }}
                >
                  {'Ir a página de inicio'}
                </Button>
              </Box>
            </Container>
          </Grid>
        </Grid>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
