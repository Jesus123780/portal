import PageHeader from 'src/content/Dashboards/Reports/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Head from 'next/head';

import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';
import { Grid } from '@mui/material';
import { MASTERS_PROCEDURES_MENU_CODE } from '@/utils/permissions';
import { useSelector } from '@/store';
import { useEffect, useState } from 'react';
import Status403 from '@/components/403';
import Table from '@/modules/Masters/Returns/Table';
import { proceduresTable } from '@/modules/Masters/Returns/tableconfig';

function Products() {
  const { permissions } = useSelector((state) => state.permissions);
  const [hasPermission, setHasPermission] = useState(true);

  useEffect(() => {
    const isAllow = permissions.find((p) => {
      return p.CodigoPrivilegio === MASTERS_PROCEDURES_MENU_CODE;
    });

    if (!isAllow) {
      setHasPermission(false);
    }
  }, [permissions]);

  if (!hasPermission) {
    return <Status403 />;
  }

  return (
    <>
      <Head>
        <title>Lista de trámites</title>
      </Head>
      <AccentHeaderLayout>
        <PageTitleWrapper>
          <PageHeader title="Maestros" subtitle="Lista de trámites" />
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
            screenName='trámites'
            spList="GetProcedure"
            spCreate="PostProcedure"
            config={proceduresTable}
            internalName='procedure'
          />
        </Grid>
      </AccentHeaderLayout>
    </>
  );
}

export default Products;
