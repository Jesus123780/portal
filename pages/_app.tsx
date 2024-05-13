import { useEffect, type ReactElement, type ReactNode } from 'react';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { appWithTranslation } from 'next-i18next';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'src/store';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useScrollTop from 'src/hooks/useScrollTop';
import { SnackbarProvider } from 'notistack';
import internationalization from 'src/i18n/i18n';
import RouteGuard from '@/components/RouteGuard';
import 'dayjs/locale/es';
import './index.css';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { FrontConfig } from '@/utils/azure_insights_config';

const clientSideEmotionCache = createEmotionCache();

TokyoApp.getInitialProps = async () => {
  let instrumentationKey = FrontConfig.instrumentationKey;

  return {
    pageProps: { instrumentationKey },
  };
};

const startWebAppInsights = (instrumentationKey: string) => {
    if(!instrumentationKey) return;

    // Start Azure Insights
    const appMetrics = new ApplicationInsights({
        config: {
            instrumentationKey: instrumentationKey,
        },
    });

    console.log("application insight web started...");
    appMetrics.loadAppInsights();

    return appMetrics;
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface TokyoAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
  instrumentationKey: string;
}

function TokyoApp(props: TokyoAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  useScrollTop();

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  useEffect(() => {
    internationalization.changeLanguage('es');

    startWebAppInsights(pageProps.instrumentationKey);
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>BAC Trazabilidad</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="any" />
      </Head>
      <ReduxProvider store={store}>
        <SidebarProvider>
          <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} locale={'es'}>
              <ErrorBoundary>
                <RouteGuard>
                  <SnackbarProvider
                    maxSnack={6}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                  >
                    <CssBaseline />
                    {getLayout(<Component {...pageProps} />)}
                  </SnackbarProvider>
                </RouteGuard>
              </ErrorBoundary>
            </LocalizationProvider>
          </ThemeProvider>
        </SidebarProvider>
      </ReduxProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(TokyoApp);
