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
import React, { useEffect, useState } from 'react';

const ProviderCreate = ({
  handleClose,
  handleSave,
  loading,
  editing = false,
  selectedRow = {}
}) => {
  const [id, setId] = useState('');
  const [providerId, setproviderId] = useState('');
  const [userName, setuserName] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setemail] = useState('');
  const [address, setaddress] = useState('');
  const [address2, setaddress2] = useState('');
  const [phone, setphone] = useState('');
  const [fax, setfax] = useState('');
  const [passDate, setpassDate] = useState('');
  const [expirationDate, setexpirationDate] = useState('');
  const [qa, setqa] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (editing) {
      setuserName(selectedRow['UserName']);
      setfirstName(selectedRow['FirstName']);
      setlastName(selectedRow['LastName']);
      setemail(selectedRow['Email']);
      setaddress(selectedRow['address']);
      setaddress2(selectedRow['address2'] || '');
      setphone(selectedRow['phone']);
      setfax(selectedRow['fax']);
      setqa(selectedRow['quality']);
      setId(selectedRow['Id']);
      setproviderId(selectedRow['ProviderId']);
      setpassDate(selectedRow['SetPassDate']);
      setexpirationDate(selectedRow['ExpirationDate']);
    }
  }, [editing, selectedRow]);

  const save = () => {
    if (editing) {
      handleSave(
        firstName,
        lastName,
        email,
        phone,
        userName,
        address,
        address2,
        qa,
        fax,
        id,
        providerId,
        passDate,
        expirationDate
      );
    } else {
      handleSave(
        firstName,
        lastName,
        email,
        phone,
        userName,
        address,
        address2,
        qa,
        fax,
        password
      );
    }
  };

  return (
    <>
      <DialogContent
        sx={{
          my: 2,
          p: 2
        }}
      >
        <TextField
          margin="dense"
          label="Usuario"
          type="text"
          fullWidth
          variant="standard"
          value={userName}
          onChange={(e) => {
            setuserName(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          label="Nombre"
          type="text"
          fullWidth
          variant="standard"
          value={firstName}
          onChange={(e) => {
            setfirstName(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          label="Apellido"
          type="text"
          fullWidth
          variant="standard"
          value={lastName}
          onChange={(e) => {
            setlastName(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          label="Correo electrónico"
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
        />
        {!editing && (
          <TextField
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        )}
        <TextField
          margin="dense"
          label="Dirección"
          type="text"
          fullWidth
          variant="standard"
          value={address}
          onChange={(e) => {
            setaddress(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          label="Dirección 2"
          type="text"
          fullWidth
          variant="standard"
          value={address2}
          onChange={(e) => {
            setaddress2(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          label="Teléfono"
          type="text"
          fullWidth
          variant="standard"
          value={phone}
          onChange={(e) => {
            setphone(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          label="Fax"
          type="text"
          fullWidth
          variant="standard"
          value={fax}
          onChange={(e) => {
            setfax(e.target.value);
          }}
        />
        <FormControl
          sx={{
            marginTop: 2
          }}
        >
          <FormLabel>QA</FormLabel>
          <RadioGroup value={qa} name="status-radiobutton">
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Habilitado"
              onChange={() => {
                setqa(true);
              }}
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="Deshabilitado"
              onChange={() => {
                setqa(false);
              }}
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={loading && <CircularProgress size="1rem" />}
          onClick={save}
          disabled={loading}
        >
          Guardar
        </Button>
        <Button onClick={handleClose}>Cancelar</Button>
      </DialogActions>
    </>
  );
};

export default ProviderCreate;
