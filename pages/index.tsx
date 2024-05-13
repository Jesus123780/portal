import { type ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';
import PageHeader from 'src/content/Dashboards/Reports/PageHeader';
import Head from 'next/head';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import AccentHeaderLayout from '@/layouts/AccentHeaderLayout';

function Overview() {
  return (
    <>
      <Head>
        <title>BAC Trazabilidad</title>
      </Head>
      <AccentHeaderLayout>
        <PageTitleWrapper>
          <PageHeader title="Bac Trazabilidad" subtitle="STE" />
        </PageTitleWrapper>
      </AccentHeaderLayout>
    </>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
