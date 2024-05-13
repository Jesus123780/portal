import { useSelector } from '@/store';
import { Phone, PhoneAndroid, Save } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import BoxStatus from '../Status/BoxStatus';
import { bacFetch } from '@/utils/service_config';

const SHOW_RETURN_STATUS = [3 /* Devolucion */, 9 /* Devolucion Bac */];
const SHOW_BRANCH_REASON_CODE = ['DEV.T' /* [Reason Code] - Devolución a Tienda */];

const GeneralInformation = ({
  generalInformation,
  deliveryId,
  handleClose,
  fetchData,
  roleCurrent,
  editEnabled
}) => {
  const [formalizers, setformalizers] = useState([]);
  const [statusList, setstatusList] = React.useState([]);
  const [returnReasons, setReturnReasons] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [selectedReturnReason, setSelectedReturnReason] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedFormalizer, setselectedFormalizer] = useState(null);
  const { user } = useSelector((state) => state.permissions);
  const [loading, setloading] = useState(false);

  const listStatusData = useCallback(async () => {
    const res = await bacFetch('/api/connection/GetMSTStatusTypeByRol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${user.roleCode}', null, 1 `
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const listReturnReason = useCallback(async () => {
    // TODO: no api
    const res = await bacFetch('/api/connection/GetReturnReason', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: ""
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const listBranches = useCallback(async () => {
    // TODO: no api
    const res = await bacFetch('/api/connection/SERGetBranchOffices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: ""
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const listFormalizerData = useCallback(async () => {
    const res = await bacFetch('/api/connection/GetMSTOfficers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${user.roleId}'`
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  useEffect(() => {
    const fetchFormalizerData = async () => {
      const formalizers = await listFormalizerData();
      const mappedData = formalizers.map((data) => {
        return { label: data.value, id: data.text };
      });
      setformalizers(mappedData);
    };

    const fetchStatusData = async () => {
      const statusList = await listStatusData();
      const mappedData = statusList.map((data) => {
        return { label: data.text, id: data.value };
      });
      setstatusList(mappedData);
    };

    const fetchReturnReasonData = async () => {
      const returnReasonList = await listReturnReason();
      const mappedData = returnReasonList.map((data) => {
        return {
          label: data.reason_name,
          id: parseInt(data.reason_id),
          reason_code: data.reason_code,
        };
      });
      setReturnReasons(mappedData);
    };

    const fetchBranchesData = async () => {
      const branchList = await listBranches();
      const mappedData = branchList.map((data) => {
        return { label: data.Name, id: data.Id };
      });
      setBranchList(mappedData);
    };

    fetchStatusData();
    fetchReturnReasonData();
    fetchFormalizerData();
    fetchBranchesData();
  }, []);

  useEffect(() => {
    setSelectedReturnReason(null);
    setSelectedBranch(null);
  }, [selectedStatus]);

  useEffect(() => {
    if (generalInformation.reason_id) {
      setSelectedReturnReason(returnReasons.find(
          (x) => x.id === parseInt(generalInformation.reason_id)
        ));
    }

    if (generalInformation.branch_id) {
      setSelectedBranch(branchList.find(
        (x) => x.id === parseInt(generalInformation.branch_id)
      ));
    }
  }, [returnReasons, generalInformation]);

  const saveChanges = useCallback(
    async (deliveryId, officerId, statusId, user, reasonId = '', branchId = '') => {
      // TODO: no api
      const res = await bacFetch('/api/connection/PostUpdateOfficerDelivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: `'${deliveryId}',${officerId},${statusId},'${user}',${reasonId},null, ${branchId}`
        })
      });
      const jsonData = await res.json();
      return jsonData;
    },
    []
  );

  const validateForm = () => {
    if (SHOW_RETURN_STATUS.includes(selectedStatus?.id) && !selectedReturnReason?.reason_code) {
      Swal.fire({
        title: 'Error',
        text: 'Debe elegir un motivo de devolución.',
        icon: 'error',
        confirmButtonColor: '#ba1313'
      });
      return false;
    }

    if (SHOW_BRANCH_REASON_CODE.includes(selectedReturnReason?.reason_code) && !selectedBranch?.id) {
      Swal.fire({
        title: 'Error',
        text: 'Debe elegir una sucursal.',
        icon: 'error',
        confirmButtonColor: '#ba1313'
      });
      return false;
    }

    return true;
  }

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    setloading(true);
    await saveChanges(
      deliveryId,
      selectedFormalizer?.id || "''",
      selectedStatus?.id || "''",
      user.userName,
      SHOW_RETURN_STATUS.includes(selectedStatus?.id) ? `'${selectedReturnReason?.id}'` : "null",
      SHOW_BRANCH_REASON_CODE.includes(selectedReturnReason?.reason_code) ? `'${selectedBranch?.id}'` : "null",
    );
    fetchData();
    setloading(false);
    handleClose();
    setSelectedStatus(null);
    setSelectedReturnReason(null);
    setSelectedBranch(null);
    setselectedFormalizer(null);
    Swal.fire({
      title: 'OK!',
      text: 'Los cambios fueron guardados correctamente.',
      icon: 'success',
      confirmButtonColor: '#ba1313'
    });
  };

  return (
    <Grid container paddingX={2} paddingTop={1}>
      <Grid item md={3}>
        <Card>
          <nav>
            <List>
              <ListItem>
                <ListItemText primary="Teléfonos del cliente" />
              </ListItem>
              <Divider />
              {generalInformation.office_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText primary={generalInformation.office_phone} />
                  </ListItem>
                  <Divider />
                </>
              )}
              {generalInformation.home_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText primary={generalInformation.home_phone} />
                  </ListItem>
                  <Divider />
                </>
              )}
              {generalInformation.mobile_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText primary={generalInformation.mobile_phone} />
                  </ListItem>
                  <Divider />
                </>
              )}
            </List>
          </nav>
          <nav>
            <List>
              <ListItem>
                <ListItemText primary="Teléfonos de BAC" />
              </ListItem>
              <Divider />
              {generalInformation.BAC_office_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary={generalInformation.BAC_office_phone}
                    />
                  </ListItem>
                  <Divider />
                </>
              )}
              {generalInformation.BAC_home_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText primary={generalInformation.BAC_home_phone} />
                  </ListItem>
                  <Divider />
                </>
              )}
              {generalInformation.BAC_phone_1 !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneAndroid />
                    </ListItemIcon>
                    <ListItemText primary={generalInformation.BAC_phone_1} />
                  </ListItem>
                  <Divider />
                </>
              )}
              {generalInformation.BAC_phone_2 !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneAndroid />
                    </ListItemIcon>
                    <ListItemText primary={generalInformation.BAC_phone_2} />
                  </ListItem>
                  <Divider />
                </>
              )}
            </List>
          </nav>
          <nav>
            <List>
              <ListItem>
                <ListItemText primary="Teléfonos Siebel" />
              </ListItem>
              <Divider />
              {generalInformation.siebel_home_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary={generalInformation.siebel_home_phone}
                    />
                  </ListItem>
                  <Divider />
                </>
              )}
              {generalInformation.siebel_mobile_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneAndroid />
                    </ListItemIcon>
                    <ListItemText
                      primary={generalInformation.siebel_mobile_phone}
                    />
                  </ListItem>
                  <Divider />
                </>
              )}
              {generalInformation.siebel_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText primary={generalInformation.siebel_phone} />
                  </ListItem>
                  <Divider />
                </>
              )}
            </List>
          </nav>
        </Card>
      </Grid>
      <Grid item md={9} px={2}>
        <Grid container>
          <Grid md={6}>
            <Card style={{ marginBottom: 20, marginRight: 10 }}>
              <List disablePadding>
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Cliente'} />
                  <Typography variant="subtitle2">
                    {generalInformation.owner_name}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ paddingLeft: 20, height: 64 }}>
                  <ListItemText primary={'Formalizador'} />
                  {editEnabled && roleCurrent !== "rol_7" ? (
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={formalizers}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          className='highlight-autocomplete'
                          label={generalInformation.officer_name}
                        />
                      )}
                      loadingText="Cargando..."
                      value={selectedFormalizer}
                      onChange={(_event, newValue) => {
                        setselectedFormalizer(newValue);
                      }}
                    />
                  ) : (
                    <Typography variant="subtitle2">
                      {generalInformation.officer_name}
                    </Typography>
                  )}
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Trámite'} />
                  <Typography variant="subtitle2">
                    {generalInformation.procedure_name}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Fecha'} />
                  <Typography variant="subtitle2">
                    {dayjs(generalInformation.create_date).format('DD/MM/YYYY')}
                  </Typography>
                </ListItem>
                {(editEnabled && (selectedStatus?.id && SHOW_RETURN_STATUS.includes(selectedStatus.id)) || (generalInformation?.status_id && SHOW_RETURN_STATUS.includes(generalInformation.status_id))) && <ListItem style={{ padding: 33 }} />}
                {selectedStatus && SHOW_RETURN_STATUS.includes(selectedStatus.id) && 
                  selectedReturnReason && SHOW_BRANCH_REASON_CODE.includes(
                    selectedReturnReason.reason_code
                  ) && <ListItem style={{ padding: 33 }} />}
              </List>
            </Card>
          </Grid>
          <Grid md={6}>
            <Card style={{ marginBottom: 20 }}>
              <List disablePadding>
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'CIF'} />
                  <Typography variant="subtitle2">
                    {generalInformation.cif}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Tarjeta'} />
                  <Typography variant="subtitle2">
                    {generalInformation.card_number}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Estatus Actual'} />
                  <BoxStatus
                    color={generalInformation.color}
                    label={generalInformation.name}
                  />
                </ListItem>
                {editEnabled && (
                  <>
                    <Divider component="li" />
                    <ListItem style={{ paddingLeft: 20, height: 64 }}>
                      <ListItemText primary={'Cambiar Estatus'} />
                      <Autocomplete
                        options={statusList}
                        sx={{ width: 250 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            className="highlight-autocomplete"
                            label="Seleccionar estatus"
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        value={selectedStatus}
                        defaultValue={null}
                        onChange={(_event, newValue) => {
                          setSelectedStatus(newValue);
                        }}
                      />
                    </ListItem>
                  </>
                )}
                {
                ((selectedStatus?.id && SHOW_RETURN_STATUS.includes(selectedStatus.id)) || (generalInformation?.status_id && SHOW_RETURN_STATUS.includes(generalInformation.status_id))) && 
                  <ListItem style={{ paddingLeft: 20, height: 64 }}>
                    <ListItemText primary={'Motivo de devolución'} />
                    {selectedStatus &&
                    SHOW_RETURN_STATUS.includes(selectedStatus.id) ? (
                      <>
                        <Autocomplete
                          options={returnReasons}
                          sx={{ width: 250 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              className="highlight-autocomplete"
                              label="Seleccione Motivo"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          value={selectedReturnReason}
                          defaultValue={null}
                          onChange={(_event, newValue) => {
                            setSelectedReturnReason(newValue);
                          }}
                        />
                      </>
                    ) : (
                      <div
                        style={{
                          width: 250,
                          paddingLeft: '4px',
                          paddingRight: '4px',
                          color: 'rgba(34, 51, 84, 0.7)',
                          textAlign: 'right'
                        }}
                      >
                        {generalInformation.reason_name
                          ? generalInformation.reason_name
                          : `No se ha registrado motivo de devolución`}
                      </div>
                    )}
                  </ListItem>
                }

                {selectedStatus && SHOW_RETURN_STATUS.includes(selectedStatus.id) && 
                  selectedReturnReason && SHOW_BRANCH_REASON_CODE.includes(
                    selectedReturnReason.reason_code
                  ) && (
                    <>
                      <ListItem style={{ paddingLeft: 20, height: 64 }}>
                        <ListItemText primary={'Sucursal'} />
                        <Autocomplete
                          options={branchList}
                          sx={{ width: 250 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              className="highlight-autocomplete"
                              label="Seleccione Sucursal"
                            />
                          )}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          value={selectedBranch}
                          defaultValue={null}
                          onChange={(_event, newValue) => {
                            setSelectedBranch(newValue);
                          }}
                        />
                      </ListItem>
                    </>
                  )}
              </List>
            </Card>
          </Grid>
          <Grid md={12}>
            <Card style={{ marginBottom: 20 }}>
              <List disablePadding>
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Observación Adicional'} />
                  <Typography variant="subtitle2">
                    {generalInformation.observations}
                  </Typography>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>

        <Grid container>
          <Grid md={12}>
            <Card>
              <List>
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Producto'} />
                  <Typography variant="subtitle2">
                    {generalInformation.product_name}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Dirección Casa'} />
                  <Typography variant="subtitle2">
                    {generalInformation.home_address}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Dirección Trabajo'} />
                  <Typography variant="subtitle2">
                    {generalInformation.work_address}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Comentarios Ruteo'} />
                  <Typography variant="subtitle2">
                    {generalInformation.routing_comments}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Observación'} />
                  <Typography variant="subtitle2">
                    {generalInformation.observations}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Nombre Fiador'} />
                  <Typography variant="subtitle2">
                    {generalInformation.guarantor_name}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Nombre Adicional'} />
                  <Typography variant="subtitle2">
                    {generalInformation.additional_name}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Comentarios Actividad de Datos'} />
                  <Typography variant="subtitle2">
                    {generalInformation.info_activity_comments}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Descripción Actividad de Datos'} />
                  <Typography variant="subtitle2">
                    {generalInformation.info_activity_description}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Dirección BAC'} />
                  <Typography variant="subtitle2">
                    {generalInformation.BAC_address}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Observación Opcional'} />
                  <Typography variant="subtitle2">
                    {generalInformation.optional_observations}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Opcional 1'} />
                  <Typography variant="subtitle2">
                    {generalInformation.optional_1}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Opcional 2'} />
                  <Typography variant="subtitle2">
                    {generalInformation.optional_2}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Opcional 3'} />
                  <Typography variant="subtitle2">
                    {generalInformation.optional_3}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Opcional 4'} />
                  <Typography variant="subtitle2">
                    {generalInformation.optional_4}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Opcional 5'} />
                  <Typography variant="subtitle2">
                    {generalInformation.optional_5}
                  </Typography>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
        {editEnabled && (
          <Button
            variant="contained"
            endIcon={<Save />}
            style={{ marginTop: '20px', marginBottom: '20px' }}
            onClick={handleSaveChanges}
            disabled={
              (selectedStatus === null && selectedFormalizer === null) ||
              loading
            }
            startIcon={loading ? <CircularProgress size="1rem" /> : null}
          >
            Guardar Cambios
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default GeneralInformation;
