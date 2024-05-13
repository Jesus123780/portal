import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  useTheme
} from '@mui/material';
import { useTranslation } from 'next-i18next';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white'
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 0,
            color: 'white'
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function DetailDialog({
  open,
  handleClose,
  LoadRecord,
  view = false,
  error = "",
}) {
  const [hasError, setHasError] = React.useState(false);
  const [records, setRecords] = React.useState([]);
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();

  React.useEffect(() => {
    if (!LoadRecord) return;
    
    if (LoadRecord.length > 0) {
      const errorRecord = LoadRecord.filter((record) => {
        return record.Error === true;
      });

      if (errorRecord.length > 0) {
        setHasError(true);
        setRecords(errorRecord);
      } else {
        setHasError(false);
        setRecords(LoadRecord);
      }
    }
  }, [LoadRecord]);

  React.useEffect(() => {
    setHasError(true);
    setRecords([]);
  }, [error])

  const onClose = () => {
    handleClose();
  };

  return (
    <div>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xl"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          <Box display="flex" alignItems="center">
            <Box>
              <Typography
                color={'white'}
                variant="h3"
                component="h3"
                gutterBottom
              >
                {t('Detalles de la carga')}
              </Typography>
              {view && (
                <Typography color={'white'} variant="subtitle2" gutterBottom>
                  {`${t('Cantidad de registros:')} ${records.length}`}
                </Typography>
              )}
            </Box>
          </Box>
        </BootstrapDialogTitle>
        <Box sx={{ p: 2 }}>
          {view ? null : (
            <>
              {hasError ? (
                <Alert severity="error">
                  <AlertTitle>
                    <strong>Registros con errores</strong>
                  </AlertTitle>
                  Esta carga de datos no puede ser procesada.
                </Alert>
              ) : (
                <Alert severity="success">
                  <AlertTitle>
                    <strong>Registros cargados exitosamente</strong>
                  </AlertTitle>
                  Esta carga de datos puede ser procesada.
                </Alert>
              )}{' '}
            </>
          )}
          <TableContainer
            style={{
              height: '600px',
              overflow: 'scroll',
              marginTop: '10px'
            }}
          >
            <Table aria-label="simple table">
              <TableHead color={'white'}>
                <TableRow>
                <TableCell align="center">Custodia</TableCell>
                <TableCell align="center">Estatus</TableCell>
                  <TableCell align="center">Tarjeta</TableCell>
                  <TableCell align="center">CIF</TableCell>
                  <TableCell align="center">Nombre Titular</TableCell>
                  <TableCell align="center">Nombre Fiador</TableCell>
                  <TableCell align="center">Nombre Adicional</TableCell>
                  <TableCell align="center">Tramite</TableCell>
                  <TableCell align="center">Producto</TableCell>
                  <TableCell align="center">Telefono de Oficina</TableCell>
                  <TableCell align="center">Telefono Casa</TableCell>
                  <TableCell align="center">Celular</TableCell>
                  <TableCell align="center">Tel BAC Casa</TableCell>
                  <TableCell align="center">Direccion Casa</TableCell>
                  <TableCell align="center">Direccion Trabajo</TableCell>
                  <TableCell align="center">Observaciones</TableCell>
                  <TableCell align="center">Comentarios Actividad de Datos</TableCell>
                  <TableCell align="center">Descripción Actividad de Datos</TableCell>
                  <TableCell align="center">Dirección BAC</TableCell>
                  <TableCell align="center">Observación</TableCell>
                  <TableCell align="center">Mail</TableCell>
                  {hasError ? (
                    <TableCell align="center">Error</TableCell>
                  ) : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((row, index) => {
                  return (
                    <TableRow
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                      key={index}
                      selected={hasError}
                    >
                      <TableCell align="center">{row.custody}</TableCell>
                      <TableCell align="center">{row.inventory_status}</TableCell>
                      <TableCell align="center">{row.card_number}</TableCell>
                      <TableCell align="center">{row.cif}</TableCell>
                      <TableCell align="center">{row.owner_name}</TableCell>
                      <TableCell align="center">{row.guarantor_name}</TableCell>
                      <TableCell align="center">{row.additional_name}</TableCell>
                      <TableCell align="center">{row.procedure_type}</TableCell>
                      <TableCell align="center">{row.product_name}</TableCell>
                      <TableCell align="center">{row.office_phone}</TableCell>
                      <TableCell align="center">{row.home_phone}</TableCell>
                      <TableCell align="center">{row.mobile_phone}</TableCell>
                      <TableCell align="center">{row.BAC_home_phone}</TableCell>
                      <TableCell align="center">{row.home_address}</TableCell>
                      <TableCell align="center">{row.work_address}</TableCell>
                      <TableCell align="center">{row.observations}</TableCell>
                      <TableCell align="center">{row.info_activity_comments}</TableCell>
                      <TableCell align="center">{row.info_activity_description}</TableCell>
                      <TableCell align="center">{row.BAC_address}</TableCell>
                      <TableCell align="center">{row.optional_observations}</TableCell>
                      <TableCell align="center">{row.mail}</TableCell>
                      {hasError ? (
                        <TableCell
                          style={{
                            backgroundColor: theme.colors.primary.main,
                            color: 'white'
                          }}
                          align="center"
                        >
                          {row.Description_Error}
                        </TableCell>
                      ) : null}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </BootstrapDialog>
    </div>
  );
}
