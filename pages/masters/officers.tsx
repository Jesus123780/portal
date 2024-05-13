import PageHeader from 'src/content/Dashboards/Reports/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Head from 'next/head';

import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';
import { Grid } from '@mui/material';
import { MASTERS_OFFICERS_MENU_CODE } from '@/utils/permissions';
import { useSelector } from '@/store';
import { useEffect, useState } from 'react';
import Status403 from '@/components/403';
import Table from '@/modules/Masters/Returns/Table';
import { officersTable } from '@/modules/Masters/Returns/tableconfig';

function Officers() {
  const { permissions } = useSelector((state) => state.permissions);
  const [hasPermission, sethasPermission] = useState(true);

  useEffect(() => {
    const isAllow = permissions.find((p) => {
      return p.CodigoPrivilegio === MASTERS_OFFICERS_MENU_CODE;
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
        <title>Lista de formalizadores</title>
      </Head>
      <AccentHeaderLayout>
        <PageTitleWrapper>
          <PageHeader title="Maestros" subtitle="Lista de formalizadores" />
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
          <Table
            screenName={'formalizadores'}
            spList="sp_GetInfOfficerDataByFilter"
            spCreate="PostOfficer"
            config={officersTable}  
            internalName={'officer'}
          />
        </Grid>
      </AccentHeaderLayout>
    </>
  );
}

export default Officers;
