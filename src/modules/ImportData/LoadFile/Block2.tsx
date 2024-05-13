import { bacFetch } from '@/utils/service_config';
import {
  Alert,
  Box,
  Card,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';

const Block2 = ({ refreshData }) => {
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    // TODO: no api
    const res = await bacFetch('/api/connection/GetDailyLoad', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'D'`
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const fetchData = useCallback(() => {
    setLoading(true);
    loadData()
      .then((res) => {
        setDataTable(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setDataTable([]);
      });
  }, [loadData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refreshData) {
      fetchData();
    }
  }, [fetchData, refreshData]);

  return (
    <Card
      sx={{
        pb: 3,
        height: '250px',
        flexGrow: 1,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
      >
        <Box>
          <Typography variant="h4">
            Últimos archivos cargados el día de hoy
          </Typography>
        </Box>
      </Box>
      <TableContainer
        style={{
          maxHeight: '200px',
          overflowY: 'scroll',
          overflowX: 'hidden'
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Id Carga</TableCell>
              <TableCell align="center">Datos</TableCell>
              <TableCell align="center">Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">
                  <Skeleton height={40} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton height={40} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton height={40} />
                </TableCell>
              </TableRow>
            )}
            {dataTable.map((row, index) => {
              return (
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  key={index}
                >
                  <TableCell align="center">{row.ID_CARGA}</TableCell>
                  <TableCell align="center">{row.TOTAL_REGISTROS}</TableCell>
                  <TableCell align="center">
                    {dayjs(row.FECHA_CARGA).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {dataTable.length === 0 && (
          <Alert style={{ width: '100%', marginTop: 10 }} severity="warning">
            No se encontraron cargas el día de hoy
          </Alert>
        )}
      </TableContainer>
    </Card>
  );
};

export default Block2;
