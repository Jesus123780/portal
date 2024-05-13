import PageHeader from 'src/content/Dashboards/Reports/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Head from 'next/head';

import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';
import { Grid } from '@mui/material';
import FilterSection from '@/modules/Inventory/FilterSection';
import TableSection from '@/modules/Inventory/TableSection';
import ChartSection from '@/modules/Inventory/ChartSection';
import { SUPERVISORS_MENU_CODE } from '@/utils/permissions';
import { useSelector } from '@/store';
import { useEffect, useState } from 'react';
import Status403 from '@/components/403';
import dayjs from 'dayjs';

const initialState = {
  startDate: dayjs().startOf('month').format('MM/DD/YYYY'),
  endDate: dayjs().format('MM/DD/YYYY'),
  custodySelected: '0',
  formalizerSelected: '0',
  SLASelected: '0',
  LocalizeSelected: '0',
  listStatusSelected: '0'
};

function DashboardReports() {
  const { permissions } = useSelector((state) => state.permissions);
  const [hasPermission, sethasPermission] = useState(true);
  const [objectFilter, setobjectFilter] = useState(initialState);

  const fillObjectFilter = (value) => {
    setobjectFilter(value);
  };

  useEffect(() => {
    const isAllow = permissions.find((p) => {
      return p.CodigoPrivilegio === SUPERVISORS_MENU_CODE;
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
        <title>Supervisors</title>
      </Head>
      <AccentHeaderLayout>
        <PageTitleWrapper>
          <PageHeader
            title="Inventario"
            subtitle="Dashboard de inventario de Tarjetas Chiriquí y Colón"
          />
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
        >
          <ChartSection objectFilter={objectFilter} />
          <FilterSection fillObjectFilter={fillObjectFilter} />
          <TableSection objectFilter={objectFilter} />
        </Grid>
      </AccentHeaderLayout>
    </>
  );
}

export default DashboardReports;
