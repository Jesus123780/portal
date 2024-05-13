import PageHeader from 'src/content/Dashboards/Reports/PageHeader'
import PageTitleWrapper from '@/components/PageTitleWrapper'
import Head from 'next/head'

import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout'
import { Grid } from '@mui/material'
import { MASTERS_DOCUMENTS_MENU_CODE } from '@/utils/permissions'
import { useSelector } from '@/store'
import { useEffect, useState } from 'react'
import Status403 from '@/components/403'
import Table from '@/modules/Masters/Returns/Table'
import { documentsTable } from '@/modules/Masters/Returns/tableconfig'

function Documents() {
  const { permissions } = useSelector((state) => { return state.permissions })
  const [hasPermission, setHasPermission] = useState(true)

  useEffect(() => {
    const isAllow = permissions.find((p) => {
      return p.CodigoPrivilegio === MASTERS_DOCUMENTS_MENU_CODE
    })

    if (!isAllow) {
      setHasPermission(false)
    }
  }, [permissions])

  if (!hasPermission) {
    return <Status403 />
  }

  return (
    <>
      <Head>
        <title>Lista de documentos</title>
      </Head>
      <AccentHeaderLayout>
        <PageTitleWrapper>
          <PageHeader title="Maestros" subtitle="Lista de documentos" />
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
            screenName={'documentos'}
            spList="GetDocument"
            spCreate="PostDocument"
            config={documentsTable}
            internalName={'document'}
          />
        </Grid>
      </AccentHeaderLayout>
    </>
  )
}

export default Documents
