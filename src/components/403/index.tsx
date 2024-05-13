import {
    Box,
    Card,
    Typography,
    Container,
    Button,
    styled
  } from '@mui/material';
  import Head from 'next/head';
  import type { ReactElement } from 'react';
  import BaseLayout from 'src/layouts/BaseLayout';
  
  import { useTranslation } from 'react-i18next';
  
  const MainContent = styled(Box)(
    () => `
      height: 100%;
      display: flex;
      flex: 1;
      flex-direction: column;
  `
  );
  
  const TopWrapper = styled(Box)(
    ({ theme }) => `
    display: flex;
    width: 100%;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing(6)};
  `
  );
  
  function Status403() {
    const { t }: { t: any } = useTranslation();
  
    return (
      <>
        <Head>
          <title>Status - 403</title>
        </Head>
        <MainContent>
          <TopWrapper>
            <Container maxWidth="md">
              <Box textAlign="center">
                <img alt="404" height={180} src="/static/images/status/404.svg" />
                <Typography variant="h2" sx={{ my: 2 }}>
                  {t("You don't have access to the page you are looking for.")}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{ mb: 4 }}
                >
                  {t(
                    "Please contact the support team if you have any question"
                  )}
                </Typography>
              </Box>
              <Container maxWidth="sm">
                <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                  <Button href="/" variant="outlined">
                    {t('Go to homepage')}
                  </Button>
                </Card>
              </Container>
            </Container>
          </TopWrapper>
        </MainContent>
      </>
    );
  }
  
  export default Status403;
  
  Status403.getLayout = function getLayout(page: ReactElement) {
    return <BaseLayout>{page}</BaseLayout>;
  };
  