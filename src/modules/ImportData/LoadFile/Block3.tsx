import { CloudUploadOutlined } from '@mui/icons-material';
import DetailModal from '@/components/DetailModal/LoadModalDetail';
import { Box, Button, Card, Grid, Typography, useTheme,CircularProgress } from '@mui/material';
import React, { useEffect, useCallback, } from 'react';
import { useFilePicker } from 'use-file-picker';
import * as XLSX from 'xlsx';
import { bacFetch } from '@/utils/service_config';
import { useSelector } from '@/store';

const Block3 = ({ setRefreshData }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loadInfo, setLoadInfo] = React.useState([]);
  const { user } = useSelector((state) => state.permissions);
  const [payload,setPayload] = React.useState(false)
  const [openFilePicker, { filesContent }] = useFilePicker({
    accept: '.xlsx',
    multiple: false,
    readAs: 'ArrayBuffer'
  });

  const handlefile = async (blob) => {
    setError("");
    setPayload(true);
    const ui8Array = new Uint8Array(blob[0]);
    const workbook = XLSX.read(ui8Array, { type: 'array', raw: false });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const dataImported = await importExcel(jsonData);
    setLoadInfo(dataImported[0]);
    setRefreshData(true);
    setOpen(true);
    setPayload(false);
    if ('error' in dataImported) {
      setError(dataImported.error);
      setLoadInfo([]);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const importExcel = useCallback(async (excelData) => {
    const res = await bacFetch('/api/DataImport/ImportData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        excelData: excelData,
        user: user.userName
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  useEffect(() => {
    const file = async () => {
      if (filesContent.length > 0) {
        await handlefile([filesContent[filesContent.length - 1].content]);
      }
    };

    file();
  }, [filesContent]);

  return (
    <Card
      sx={{
        pb: 3,
        height: '250px',
        flexGrow: 1,
      }}
    >
      <DetailModal
        open={open}
        handleClose={handleClose}
        LoadRecord={loadInfo}
        error={error}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          background: `${theme.colors.alpha.black[5]}`
        }}
        p={2}
      >
        <Box>
          <Typography variant="h4">Cargar archivo</Typography>
        </Box>
      </Box>
      <Grid
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 10,
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <CloudUploadOutlined fontSize="large" />
        <Typography variant="h5" style={{ textAlign: 'center' }}>
          Permite cargar archivo de entregas
        </Typography>
        <Button
          style={{ marginTop: 20 }}
          color="warning"
          variant="contained"
          onClick={() => openFilePicker()}
          startIcon={payload ? <CircularProgress size="1rem" /> : null}
        >
          Cargar
        </Button>
        <Typography
          style={{ marginTop: 20, textAlign: 'center' }}
          variant="h5"
        >
          Fecha de última carga
        </Typography>
      </Grid>
    </Card>
  );
};

export default Block3;
