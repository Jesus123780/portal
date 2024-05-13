import DetailModal from '@/components/DetailModal';
import { ChangeCircle, RemoveRedEyeOutlined, Search } from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
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
import dayjs from 'dayjs';
import TablePagination from '@mui/material/TablePagination';
import { useSelector } from '@/store';
import Swal from 'sweetalert2';
import { bacFetch } from '@/utils/service_config';

const TableSection = ({ objectFilter }) => {
  const [open, setOpen] = React.useState(false);
  const [data, setdata] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedDeliveryId, setSelectedDeliveryId] = React.useState('');
  const [searchtextfilter, setsearchtextfilter] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [listStatus, setdatalistStatus] = React.useState([]);
  const [selectedFormalizer, setSelectedFormalizer] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [loaderChangeOfficer, setloaderChangeOfficer] = React.useState(false);
  const { user } = useSelector((state) => state.permissions);

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
          params: `'${filters.startDate}','${filters.endDate}','${filters.providerSelected}','${filters.LocalizeSelected}','${filters.SLASelected}',null,'0','${page}','${rowsPerPage}','0','${search}','asc','2,7,8,4' `
        })
      });

      const jsonData = await res.json();
      return jsonData;
    },
    []
  );

  const listStatusDataList = useCallback(async () => {
    const res = await bacFetch('/api/connection/GetMSTStatusTypeByRol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${user.roleCode}' `
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const changeStatus = useCallback(async (selectedIds, officerId, user) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/PostChangeStatusNew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${JSON.stringify({
          id: selectedIds
        })}',${officerId},'${user}'`
      })
    });
    return res.status;
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const result = await TableData(objectFilter, page + 1, rowsPerPage);
    setdata(result);
    setLoading(false); 
  };

  useEffect(() => {
    listStatusDataList()
      .then((res) => {
        setdatalistStatus(res);
      })
      .catch(() => {
        setdatalistStatus([]);
      });
  }, [listStatusDataList]);

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

  const handleChangeStatus = async () => {
    Swal.fire({
      title: 'Cambiar estado',
      text: '¿Esta seguro que desea cambiar el estado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setloaderChangeOfficer(true);

        await changeStatus(selectedItems, selectedFormalizer, user.userName);

        setloaderChangeOfficer(false);
        Swal.fire({
          title: 'OK!',
          text: 'El estado fue cambiado correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
        setSelectedItems([]);
        setSelectedFormalizer('');
        fetchData();
      }
    });
  };

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
        roleCurrent={'rol_7'}
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
            <Grid item md={6}>
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
            <Grid item md={4} style={{ paddingLeft: 10 }}>
              <FormControl
                fullWidth
                disabled={selectedItems.length === 0 || loaderChangeOfficer}
              >
                <InputLabel>Selecciona estatus</InputLabel>
                <Select
                  label="Selecciona estatus"
                  value={selectedFormalizer}
                  onChange={(e) => {
                    setSelectedFormalizer(e.target.value);
                  }}
                >
                  {listStatus.map((_row, index) => {
                    return (
                      <MenuItem
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}
                        key={index}
                        value={_row.text}
                      >
                        {_row.value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={2} style={{ paddingLeft: 10, display: 'flex' }}>
              <Button
                startIcon={
                  loaderChangeOfficer ? <CircularProgress /> : <ChangeCircle />
                }
                variant="contained"
                color="primary"
                onClick={handleChangeStatus}
                disabled={selectedItems.length === 0 || loaderChangeOfficer}
              >
                Cambiar estado
              </Button>
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
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Cliente</TableCell>
                        <TableCell align="center">Trámite</TableCell>
                        <TableCell align="center">Estatus</TableCell>
                        <TableCell align="center">Proveedor</TableCell>
                        <TableCell align="center">Localización</TableCell>
                        <TableCell align="center">Fecha</TableCell>
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
                            selected={selectedItems.includes(row.id)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                value={row.id}
                                onChange={(e) => {
                                  if (selectedItems.includes(row.id)) {
                                    const items = selectedItems;
                                    setSelectedItems(
                                      items.filter((id) => {
                                        return id !== e.target.value;
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
                            <TableCell align="center">{row.id}</TableCell>
                            <TableCell align="center">
                              {row.owner_name}
                            </TableCell>
                            <TableCell align="center">
                              {row.procedure_name}
                            </TableCell>
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">
                              {row.Provider_name}
                            </TableCell>
                            <TableCell align="center">
                              {row.Provider_zone_name}
                            </TableCell>
                            <TableCell align="center">
                              {dayjs(row.create_date).format('DD/MM/YYYY')}
                            </TableCell>
                            <TableCell align='center'>
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
