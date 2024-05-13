import {
  Delete,
  LibraryBooks,
  RemoveRedEyeOutlined,
  Search,
  Sync
} from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  Skeleton,
  TablePagination,
  Tooltip
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import GenReport from '../../mocks/xlsx';
import DetailModal from '@/components/DetailModal/InventoryModalDetail';
import Swal from 'sweetalert2';
import { bacFetch } from '@/utils/service_config';

const GenReporte = new GenReport();

const TableSection = ({ objectFilter, refreshData, setRefreshData }) => {
  const [data, setdata] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [loadInfo, setLoadInfo] = React.useState([]);

  const TableData = useCallback(
    async (StartDate, EndDate, Month, Find, Page, RowsPerPage) => {
      const res = await bacFetch('/api/connection/GetInfoLoadInventoryByFilter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: `'${StartDate}','${EndDate}',null,'','${Month}','${Find}',null,null,null,null,null,${Page},${RowsPerPage},0,'desc','1'`,
        })
      });

      const jsonData = await res.json();
      return jsonData;
    },
    []
  );

  const LoadDataProcess = useCallback(async (id) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/ProcessInventoryLoadByLoadId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${id}', 'Estimado Cliente se ha asignado proveedor', 'localhost'`,
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const InfoLoadData = useCallback(async (id) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/GetLoadInventoryByLoadIdNew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${id}'`
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  const DeleteLoadData = useCallback(async (id) => {
    const res = await bacFetch('/api/connection/DeleteSingleProcessInventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: id
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  const DeleteLoadDataMultiple = useCallback(async (id) => {
    const res = await bacFetch('/api/DataImport/DeleteAllLoadDataMultiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        load: JSON.stringify({ id_list: id })
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  const InfoLoadDataExcel = useCallback(async (id) => {
    const res = await bacFetch('/api/DataImport/GetInfoLoadIdMultiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        load: JSON.stringify({ id_list: id })
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const GenerateLoadIdReport = async (selectedItems) => {
    setLoading(true);
    const result = await InfoLoadDataExcel(selectedItems);
    GenReporte.GenExcelReport(result, 11);
    setLoading(false);
  };

  const fetchData = useCallback(() => {
    setLoading(true);
    TableData(
      objectFilter.startDate,
      objectFilter.endDate,
      objectFilter.month,
      '',
      page + 1,
      rowsPerPage
    )
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
    setLoading(true);
    TableData(
      objectFilter.startDate,
      objectFilter.endDate,
      objectFilter.month,
      '',
      page + 1,
      rowsPerPage
    )
      .then((res) => {
        setdata(res);
        setLoading(false);
      })
      .catch(() => {
        setdata([]);
        setLoading(false);
      });
  }, [TableData, objectFilter, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
    setRowsPerPage(10);
  }, [objectFilter]);

  useEffect(() => {
    if (refreshData) {
      fetchData();
      setRefreshData(false);
    }
  }, [refreshData]);

  const handleProcessData = (row) => {
    Swal.fire({
      title: 'Procesar carga',
      text: '¿Esta seguro que desea procesar esta carga de datos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await LoadDataProcess(row.load_id);
        Swal.fire({
          title: 'OK!',
          text: 'La carga fue procesada correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
        setRefreshData(true);
        fetchData();
      }
    });
  };

  const handleDeleteData = (row) => {
    Swal.fire({
      title: 'Eliminar carga',
      text: '¿Esta seguro que desea eliminar esta carga de datos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await DeleteLoadData(row.load_id);
        Swal.fire({
          title: 'OK!',
          text: 'La carga fue eliminada correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
        fetchData();
      }
    });
  };

  const handleDeleteMultiple = () => {
    Swal.fire({
      title: 'Eliminar varios',
      text: '¿Esta seguro que desea eliminar los registros seleccionados?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await DeleteLoadDataMultiple(selectedItems);
        Swal.fire({
          title: 'OK!',
          text: 'Los registros han sido eliminados correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
        fetchData();
        setSelectedItems([]);
      }
    });
  };

  const handleGenerateExcel = async () => {
    await GenerateLoadIdReport(selectedItems);
    setSelectedItems([]);
  };

  const handleViewDetails = (row) => {
    InfoLoadData(row.load_id)
      .then((res) => {
        setLoadInfo(res);
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
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
        LoadRecord={loadInfo}
        view={true}
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
            <Grid item md={8}>
              <TextField
                label="Búsqueda de cliente, CIF, Fiador..."
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" color="primary">
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            {selectedItems.length > 0 &&
              <Grid
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingLeft: 20,
                  gap: 16,
                }}
                item
                md={4}
              >
                <Button
                  startIcon={<LibraryBooks />}
                  variant="outlined"
                  color="success"
                  disabled={selectedItems.length === 0}
                  onClick={handleGenerateExcel}
                >
                  Exportar excel
                </Button>
                <Button
                  startIcon={<Delete />}
                  variant="outlined"
                  color="error"
                  disabled={selectedItems.length === 0}
                  onClick={handleDeleteMultiple}
                >
                  Eliminar múltiples
                </Button>
              </Grid>
            }
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
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">Id Carga</TableCell>
                        <TableCell align="center">Nombre del archivo</TableCell>
                        <TableCell align="center">Total de registros</TableCell>
                        <TableCell align="center">Fecha de carga</TableCell>
                        <TableCell align="center">Acción</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.map((row, index) => {
                        return (
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                            key={index}
                            selected={selectedItems.includes(row.load_id)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                value={row.load_id}
                                onChange={(e) => {
                                  if (selectedItems.includes(row.load_id)) {
                                    const items = selectedItems;
                                    setSelectedItems(
                                      items.filter((load_id) => {
                                        return load_id != e.target.value;
                                      })
                                    );
                                  } else {
                                    setSelectedItems([
                                      ...selectedItems,
                                      e.target.value
                                    ]);
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">{row.load_id}</TableCell>
                            <TableCell align="center">
                              {row.name_file}
                            </TableCell>
                            <TableCell align="center">
                              {row.numberLine}
                            </TableCell>
                            <TableCell align="center">
                              {dayjs(row.load_date).format('DD/MM/YYYY')}
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip
                                arrow
                                placement="top"
                                title={'Procesar'}
                              >
                                <Button
                                  variant="contained"
                                  color="warning"
                                  onClick={() => {
                                    handleProcessData(row);
                                  }}
                                  sx={{
                                    mr: 1,
                                    visibility: row.ProcessData ? 'hidden' : 'visible',
                                  }}
                                >
                                  <Sync />
                                </Button>
                              </Tooltip>
                              <Tooltip
                                arrow
                                placement="top"
                                title={'Ver detalles'}
                              >
                                <Button
                                  variant="text"
                                  color="secondary"
                                  onClick={() => {
                                    handleViewDetails(row);
                                  }}
                                  sx={{
                                    mr: 1
                                  }}
                                >
                                  <RemoveRedEyeOutlined />
                                </Button>
                              </Tooltip>
                              <Tooltip arrow placement="top" title={'Eliminar'}>
                                <Button
                                  variant="text"
                                  color="primary"
                                  onClick={() => {
                                    handleDeleteData(row);
                                  }}
                                  sx={{
                                    mr: 1
                                  }}
                                >
                                  <Delete />
                                </Button>
                              </Tooltip>
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
