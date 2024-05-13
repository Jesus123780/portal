import DetailModal from '@/components/DetailModal';
import { RemoveRedEyeOutlined, Search } from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import TablePagination from '@mui/material/TablePagination';
import { bacFetch } from '@/utils/service_config';

const TableSection = ({ objectFilter }) => {
  const [open, setOpen] = React.useState(false);
  const [data, setdata] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedDeliveryId, setSelectedDeliveryId] = React.useState('');
  const [searchtextfilter, setsearchtextfilter] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handlesearchtextfilter = (event) => {
    setsearchtextfilter(event.target.value);
  };

  const TableData = useCallback(
    async (filters, page, rowsPerPage, search = '') => {
      // TODO: no api
      const res = await bacFetch('/api/connection/GetLoadDataByFilter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: `'${filters.startDate}','${filters.endDate}','${filters.providerSelected}','${filters.LocalizeSelected}','${filters.SLASelected}','','${filters.formalizerSelected}','${page}','${rowsPerPage}','${search}','0','asc','${filters.listStatusSelected}' `
        })
      });

      const jsonData = await res.json();
      return jsonData;
    },
    []
  );

  const fetchData = async () => {
    setLoading(true);
    const result = await TableData(objectFilter, page + 1, rowsPerPage);
    setdata(result);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    TableData(objectFilter, page + 1, rowsPerPage)
      .then((res) => {
        setdata(res);
        setLoading(false);
      })
      .catch(() => {
        setdata([]);
        setLoading(false);
      });
  }, [objectFilter, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
    setRowsPerPage(10); 
  }, [objectFilter]);

  const handleSearch = async () => {
    const result = await TableData(
      objectFilter,
      page + 1,
      rowsPerPage,
      searchtextfilter
    );
    setdata(result);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <DetailModal
        open={open}
        handleClose={handleClose}
        deliveryId={selectedDeliveryId}
        fetchData={fetchData}
        roleCurrent={'rol_4'}
        editEnabled={false}
      />
      <Grid item md={12} sx={{width: '100%'}}>
        <Card
          sx={{
            px: 2,
            pb: 3,
            pt: 3
          }}
        >
          <Grid style={{ display: 'flex' }} md={12}>
            <Grid item md={12}>
              <TextField
                label="Búsqueda de cliente, CIF, Fiador..."
                fullWidth
                value={searchtextfilter}
                onChange={handlesearchtextfilter}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" onClick={handleSearch}>
                      <IconButton edge="end" color="primary">
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
          <Divider style={{ marginTop: 20, marginBottom: 20 }} />
          <Grid md={12}>
            {loading ? (
              <>
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
              </>
            ) : (
              <>
                <TableContainer>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Producto</TableCell>
                        <TableCell align="center">Cliente</TableCell>
                        <TableCell align="center">CIF</TableCell>
                        <TableCell align="center">Tarjeta</TableCell>
                        <TableCell align="center">Estatus</TableCell>
                        <TableCell align="center">Formalizador</TableCell>
                        <TableCell align="center">Proveedor</TableCell>
                        <TableCell align="center">Acción</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.map((row, index) => {
                        return (
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                              backgroundColor: row.colorRow
                            }}
                            key={index}
                          >
                            <TableCell align="center">{row.id}</TableCell>
                            <TableCell align="center">
                              {row.product_name}
                            </TableCell>
                            <TableCell align="center">
                              {row.owner_name}
                            </TableCell>
                            <TableCell align="center">
                              {row.owner_name}
                            </TableCell>
                            <TableCell align="center">{row.cif}</TableCell>
                            <TableCell align="center">
                              {row.card_number}
                            </TableCell>
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">
                              {row.officer_name}
                            </TableCell>
                            <TableCell align="center">
                              {row.Provider_name}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                variant="text"
                                color="secondary"
                                onClick={() => {
                                  setSelectedDeliveryId(row.delivery_id);
                                  setOpen(true);
                                }}
                              >
                                <RemoveRedEyeOutlined />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  {data.length === 0 && (
                    <Alert
                      style={{ width: '100%', marginTop: 10 }}
                      severity="warning"
                    >
                      No hay datos disponibles en la tabla
                    </Alert>
                  )}
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={data[0]?.totalFiltered || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Registros por página"
                />
              </>
            )}
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default TableSection;
