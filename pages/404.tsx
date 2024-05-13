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

function Status404() {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Head>
        <title>Status - 404</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center">
              <img alt="404" height={180} src="/static/images/status/404.svg" />
              <Typography variant="h2" sx={{ my: 2 }}>
                {t("The page you were looking for doesn't exist.")}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
                {t(
                  "It's on us, we moved the content to a different page. The search below should help!"
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

export default Status404;

Status404.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};