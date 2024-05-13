import * as React from 'react';
import { alpha, lighten, styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import BasicTabs from './Tabs';
import { Avatar, Box, DialogContent, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Notes } from '@mui/icons-material';
import TabsInventory from './TabsInventory';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(0)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(0)
  }
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const AvatarPageTitle = styled(Avatar)(
  ({ theme }) => `
      width: ${theme.spacing(8)};
      height: ${theme.spacing(6)};
      color: ${theme.colors.primary.main};
      margin-right: ${theme.spacing(2)};
      background: ${
        theme.palette.mode === 'dark'
          ? theme.colors.alpha.trueWhite[10]
          : theme.colors.alpha.white[50]
      };
      box-shadow: ${
        theme.palette.mode === 'dark'
          ? '0 1px 0 ' +
            alpha(lighten(theme.colors.primary.main, 0.8), 0.2) +
            ', 0px 2px 4px -3px rgba(0, 0, 0, 0.3), 0px 5px 16px -4px rgba(0, 0, 0, .5)'
          : '0px 2px 4px -3px ' +
            alpha(theme.colors.alpha.black[100], 0.4) +
            ', 0px 5px 16px -4px ' +
            alpha(theme.colors.alpha.black[100], 0.2)
      };
`
);

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
            top: 8,
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
  deliveryId,
  fetchData,
  roleCurrent,
  editEnabled = true,
  isInventory = false,
}) {
  const { t }: { t: any } = useTranslation();
  const [name, setName] = React.useState('');
  const [CIF, setCIF] = React.useState('');
  const [id, setId] = React.useState('');

  const setHeaderValues = (name, cif, id) => {
    setName(name);
    setCIF(cif);
    setId(id);
  };

  const onClose = () => {
    setName('');
    setCIF('');
    setId('');
    handleClose();
  };

  return (
    <div>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="xl"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={onClose}
        >
          <Box
            display="flex"
            alignItems={{ xs: 'stretch', md: 'center' }}
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <AvatarPageTitle variant="rounded">
                <Notes fontSize="large" />
              </AvatarPageTitle>
              <Box>
                <Typography
                  color={'white'}
                  variant="h3"
                  component="h3"
                  gutterBottom
                >
                  {t('Detalles del registro')}
                </Typography>
                <Typography color={'white'} variant="subtitle2">
                  {id !== '' && `#${id} | Cliente: ${name} | CIF: ${CIF}`}
                </Typography>
              </Box>
            </Box>
          </Box>
        </BootstrapDialogTitle>
        <DialogContent>
          {!isInventory ? (
            <BasicTabs
              deliveryId={deliveryId}
              handleClose={onClose}
              fetchData={fetchData}
              setHeaderValues={setHeaderValues}
              roleCurrent={roleCurrent}
              editEnabled={editEnabled}
            />
          ) : (
            <TabsInventory
              inventoryId={deliveryId}
              handleClose={onClose}
              fetchData={fetchData}
              setHeaderValues={setHeaderValues}
              editEnabled={editEnabled}
            />
          )}
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
