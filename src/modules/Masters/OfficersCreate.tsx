import React, { useEffect, useState } from 'react';
import * as Yup from "yup";
import { useFormik } from 'formik';
import {
    Button,
    CircularProgress,
    DialogActions,
    DialogContent,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField
  } from '@mui/material';

  const OfficersCreate = ({
    handleClose,
    handleSave,
    loading,
    editing = false,
    selectedRow = {}
  }) => {
    const [id, setId] = useState('');
    const [idUser, setidUser] = useState('');
    const [vip, setVip] = React.useState(false);
    const [byProduct, setByProduct] = React.useState(false);
    const [isDisabled, setIsDisabled] = React.useState(false);

    useEffect(() => {
      if (editing) {
        setId(selectedRow['officer_id']);
        setByProduct(selectedRow[`assign_product`] || false);
        setVip(selectedRow[`vip`] || false);
        setidUser(selectedRow['id']);
        setIsDisabled(selectedRow[`disable`] || false); 
      }
    }, [editing, selectedRow]);
    
    const formik = useFormik({
        initialValues: {
          Cedula:  selectedRow['officer_cedula'] || '',
          Name:  selectedRow['officer_name'] || '',
          Password: selectedRow['password'] || '',
          Code: selectedRow['officer_code'] || '',
        },
        validationSchema: Yup.object({
          Cedula: Yup.string()
            .max(16)
            .required('Cédula requerida'),
          Name: Yup.string()
            .max(255)
            .required('El nombre es requerido'),
          Password: Yup.string()
            .max(255)
            .required('El password es requerido'),
          Code: Yup.string()
            .max(255)
            .required('El username es requerido'),
        }),     
        onSubmit: async (values): Promise<void> => {
          save(values);
        }
      });

    const save = async (values) => {
        const { Cedula,Name, Password,Code} =
          values;
     
      if (editing) {
        handleSave(
            id,
            Code,
            Name,
            Password,
            vip,
            byProduct,
            isDisabled,
            idUser,
            Cedula
        );
      } else {
        handleSave(
            Code,
            Name,
            Password,
            vip,
            byProduct,
            Cedula
        );
      }
    };
  
   
    
    return (
      <>
      <form noValidate onSubmit={formik.handleSubmit}>
        <DialogContent
          sx={{
            my: 2,
            p: 2
          }}
        >
           <TextField
                name="Code"
                autoFocus
                margin="dense"
                id="Code"
                label="Nombre de usuario"
                type="text"
                fullWidth
                variant="standard"
                onChange={formik.handleChange}
                value={formik.values.Code}
                error={Boolean(
                    formik.touched.Code && formik.errors.Code
                  )}
                  helperText={
                    formik.touched.Code && formik.errors.Code
                  }
              />
              <TextField
               name="Name"
                margin="dense"
                id="Name"
                label="Nombre"
                type="text"
                fullWidth
                variant="standard"
                onChange={formik.handleChange}
                value={formik.values.Name}
                error={Boolean(
                    formik.touched.Name && formik.errors.Name
                  )}
                  helperText={
                    formik.touched.Name && formik.errors.Name
                  }
              />
              <TextField
                name="Password"
                margin="dense"
                id="Password"
                label="Contraseña"
                type="password"
                fullWidth
                variant="standard"
                onChange={formik.handleChange}
                value={formik.values.Password}
                error={Boolean(
                    formik.touched.Password && formik.errors.Password
                  )}
                  helperText={
                    formik.touched.Password && formik.errors.Password
                  }
              />
               <TextField
                name="Cedula"
                margin="dense"
                id="Cedula"
                label="Cédula"
                type="text"
                fullWidth
                variant="standard"
                onChange={formik.handleChange}
                value={formik.values.Cedula}
                error={Boolean(
                    formik.touched.Cedula && formik.errors.Cedula
                  )}
                  helperText={
                    formik.touched.Cedula && formik.errors.Cedula
                  } 
                />
             <FormControl
                sx={{
                  marginTop: 2
                }}
              >
                <FormLabel>VIP</FormLabel>
                <RadioGroup value={vip} name="status-radiobutton">
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Habilitado"
                    onChange={() => {
                      setVip(true);
                    }}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Deshabilitado"
                    onChange={() => {
                      setVip(false);
                    }}
                  />
                </RadioGroup>
              </FormControl>
              <br />
              <FormControl
                sx={{
                  marginTop: 2
                }}
              >
                <FormLabel>Por producto</FormLabel>
                <RadioGroup value={byProduct} name="status-radiobutton">
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Habilitado"
                    onChange={() => {
                      setByProduct(true);
                    }}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Deshabilitado"
                    onChange={() => {
                      setByProduct(false);
                    }}
                  />
                </RadioGroup>
              </FormControl>
              <br />
        
            <FormControl
                sx={{
                marginTop: 2,
                display: editing ? 'block' : 'none' // Muestra u oculta el FormControl
                }}
               >
            <FormLabel>Estatus del registro</FormLabel>
            
            <RadioGroup value={isDisabled} name="status-radiobutton">
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Habilitado"
                onChange={() => {
                  setIsDisabled(true);
                }}
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Deshabilitado"
                onChange={() => {
                  setIsDisabled(false);
                }}
              />
            </RadioGroup>
          </FormControl>
          
        </DialogContent>
        <DialogActions>
            <Button
             type="submit"
             variant="contained"
             startIcon={
               loading ? <CircularProgress size="1rem" /> : null
             }
             disabled={formik.isSubmitting}
            >
            Guardar
            </Button>
            <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
        </form>
    </>
    );
  };
  
  export default OfficersCreate;

  