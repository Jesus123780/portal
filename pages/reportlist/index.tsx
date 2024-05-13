import PageHeader from 'src/content/Dashboards/Reports/PageHeader'
import PageTitleWrapper from '@/components/PageTitleWrapper'
import Head from 'next/head'

import Reports from '@/modules/ReportList/Reports'
import DocumentsReports from '@/modules/ReportList/DocumentsReports'
import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout'
import { Grid } from '@mui/material'

import { REPORTS_MENU_CODE } from '@/utils/permissions'
import { useSelector } from '@/store'
import { useEffect, useState } from 'react'
import Status403 from '@/components/403'
import SatisfactionReports from '@/modules/ReportList/SatisfactionReports'
import MotivoDevolucionReports from '@/modules/ReportList/MotivoDevolucionReports'

function ConsultDashboard() {
  const { permissions } = useSelector((state) => state.permissions)
  const [hasPermission, sethasPermission] = useState(true)

  useEffect(() => {
    const isAllow = permissions.find((p) => {
      return p.CodigoPrivilegio === REPORTS_MENU_CODE
    })

    if (!isAllow) {
      sethasPermission(false)
    }
  }, [permissions])

  if (!hasPermission) {
    return <Status403 />
  }

  return (
    <>
      <Head>
        <title>Lista de Reportes</title>
      </Head>
      <AccentHeaderLayout>
        <PageTitleWrapper>
          <PageHeader subtitle="Lista de Reportes" />
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
          <Reports />
          <DocumentsReports />
          <SatisfactionReports />
          <MotivoDevolucionReports/>
        </Grid>
      </AccentHeaderLayout>
    </>
  )
}

export default ConsultDashboard
