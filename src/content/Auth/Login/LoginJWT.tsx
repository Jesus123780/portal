import * as Yup from 'yup';
import { type FC, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import {
  Button,
  FormHelperText,
  TextField,
  CircularProgress
} from '@mui/material';
import { useRefMounted } from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';
import md5 from 'md5';
import { useDispatch, useSelector } from 'src/store';
import { setPermissions, setUserData } from '@/slices/permissionsModules';
import dayjs from 'dayjs';
import menuItems from '@/layouts/AccentHeaderLayout/Sidebar/SidebarMenu/items';
import { bacFetch } from '@/utils/service_config';

export const LoginJWT: FC = (props) => {
  const { t }: { t: any } = useTranslation();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.permissions);
  const isMountedRef = useRefMounted();
  const router = useRouter();

  useEffect(() => {
    const userLogged = localStorage.getItem('userLogged');
    if (user.isAuthenticated || userLogged) {
      router.push('/');
    }
  }, [user, router]);

  const userCredentials = useCallback(async (email, pass) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/AspNetUsersValidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${email}','${pass}'`
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  const userRole = useCallback(async (email) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/SECP_RolModulo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${email}','tz_tdc'`,
        isRaw: true
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  const userPermissionModule = useCallback(async (role) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/SECP_PrivilegiosRolModulo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'tz_tdc','${role}'`,
        isRaw: true
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  const userIsLockedOut = useCallback(async (userId, username) => {
    // TODO: no api
    const res = await bacFetch('/api/connection/GetInfoAspNetUsers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        params: `'${userId}','${username}'`
      })
    });

    const jsonData = await res.json();
    return jsonData;
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      terms: true,
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup.string().max(255).required(t('The user field is required')),
      password: Yup.string()
        .max(255)
        .min(8, t('The minimum length are 8 characters'))
        .required(t('The password field is required')),
      terms: Yup.boolean().oneOf(
        [true],
        t('You must agree to our terms and conditions')
      )
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        const encryptedPaswword = md5(values.password);

        const userData = await userCredentials(values.email, encryptedPaswword);
        if (userData.length > 0) {
          const userId = userData[0].Id;

          const lockedOut = await userIsLockedOut(userId, values.email);
          const lockedOutEndDate = lockedOut[0].LockoutEndDateUtc;
          const date1 = dayjs(lockedOutEndDate);
          const date2 = dayjs();

          const minutes = date1.diff(date2, 'minute');
          if (minutes > 0) {
            setError(true);
            setErrorMessage(
              `Usuario bloqueado por ${minutes} minutos debido a intentos fallidos`
            );
            return;
          }

          const roleResult = await userRole(values.email);
          const role = roleResult[0].CodigoRol;
          const roleId = roleResult[0].roleid;

          const permissions = await userPermissionModule(role);
          dispatch(setPermissions(permissions));
          localStorage.setItem('userPermissions', JSON.stringify(permissions));

          const user = {
            id: userData[0].Id,
            firstName: userData[0].FirstName,
            LastName: userData[0].LastName,
            providerId: userData[0].ProviderId,
            providerName: userData[0].ProviderName,
            userName: values.email,
            roleCode: role,
            roleId,
            qa: userData[0].quality
          };
          dispatch(setUserData(user));
          localStorage.setItem('userLogged', JSON.stringify(user));

          if (isMountedRef()) {
            setError(false);
            const defaultCode = permissions[1].CodigoPrivilegio;
            const defaultPath = menuItems[0].items[0].items.find((value) => {
              return value.code === defaultCode;
            });
            const backTo = defaultPath.link;
            router.push(backTo);
          }
        } else {
          if (isMountedRef()) {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: 'error' });
            helpers.setSubmitting(false);
            setError(true);
            setErrorMessage('Invalid credentials');
          }
        }
      } catch (err) {
        console.error(err);
        if (isMountedRef()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    }
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit} {...props}>
      <TextField
        error={Boolean(formik.touched.email && formik.errors.email)}
        fullWidth
        margin="normal"
        autoFocus
        helperText={formik.touched.email && formik.errors.email}
        label={t('User')}
        name="email"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="text"
        value={formik.values.email}
        variant="outlined"
      />
      <TextField
        error={Boolean(formik.touched.password && formik.errors.password)}
        fullWidth
        margin="normal"
        helperText={formik.touched.password && formik.errors.password}
        label={t('Password')}
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="password"
        value={formik.values.password}
        variant="outlined"
      />

      {error && <FormHelperText error>{t(errorMessage)}</FormHelperText>}

      <Button
        sx={{
          mt: 3
        }}
        color="primary"
        startIcon={
          formik.isSubmitting ? <CircularProgress size="1rem" /> : null
        }
        disabled={formik.isSubmitting}
        type="submit"
        fullWidth
        size="large"
        variant="contained"
      >
        {t('Sign in')}
      </Button>
    </form>
  );
};
