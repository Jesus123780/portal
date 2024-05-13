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
import md5 from 'md5';

export default function FormDialog({
  open,
  handleClose,
  title,
  subtitle,
  spCreate,
  user,
  fetchData,
  showCode,
  internalName
}) {
  const [name, setName] = React.useState('');
  const [code, setCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [cedula, setCedula] = React.useState('');
  const [vip, setVip] = React.useState(false);
  const [byProduct, setByProduct] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const createData = async () => {
    const params = showCode
      ? `null , '${name}', '${code}' , '${user}', 0`
      : `null , '${name}' , '${user}', 0`;
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

  const createBranchOffice = async (
    name: any,
  ) => {
    const params = `null, '${name}',1`;
    
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

  const createOfficer = async (
    code: any,
    name: any,
    password: any,
    vip: any,
    byProduct: any,
    cedula: any
  ) => {
    const params = `@officer_id=null, @officer_code='${code}', @officer_name='${name}', @password='${password}',@vip =${vip ? 1 : 0} , @create_by ='${user}', @disable =0,@assign_product=${byProduct ? 1 : 0}, @id=null, @cedula='${cedula}'`;
    
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

  const createProviderZone = async (
    providerid,
    code,
    on_time_A,
    on_time_B,
    for_winning_A,
    for_winning_B,
    defeated_A,
    defeated_B
  ) => {
    const params = `@provider_id=${providerid} , @code='${code}' , @on_time_A=${on_time_A} ,@on_time_B =${on_time_B} , @for_winning_A =${for_winning_A} ,@Defeated_A =${defeated_A} ,@for_winning_B=${for_winning_B} ,@Defeated_B=${defeated_B}`;

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

  const createProvider = async (
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
  ) => {
    const params = `@FirstName = '${firstName}', @LastName  = '${lastName}', @Email  = '${email}', @EmailConfirmed = true , @PasswordHash  = '${md5(
      password
    )}', @SecurityStamp  = NULL, @PhoneNumber  = NULL, @PhoneNumberConfirmed = false , @TwoFactorEnabled = false, @LockoutEndDateUtc = NULL, @LockoutEnabled = false , @AccessFailedCount =0 , @UserName ='${userName}' , @ExpirationDay =30 ,@address  ='${address}',@address2 ='${address2}',@quality = ${qa}  ,@phone ='${phone}',@fax ='${fax}',@create_by ='${user}' ,@i_providerId = 0`;

    const res = await fetch('/api/connection/AspNetUsersProviderInsertNew', {
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

  const handleSaveProvider = (
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
  ) => {
    setLoading(true);
    createProvider(
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
    )
      .then(() => {
        fetchData();
        handleClose();
        setLoading(false);
        Swal.fire({
          title: 'OK!',
          text: 'El registro fue creado correctamente.',
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

  const handleSaveProviderZone = (
    providerid,
    code,
    on_time_A,
    on_time_B,
    for_winning_A,
    for_winning_B,
    defeated_A,
    defeated_B
  ) => {
    setLoading(true);
    createProviderZone(
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
          text: 'El registro fue creado correctamente.',
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
  const handleSaveOfficers = (
    code: any,
    name: any,
    password: any,
    vip: any,
    byProduct: any,
    cedula: any
  ) => {
    setLoading(true);
    createOfficer(
      code,
      name,
      password,
      vip,
      byProduct,
      cedula
    )
      .then(() => {
        fetchData();
        handleClose();
        setLoading(false);
        Swal.fire({
          title: 'OK!',
          text: 'El registro fue creado correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
      })
      .catch((_err) => {
        setLoading(false);
        Swal.fire({
          title: 'Error',
          text: _err,//'Ha ocurrido un error, intente nuevamente.',
          icon: 'error',
          confirmButtonColor: '#ba1313'
        });
      });
  };

  const handleSaveBranch = (
    name: any,
  ) => {
    setLoading(true);
    createBranchOffice(
      name,
    )
      .then(() => {
        fetchData();
        handleClose();
        setLoading(false);
        Swal.fire({
          title: 'OK!',
          text: 'El registro fue creado correctamente.',
          icon: 'success',
          confirmButtonColor: '#ba1313'
        });
      })
      .catch((_err) => {
        setLoading(false);
        Swal.fire({
          title: 'Error',
          text: _err,//'Ha ocurrido un error, intente nuevamente.',
          icon: 'error',
          confirmButtonColor: '#ba1313'
        });
      });
  };

  const handleSave = () => {
    setLoading(true);
    //const spCreate = internalName === 'officer' ? createOfficer : createData;
    const spCreate =  createData;
    spCreate()
      .then(() => {
        fetchData();
        handleClose();
        setName('');
        setCode('');
        setPassword('');
        setVip(false);
        setByProduct(false);
        setLoading(false);
        setCedula('');
        Swal.fire({
          title: 'OK!',
          text: 'El registro fue creado correctamente.',
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
            handleSave={handleSaveProvider}
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
            handleSave={handleSaveBranch}
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
                autoFocus
                margin="dense"
                id="name"
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
                id="name"
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
                required={true}
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
            </>
          ) : (
            <>
              <TextField
                autoFocus
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
              {showCode && (
                <TextField
                  margin="dense"
                  id="code"
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
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={loading && <CircularProgress size="1rem" />}
            onClick={handleSave}
            disabled={loading}
          >
            Guardar
          </Button>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
