import { useSelector } from '@/store';
import { Phone, Save } from '@mui/icons-material';
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

const InventoryInformation = ({
  inventoryInformation,
  inventoryId,
  handleClose,
  fetchData,
  editEnabled
}) => {
  const [statusList, setstatusList] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const { user } = useSelector((state) => state.permissions);
  const [loading, setloading] = useState(false);

  const listStatusData = useCallback(async () => {
    const res = await bacFetch('/api/connection/TRNGetInventoryStatuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: ` `
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  useEffect(() => {
    const fetchStatusData = async () => {
      const statusList = await listStatusData();
      const mappedData = statusList.map((data) => {
        return { label: data.name, id: data.status_id };
      });
      setstatusList(mappedData);
    };

    fetchStatusData();
  }, []);

  const saveChanges = useCallback(async (inventoryId, statusId, user) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/PostUpdateInventoryStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${inventoryId}',${statusId},'${user}'`
      })
    });
    const jsonData = await res.json();
    return jsonData;
  }, []);

  const handleSaveChanges = async () => {
    setloading(true);
    await saveChanges(inventoryId, selectedStatus?.id || "''", user.userName);
    fetchData();
    setloading(false);
    handleClose();
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
              {inventoryInformation.office_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText primary={inventoryInformation.office_phone} />
                  </ListItem>
                  <Divider />
                </>
              )}
              {inventoryInformation.home_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText primary={inventoryInformation.home_phone} />
                  </ListItem>
                  <Divider />
                </>
              )}
              {inventoryInformation.mobile_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText primary={inventoryInformation.mobile_phone} />
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
              {inventoryInformation.BAC_home_phone !== '' && (
                <>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary={inventoryInformation.BAC_home_phone}
                    />
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
                    {inventoryInformation.owner_name}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Trámite'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.procedure_name}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Fecha'} />
                  <Typography variant="subtitle2">
                    {dayjs(inventoryInformation.create_date).format(
                      'DD/MM/YYYY'
                    )}
                  </Typography>
                </ListItem>
                {editEnabled && <ListItem style={{ padding: 33 }} />}
              </List>
            </Card>
          </Grid>
          <Grid md={6}>
            <Card style={{ marginBottom: 20 }}>
              <List disablePadding>
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'CIF'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.cif}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Tarjeta'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.card_number}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Estatus Actual'} />
                  <BoxStatus
                    color={inventoryInformation.color}
                    label={inventoryInformation.name}
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
                        value={selectedStatus}
                        onChange={(_event, newValue) => {
                          setSelectedStatus(newValue);
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
                    {inventoryInformation.observations}
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
                    {inventoryInformation.product_name}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Dirección Casa'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.home_address}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Dirección Trabajo'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.work_address}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Observación'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.observations}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Nombre Fiador'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.guarantor_name}
                  </Typography>
                </ListItem>
                <Divider component="li" />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Nombre Adicional'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.additional_name}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Comentarios Actividad de Datos'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.info_activity_comments}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Descripción Actividad de Datos'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.info_activity_description}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Dirección BAC'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.BAC_address}
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem style={{ padding: 20 }}>
                  <ListItemText primary={'Observación Opcional'} />
                  <Typography variant="subtitle2">
                    {inventoryInformation.optional_observations}
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
              (selectedStatus === null) ||
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

export default InventoryInformation;
