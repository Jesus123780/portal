import { Box, Card, Typography, Container, styled } from '@mui/material';
import Head from 'next/head';
import { Guest } from 'src/components/Guest';
import { LoginJWT } from 'src/content/Auth/Login/LoginJWT';
import { useTranslation } from 'react-i18next';
import BaseLayout from 'src/layouts/BaseLayout';
import Logo from 'public/BAC-sin-Credomatic.png';
import Image from 'next/image';

const MainContent = styled(Box)(
  () => `
      height: 100%;
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
  `
);

const TopWrapper = styled(Box)(
  () => `
    display: flex;
    width: 100%;
    flex: 1;
    padding: 20px;
  `
);

function LoginBasic() {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Image src={Logo} alt="logo BAC" height={60} width={200} />
            </Box>
            <Card
              sx={{
                mt: 3,
                px: 4,
                pt: 5,
                pb: 3
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  {t('Sign in')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t('Fill in the fields below to sign into your account.')}
                </Typography>
              </Box>
              <LoginJWT />
            </Card>
            <Box>
            <Typography
                variant="subtitle2"
                sx={{
                  mt: 1
                }}
                textAlign={'center'}
              >
                {'V 2.0.1'}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  mt: 1
                }}
                textAlign={'center'}
              >
                {'Hypernova Labs - BAC Trazabilidad'}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1
                }}
                textAlign={'center'}
              >
                {'2023 Copyright HNL'}
              </Typography>
            </Box>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

LoginBasic.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default LoginBasic;
