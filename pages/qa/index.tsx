import PageHeader from 'src/content/Dashboards/Reports/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Head from 'next/head';

import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';
import { Grid } from '@mui/material';
import FilterSection from '@/modules/QA/FilterSection';
import TableSection from '@/modules/QA/TableSection';
import { QA_MENU_CODE } from '@/utils/permissions';
import { useSelector } from '@/store';
import { useEffect, useState } from 'react';
import Status403 from '@/components/403';
import ChartSection from '@/modules/QA/ChartSection';
import dayjs from 'dayjs';

const initialState = {
  startDate: dayjs().startOf('month').format('MM/DD/YYYY'),
  endDate: dayjs().format('MM/DD/YYYY'),
  providerSelected: '0',
  formalizerSelected: '0',
  SLASelected: '0', 
  LocalizeSelected: '0',
  listStatusSelected: '0'
};

function ConsultDashboard() {
  const { permissions } = useSelector((state) => state.permissions);
  const [hasPermission, sethasPermission] = useState(true);
  const [objectFilter, setobjectFilter] = useState(initialState);

  const fillObjectFilter = (value) => {
    setobjectFilter(value);
  };

  useEffect(() => {
    const isAllow = permissions.find((p) => {
      return p.CodigoPrivilegio === QA_MENU_CODE;
    });

    if (!isAllow) {
      sethasPermission(false);
    }
  }, [permissions]);

  if (!hasPermission) {
    return <Status403 />;
  }

  return (
    <>
      <Head>
        <title>Dashboard de QA</title>
      </Head>
      <AccentHeaderLayout>
        <PageTitleWrapper>
          <PageHeader subtitle="Dashboard de QA" />
        </PageTitleWrapper>
        <Grid
          sx={{
            px: 4
          }}
          container
          direction="row"
          justifyContent="left"
          alignItems="stretch"
          spacing={4}
          paddingLeft={4}
          paddingRight={4}
          paddingBottom={4}
        >
          <ChartSection/>
          <FilterSection fillObjectFilter={fillObjectFilter} />
          <TableSection objectFilter={objectFilter} />
        </Grid>
      </AccentHeaderLayout>
    </>
  );
}

export default ConsultDashboard;
