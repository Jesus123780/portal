import { useRef, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
  styled
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { Settings } from '@mui/icons-material';
import { useDispatch, useSelector } from '@/store';
import { setLogOut } from '@/slices/permissionsModules';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(0)};
        color: ${theme.colors.alpha.trueWhite[70]};

        &:hover {
          color: ${theme.colors.alpha.trueWhite[100]};
        }
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${theme.palette.secondary.light}
`
);

function HeaderUserbox() {
  const { t }: { t: any } = useTranslation();

  const dispatch = useDispatch();
  const { user: User } = useSelector((state) => state.permissions);

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userLogged');
    localStorage.removeItem('userPermissions');
    dispatch(setLogOut());
  };

  const user = {
    avatar: '',
    name: `${User.firstName} ${User.LastName}`,
    jobtitle: User.userName
  };

  return (
    <Box
      component="span"
      sx={{
        display: { xs: 'none', sm: 'inline-block' }
      }}
    >
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar alt={user.name} src={user.avatar} />
        <ExpandMoreTwoToneIcon
          fontSize="small"
          sx={{
            ml: 0.5
          }}
        />
      </UserBoxButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox
          sx={{
            minWidth: 210
          }}
          display="flex"
        >
          <Avatar variant="rounded" alt={user.name} src={user.avatar} />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {user.jobtitle}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider
          sx={{
            mb: 0
          }}
        />
        <List
          sx={{
            p: 1
          }}
          component="nav"
        >
          <ListItem
            button
            onClick={() => {
              handleClose();
            }}
          >
            <Settings fontSize="small" />
            <ListItemText primary={t('Settings')} />
          </ListItem>
        </List>
        <Divider />
        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon
              sx={{
                mr: 1
              }}
            />
            {t('Sign out')}
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}

export default HeaderUserbox;
