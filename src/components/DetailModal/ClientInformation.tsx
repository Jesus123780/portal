import * as Yup from 'yup';
import 'yup-phone';
import DownloadIcon from '@mui/icons-material/Download';
import { Save } from '@mui/icons-material';
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  List,
  Box,
  ListItem,
  ListItemText,
  TextField
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import Swal from 'sweetalert2';
import { bacFetch } from '@/utils/service_config';
import { useFormik } from 'formik';
import GenerateReport from '@/mocks/xlsx';
import { DataDelivery } from './helpers';

const ClientInformation = ({ clientInformation, handleClose, fetchData }) => {
  const [loading, setloading] = useState(false);

  const saveChanges = useCallback(
    async (
      deliveryId,
      homePhone,
      mobilePhone,
      officePhone,
      workAddress,
      homeAddress
    ) => {
      // TODO: no api
      const res = await bacFetch('/api/connection/POSTrnDeliveryCliInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          params: `'${deliveryId}', '${homePhone}', '${mobilePhone}', '${officePhone}', '${workAddress}', '${homeAddress}'`
        })
      });
      const jsonData = await res.json();
      return jsonData;
    },
    []
  );

  const formik = useFormik({
    initialValues: {
      workAddress: clientInformation.work_address,
      homeAddress: clientInformation.home_address,
      officePhone: clientInformation.office_phone,
      homePhone: clientInformation.home_phone,
      mobilePhone: clientInformation.mobile_phone
    },
    validationSchema: Yup.object({
      workAddress: Yup.string()
        .max(300)
        .required('dirección de trabajo es requerido'),
      homeAddress: Yup.string()
        .max(300, 'dirección es demasiado larga')
        .required('dirección de residencia es requerida'),
      officePhone: Yup.string()
        .max(30, 'teléfono debe ser menor a 30 caracteres')
        .required('teléfono de trabajo es requerido')
        .phone('PA', true, 'teléfono inválido'),
      homePhone: Yup.string()
        .max(30, 'teléfono debe ser menor a 30 caracteres')
        .required('teléfono de trabajo es requerido')
        .phone('PA', true, 'teléfono inválido'),
      mobilePhone: Yup.string()
        .max(30, 'teléfono debe ser menor a 30 caracteres')
        .required('teléfono celular es requerido')
        .phone('PA', true, 'teléfono inválido')
    }),
    onSubmit: async (values): Promise<void> => {
      handleSaveChanges(values);
    }
  });

  const handleSaveChanges = async (values) => {
    const { homePhone, mobilePhone, officePhone, workAddress, homeAddress } =
      values;
    setloading(true);
    saveChanges(
      clientInformation.delivery_id,
      homePhone,
      mobilePhone,
      officePhone,
      workAddress,
      homeAddress
    )
      .then(() => {
        Swal.fire({
          title: 'OK!',
          text: 'Los cambios fueron guardados correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
        fetchData();
      })
      .catch(() => {
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error, intente nuevamente.',
          icon: 'error',
          confirmButtonColor: '#ba1313'
        });
      })
      .finally(() => {
        setloading(false);
        handleClose();
      });
  };
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const GenReporte = new GenerateReport();

  function prepareDataForReport(data: DataDelivery) {
    // Filtrar y mapear los datos relevantes
    const {
      cif,
      home_address,
      home_phone,
      mobile_phone,
      office_phone,
      owner_name,
      work_address
     } = data || {}

    return {
      'Nombre': owner_name,
      'CIF': cif,
      'Dirección de Residencia': home_address,
      'Dirección Laboral': work_address,
      'Teléfono de Trabajo': office_phone, // Puedes ajustar estos campos según sea necesario
      'Teléfono de Residencia': home_phone,
      'Número de Celular': mobile_phone
    };
  }
  console.log(clientInformation)
  /**
   * Generates a delivery report based on a specific delivery identifier.
   *
   * @returns {Promise<Object[]|undefined>} A promise that resolves to the delivery report data,
   *                                        or undefined if no deliveryId is provided or in case of an error.
   */
  const sp_GenerateDeliveryReport = async () => {
    try {
      setLoadingButton(true);
      const deliveryId = clientInformation.delivery_id || null;
      if (!deliveryId) {
        return undefined;
      }
      const res = await bacFetch(
        '/api/connection/sp_GetInfoDeliveryDataReport',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ params: `'${deliveryId}'` })
        }
      );
      if (!res.ok) {
        setLoadingButton(false);
        throw new Error(`API responded with status: ${res.status}`);
      }
      setLoadingButton(false);
      const jsonData = await res.json();
      const dataDelivery: DataDelivery = jsonData[0];
      const filteredData = prepareDataForReport(dataDelivery);
      GenReporte.GenExcelReport([filteredData], 14);
      return jsonData;
    } catch (error) {
      setLoadingButton(false);
      return undefined;
    }
  };

  return (
    <Grid container paddingX={0} paddingTop={1}>
      <Grid item xs={12} sm={12} md={8} lg={5} px={2} sx={{ margin: '0 auto' }}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Card style={{ marginBottom: 20 }}>
            <List disablePadding>
              <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
                <ListItemText
                  primary={'Dirección Laboral'}
                  sx={{ width: 350 }}
                />
                <TextField
                  name="workAddress"
                  label={'Ingrese Dirección'}
                  margin="normal"
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.workAddress}
                  variant="outlined"
                  fullWidth
                  error={Boolean(
                    formik.touched.workAddress && formik.errors.workAddress
                  )}
                  helperText={
                    formik.touched.workAddress && formik.errors.workAddress
                  }
                />
              </ListItem>
              <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
                <ListItemText
                  primary={'Dirección de Residencia'}
                  sx={{ width: 350 }}
                />
                <TextField
                  name="homeAddress"
                  label={'Ingrese Dirección'}
                  margin="normal"
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.homeAddress}
                  variant="outlined"
                  fullWidth
                  error={Boolean(
                    formik.touched.homeAddress && formik.errors.homeAddress
                  )}
                  helperText={
                    formik.touched.homeAddress && formik.errors.homeAddress
                  }
                />
              </ListItem>
              <Divider component="li" />
              <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
                <ListItemText
                  primary={'Teléfono de Trabajo'}
                  sx={{ width: 350 }}
                />
                <TextField
                  name="officePhone"
                  label={'Ingrese Teléfono'}
                  margin="normal"
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.officePhone}
                  variant="outlined"
                  fullWidth
                  error={Boolean(
                    formik.touched.officePhone && formik.errors.officePhone
                  )}
                  helperText={
                    formik.touched.officePhone && formik.errors.officePhone
                  }
                />
              </ListItem>
              <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
                <ListItemText
                  primary={'Teléfono de Residencia'}
                  sx={{ width: 350 }}
                />
                <TextField
                  name="homePhone"
                  label={'Ingrese Teléfono'}
                  margin="normal"
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.homePhone}
                  variant="outlined"
                  fullWidth
                  error={Boolean(
                    formik.touched.homePhone && formik.errors.homePhone
                  )}
                  helperText={
                    formik.touched.homePhone && formik.errors.homePhone
                  }
                />
              </ListItem>
              <Divider component="li" />
              <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
                <ListItemText
                  primary={'Número de Celular'}
                  sx={{ width: 350 }}
                />
                <TextField
                  name="mobilePhone"
                  label={'Ingrese Teléfono'}
                  margin="normal"
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.mobilePhone}
                  variant="outlined"
                  fullWidth
                  error={Boolean(
                    formik.touched.mobilePhone && formik.errors.mobilePhone
                  )}
                  helperText={
                    formik.touched.mobilePhone && formik.errors.mobilePhone
                  }
                />
              </ListItem>
            </List>
          </Card>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 2,
              marginTop: '20px',
              marginBottom: '20px'
            }}
          >
            <Button
              type="submit"
              sx={{ margin: '0 auto', display: 'flex' }}
              variant="contained"
              endIcon={<Save />}
              style={{ marginTop: '20px', marginBottom: '20px' }}
              startIcon={loading ? <CircularProgress size="1rem" /> : null}
              disabled={formik.isSubmitting}
            >
              Guardar Cambios
            </Button>
            <Button
              type="button"
              sx={{ margin: '0 auto', display: 'flex' }}
              variant="contained"
              color="info"
              onClick={() => {
                return sp_GenerateDeliveryReport();
              }}
              endIcon={<DownloadIcon />}
              style={{
                marginTop: '20px',
                marginBottom: '20px',
                height: '40px'
              }}
              startIcon={
                loadingButton ? (
                  <CircularProgress color="inherit" size="1rem" />
                ) : null
              }
            >
              Descargar
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
};

export default ClientInformation;
