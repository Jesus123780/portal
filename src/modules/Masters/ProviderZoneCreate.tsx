import { bacFetch } from '@/utils/service_config';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

const ProviderZoneCreate = ({
  handleClose,
  handleSave,
  loading,
  editing = false,
  selectedRow = {}
}) => {
  const [listProviders, setdatalistProviders] = React.useState([]);
  const [providerSelected, setproviderselected] = React.useState('0');
  const [id, setId] = useState('');
  const [code, setCode] = useState('');
  const [on_time_A, seton_time_A] = useState('');
  const [on_time_B, seton_time_B] = useState('');
  const [for_winning_A, setfor_winning_A] = useState('');
  const [for_winning_B, setfor_winning_B] = useState('');
  const [defeated_A, setdefeated_A] = useState('');
  const [defeated_B, setdefeated_B] = useState('');

  useEffect(() => {
    if (editing) {
      setId(selectedRow['id']);
      setCode(selectedRow['code']);
      seton_time_A(selectedRow['on_time_A']);
      seton_time_B(selectedRow['on_time_B']);
      setfor_winning_A(selectedRow['for_winning_A']);
      setfor_winning_B(selectedRow['for_winning_B']);
      setdefeated_A(selectedRow['Defeated_A']);
      setdefeated_B(selectedRow['Defeated_B']);
      setproviderselected(selectedRow['provider_id']);
    }
  }, [editing, selectedRow]);

  const getProviders = useCallback(async () => {
    const res = await bacFetch('/api/connection/GetMSTProviders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: ``
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  useEffect(() => {
    getProviders()
      .then((res) => {
        const providers = res.filter((prov) => {
          return Number(prov.text) > 0;
        });
        setdatalistProviders(providers);
        setproviderselected(providers[0].text);
      })
      .catch(() => {
        setdatalistProviders([]);
      });
  }, [getProviders]);

  const handleChangeSelectProv = (event) => {
    setproviderselected(event.target.value);
  };

  const save = () => {
    if (editing) {
      handleSave(
        id,
        providerSelected,
        code,
        on_time_A,
        on_time_B,
        for_winning_A,
        for_winning_B,
        defeated_A,
        defeated_B
      );
    } else {
      handleSave(
        providerSelected,
        code,
        on_time_A,
        on_time_B,
        for_winning_A,
        for_winning_B,
        defeated_A,
        defeated_B
      );
      setCode('');
      seton_time_A('');
      seton_time_B('');
      setfor_winning_A('');
      setfor_winning_B('');
      setdefeated_A('');
      setdefeated_B('');
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
        <FormControl style={{ marginTop: 20 }} fullWidth>
          {listProviders.length === 0 ? (
            <Skeleton height={40} />
          ) : (
            <>
              <InputLabel>Proveedor</InputLabel>
              <Select
                label="Proveedor"
                value={providerSelected}
                onChange={handleChangeSelectProv}
                disabled={editing}
                fullWidth
              >
                {listProviders.map((_row, index) => {
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
            </>
          )}
        </FormControl>
        <TextField
          margin="dense"
          label="Código de la zona"
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
          label="A tiempo (días)"
          type="text"
          fullWidth
          variant="standard"
          value={on_time_A}
          onChange={(e) => {
            seton_time_A(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          label="Por vencer (días)"
          type="text"
          fullWidth
          variant="standard"
          value={for_winning_A}
          onChange={(e) => {
            setfor_winning_A(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          label="Vencidos (días)"
          type="text"
          fullWidth
          variant="standard"
          value={defeated_A}
          onChange={(e) => {
            setdefeated_A(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          label="A tiempo (minutos)"
          type="text"
          fullWidth
          variant="standard"
          value={on_time_B}
          onChange={(e) => {
            seton_time_B(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          label="Por vencer (minutos)"
          type="text"
          fullWidth
          variant="standard"
          value={for_winning_B}
          onChange={(e) => {
            setfor_winning_B(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          label="Vencidos (minutos)"
          type="text"
          fullWidth
          variant="standard"
          value={defeated_B}
          onChange={(e) => {
            setdefeated_B(e.target.value);
          }}
        />
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

export default ProviderZoneCreate;
