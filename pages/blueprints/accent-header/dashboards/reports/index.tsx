import Head from 'next/head';

import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';

import DashboardReportsContent from 'src/content/DashboardPages/reports';

function DashboardReports() {
  return (
    <>
      <Head>
        <title>Reports Dashboard</title>
      </Head>
      <AccentHeaderLayout>
        <DashboardReportsContent />
      </AccentHeaderLayout>
    </>
  );
}

export default DashboardReports;
