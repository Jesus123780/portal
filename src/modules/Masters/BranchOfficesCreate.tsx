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

  const BranchOfficeCreate = ({
    handleClose,
    handleSave,
    loading,
    editing = false,
    selectedRow = {}
  }) => {
    const [id, setId] = useState('');
    const [isDisabled, setIsDisabled] = React.useState(false);

    useEffect(() => {
      if (editing) {
        setId(selectedRow[`id`]);
        setIsDisabled(selectedRow[`disable`] || false); 
      }
    }, [editing, selectedRow]);
    
    const formik = useFormik({
        initialValues: {
          Name:  selectedRow['name'] || '',
        },
        validationSchema: Yup.object({
          Name: Yup.string()
            .max(150)
            .required('Nombre es requerido'),
        }),     
        onSubmit: async (values): Promise<void> => {
          save(values);
        }
      });

    const save = async (values) => {
        const { Name} =
          values;
     
      if (editing) {
        handleSave(
            id,
            Name,
            isDisabled
        );
      } else {
        handleSave(
            Name
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
               /* onChange={(e) => {
                  setName(e.target.value);
                }}*/
              />
            
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
  
  export default BranchOfficeCreate;

  