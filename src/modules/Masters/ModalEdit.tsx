
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import Swal from 'sweetalert2';
import ProviderZoneCreate from './ProviderZoneCreate';
import { bacFetch } from '@/utils/service_config';
import ProviderCreate from './ProviderCreate';
import OfficersCreate from './OfficersCreate';
import BranchOfficesCreate from './BranchOfficesCreate';

export default function ModalEdit({
  handleClose,
  open,
  title,
  subtitle,
  selectedRow,
  spCreate,
  user,
  fetchData,
  showCode,
  internalName
}) {
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [cedula, setCedula] = React.useState('');
  const [vip, setVip] = React.useState(false);
  const [byProduct, setByProduct] = React.useState(false);

  React.useEffect(() => {
    setName(selectedRow[`${internalName}_name`]);
    setCode(selectedRow[`${internalName}_code`]);
    setIsDisabled(selectedRow.disable || false);

    if (internalName === 'otro') {
      setPassword(selectedRow[`password`]);
      setByProduct(selectedRow[`assign_product`] || false);
      setCedula(selectedRow[`officer_cedula`]);
      setVip(selectedRow[`vip`] || false);
    }
  }, [selectedRow, internalName]);

  const editData = async () => {
    const disabled = isDisabled ? 1 : 0

    const params = showCode
      ? `${
          selectedRow[`${internalName}_id`]
        } , '${name}', '${code}' , '${user}', ${disabled} `
      : `${
          selectedRow[`${internalName}_id`]
        } , '${name}' , '${user}', ${disabled}`;
    // TODO: no api
    const res = await bacFetch(`/api/connection/${spCreate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: params
      })
    });

    const jsonData = await res.json();
    return jsonData;
  };

  const editBranchOffices = async (
    id: any,
    name: any,
    disable: any
  ) => {
    const params = `@id='${id}', @name='${name}',@disable =${disable ? 1 : 0}`;
    // TODO: no api
    const res = await bacFetch(`/api/connection/${spCreate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: params
      })
    });
    const jsonData = await res.json();
    const message = jsonData[0].message;
      if (message !='ok'){
           throw new Error(message);
       }
    return jsonData;
  };

  const editOfficer = async (
    id: any,
    code: any,
    name: any,
    password: any,
    vip: any,
    disable: any,
    byProduct: any,
    idUser: any,
    cedula: any
  ) => {
    const params = `@officer_id=${id}, @officer_code='${code}', @officer_name='${name}', @password='${password}',@vip =${vip ? 1 : 0} , @create_by ='${user}', @disable =${
      disable ? 1 : 0},@assign_product=${byProduct ? 1 : 0}, @id='${idUser}', @cedula='${cedula}'`;

    // TODO: no api
    const res = await bacFetch(`/api/connection/${spCreate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: params
      })
    });

    const jsonData = await res.json();
    const message = jsonData[0].message;
      if (message !='ok'){
           throw new Error(message);
       }
    return jsonData;
  };


  const editProviderZone = async (
    id: any,
    providerid: any,
    code: any,
    on_time_A: any,
    on_time_B: any,
    for_winning_A: any,
    for_winning_B: any,
    defeated_A: any,
    defeated_B: any
  ) => {
    const params = `@id=${id}, @provider_id=${providerid} , @code='${code}' , @on_time_A=${on_time_A} ,@on_time_B =${on_time_B} , @for_winning_A =${for_winning_A} ,@Defeated_A =${defeated_A} ,@for_winning_B=${for_winning_B} ,@Defeated_B=${defeated_B}`;

    // TODO: no api
    const res = await bacFetch(`/api/connection/${spCreate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: params
      })
    });

    const jsonData = await res.json();
    return jsonData;
  };

  const editProvider = async (
    firstName: any,
    lastName: any,
    email: any,
    phone: any,
    userName: any,
    address: any,
    address2: any,
    qa: any,
    fax: any,
    id: any,
    providerId: any,
    passDate: any,
    expirationDate: any
  ) => {
    const params = `@i_idUser ='${id}', @i_FirstName  = '${firstName}',@i_LastName = '${lastName}',@i_Email = '${email}',@i_EmailConfirmed =1,@i_PhoneNumber = ${phone},@i_PhoneNumberConfirmed= true,@i_TwoFactorEnabled =true,@i_LockoutEnabled = false,@i_AccessFailedCount = 0,@i_UserName = '${userName}' ,@i_address = '${address}',@i_address2 = '${address2}',@i_quality = ${
      qa ? 1 : 0
    },@i_phone =${phone},@i_fax =${fax},@i_SetPassDate ='${passDate}',@i_ExpirationDate = '${expirationDate}',@i_ExpirationDay =0,@i_ChangesPass =false,@i_disable =false,@i_providerId = ${providerId}`;

    const res = await fetch('/api/connection/AspNetUsersProviderUpdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: params
      })
    });

    const jsonData = await res.json();
    return jsonData;
  };

  const handleEditProvider = (
    firstName: any,
    lastName: any,
    email: any,
    phone: any,
    userName: any,
    address: any,
    address2: any,
    qa: any,
    fax: any,
    id: any,
    providerId: any,
    passDate: any,
    expirationDate: any
  ) => {
    setLoading(true);
    editProvider(
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
    )
      .then(() => {
        fetchData();
        handleClose();
        setLoading(false);
        Swal.fire({
          title: 'OK!',
          text: 'El registro fue editado correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
      }).catch((_err) => {
        setLoading(false);
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error, intente nuevamente.',
          icon: 'error',
          confirmButtonColor: '#ba1313'
        });
      });
  };

  const handleSaveOfficers = (
    id: any,
    code: any,
    name: any,
    password: any,
    vip: any,
    disabled: any,
    byProduct: any,
    idUser: any,
    cedula: any
  ) => {
    setLoading(true);
    editOfficer(
      id,
      code,
      name,
      password,
      vip,
      disabled,
      byProduct,
      idUser,
      cedula
    )
      .then(() => {
        fetchData();
        handleClose();
        setLoading(false);
        Swal.fire({
          title: 'OK!',
          text: 'El registro fue editado correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
      })
      .catch((_err) => {
        setLoading(false);
        Swal.fire({
          title: 'Error',
          text:_err,
          icon: 'error',
          confirmButtonColor: '#ba1313'
        });
      });
  };

  const handleSaveBranchOffices = (
    id: any,
    name: any,
    disabled: any
  ) => {
    setLoading(true);
    editBranchOffices(
      id,
      name,
      disabled,
    )
      .then(() => {
        fetchData();
        handleClose();
        setLoading(false);
        Swal.fire({
          title: 'OK!',
          text: 'El registro fue editado correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
      })
      .catch((_err) => {
        setLoading(false);
        Swal.fire({
          title: 'Error',
          text:_err,
          icon: 'error',
          confirmButtonColor: '#ba1313'
        });
      });
  };

  const handleSaveProviderZone = (
    id: any,
    providerid: any,
    code: any,
    on_time_A: any,
    on_time_B: any,
    for_winning_A: any,
    for_winning_B: any,
    defeated_A: any,
    defeated_B: any
  ) => {
    setLoading(true);
    editProviderZone(
      id,
      providerid,
      code,
      on_time_A,
      on_time_B,
      for_winning_A,
      for_winning_B,
      defeated_A,
      defeated_B
    )
      .then(() => {
        fetchData();
        handleClose();
        setLoading(false);
        Swal.fire({
          title: 'OK!',
          text: 'El registro fue editado correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
      })
      .catch((_err) => {
        setLoading(false);
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error, intente nuevamente.',
          icon: 'error',
          confirmButtonColor: '#ba1313'
        });
      });
  };


  const handleEdit = () => {
    setLoading(true);
    const spEdit = editData;
    spEdit()
      .then(() => {
        fetchData();
        handleClose();
        setName('');
        setCode('');
        setPassword('');
        setCedula('');
        setVip(false);
        setByProduct(false);
        setLoading(false);
        setLoading(false);
        Swal.fire({
          title: 'OK!',
          text: 'El registro fue editado correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
      })
      .catch((_err) => {
        setLoading(false);
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error, intente nuevamente.',
          icon: 'error',
          confirmButtonColor: '#ba1313'
        });
      });
  };

  if (internalName === 'provider') {
    return (
      <div>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              backgroundColor: (theme) => theme.palette.primary.main,
              color: 'white'
            }}
          >
            <Typography
              color={'white'}
              variant="h3"
              component="h3"
              gutterBottom
            >
              {title}
            </Typography>

            <Typography color={'white'} variant="subtitle2">
              {subtitle}
            </Typography>
          </DialogTitle>

          <ProviderCreate
            handleClose={handleClose}
            loading={loading}
            handleSave={handleEditProvider}
            editing={true}
            selectedRow={selectedRow}
          />
        </Dialog>
      </div>
    );
  }

  if (internalName === 'branchOffice') {
    return (
      <div>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              backgroundColor: (theme) => theme.palette.primary.main,
              color: 'white'
            }}
          >
            <Typography
              color={'white'}
              variant="h3"
              component="h3"
              gutterBottom
            >
              {title}
            </Typography>

            <Typography color={'white'} variant="subtitle2">
              {subtitle}
            </Typography>
          </DialogTitle>

          <BranchOfficesCreate
            handleClose={handleClose}
            loading={loading}
            handleSave={handleSaveBranchOffices}
            editing={true}
            selectedRow={selectedRow}
          />
        </Dialog>
      </div>
    );
  }

  if (internalName === 'providerzone') {
    return (
      <div>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              backgroundColor: (theme) => theme.palette.primary.main,
              color: 'white'
            }}
          >
            <Typography
              color={'white'}
              variant="h3"
              component="h3"
              gutterBottom
            >
              {title}
            </Typography>

            <Typography color={'white'} variant="subtitle2">
              {subtitle}
            </Typography>
          </DialogTitle>

          <ProviderZoneCreate
            handleClose={handleClose}
            loading={loading}
            handleSave={handleSaveProviderZone}
            editing={true}
            selectedRow={selectedRow}
          />
        </Dialog>
      </div>
    );
  }
  if (internalName === 'officer') {
    return (
      <div>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              backgroundColor: (theme) => theme.palette.primary.main,
              color: 'white'
            }}
          >
            <Typography
              color={'white'}
              variant="h3"
              component="h3"
              gutterBottom
            >
              {title}
            </Typography>

            <Typography color={'white'} variant="subtitle2">
              {subtitle}
            </Typography>
          </DialogTitle>

          <OfficersCreate
            handleClose={handleClose}
            loading={loading}
            handleSave={handleSaveOfficers}
            editing={true}
            selectedRow={selectedRow}
          />
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            backgroundColor: (theme) => theme.palette.primary.main,
            color: 'white'
          }}
        >
          <Typography color={'white'} variant="h3" component="h3" gutterBottom>
            {title}
          </Typography>

          <Typography color={'white'} variant="subtitle2">
            {subtitle}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            my: 2,
            p: 2
          }}
        >
          {internalName === 'otro' ? (
            <>
              <TextField
                margin="dense"
                id="username"
                label="Nombre de usuario"
                type="text"
                fullWidth
                variant="standard"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
              <TextField
                margin="dense"
                id="name"
                label="Nombre"
                type="text"
                fullWidth
                variant="standard"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <TextField
                margin="dense"
                id="password"
                label="Contraseña"
                type="password"
                fullWidth
                variant="standard"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <TextField
                margin="dense"
                id="cedula"
                label="Cédula"
                type="text"
                fullWidth
                variant="standard"
                value={cedula}
                onChange={(e) => {
                  setCedula(e.target.value);
                }}
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
            </>
          ) : (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Nombre"
                type="text"
                fullWidth
                variant="standard"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              {showCode && (
                <TextField
                  margin="dense"
                  label="Código"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                />
              )}
            </>
          )}

          <FormControl
            sx={{
              marginTop: 2
            }}
          >
            <FormLabel>Estatus del registro</FormLabel>
            <RadioGroup value={isDisabled} name="status-radiobutton">
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Habilitado"
                onChange={() => {
                  setIsDisabled(false);
                }}
              />
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Deshabilitado"
                onChange={() => {
                  setIsDisabled(true);
                }}
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={loading && <CircularProgress size="1rem" />}
            onClick={handleEdit}
            disabled={loading}
          >
            Actualizar
          </Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
