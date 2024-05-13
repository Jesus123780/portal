import PageHeader from 'src/content/Dashboards/Reports/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Head from 'next/head';

import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';
import { Grid } from '@mui/material';
import LoadFile from '@/modules/ImportData/LoadFile';
import Filters from '@/modules/ImportData/Filters';
import TableSection from '@/modules/ImportData/TableSection';
import { useSelector } from '@/store';
import { useEffect, useState } from 'react';
import Status403 from '@/components/403';
import { IMPORT_DATA_MENU_CODE } from '@/utils/permissions';
import dayjs from 'dayjs';

const initialState = {
  startDate: dayjs().startOf('month').format('MM/DD/YYYY'),
  endDate: dayjs().format('MM/DD/YYYY'),
  month: dayjs().startOf('month').format('MM')
};

function DashboardReports() {
  const { permissions } = useSelector((state) => state.permissions);
  const [hasPermission, sethasPermission] = useState(true);
  const [objectFilter, setobjectFilter] = useState(initialState);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const isAllow = permissions.find((p) => {
      return p.CodigoPrivilegio === IMPORT_DATA_MENU_CODE;
    });

    if (!isAllow) {
      sethasPermission(false);
    }
  }, [permissions]);

  const fillObjectFilter = (value) => {
    setobjectFilter(value);
  };

  if (!hasPermission) {
    return <Status403 />;
  }

  const handleRefreshData = (value) => {
    setRefreshData(value);
  };

  return (
    <>
      <Head>
        <title>Importar Datos</title>
      </Head>
      <AccentHeaderLayout>
        <PageTitleWrapper>
          <PageHeader />
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
          <LoadFile
            refreshData={refreshData}
            setRefreshData={handleRefreshData}
          />
          <Filters fillObjectFilter={fillObjectFilter} />{console.log(refreshData)}
          <TableSection
            objectFilter={objectFilter}
            refreshData={refreshData}
            setRefreshData={handleRefreshData}
          />
        </Grid>
      </AccentHeaderLayout>
    </>
  );
}

export default DashboardReports;
