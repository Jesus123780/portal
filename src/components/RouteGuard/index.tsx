import { useRouter } from 'next/router';
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState
} from 'react';
import { useDispatch, useSelector } from '@/store';
import Loader from '../Loader';
import { setPermissions, setUserData } from '@/slices/permissionsModules';

const RouteGuard = (props: {
  children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
}) => {
  const { children } = props;

  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const { user } = useSelector((state) => state.permissions);

  const dispatch = useDispatch();

  useEffect(() => {
    const authCheck = () => {
      if (!user.isAuthenticated && router.pathname !== '/login') {
        const userLogged = localStorage.getItem('userLogged');
        const userPermissions = localStorage.getItem('userPermissions');

        if (!userLogged || !userPermissions) {
          setAuthorized(false);
          void router.push({
            pathname: '/login'
          });
        } else {
          dispatch(setUserData(JSON.parse(userLogged)));
          dispatch(setPermissions(JSON.parse(userPermissions)));
        }
      } else {
        setAuthorized(true);
      }
    };

    authCheck();

    const preventAccess = () => setAuthorized(false);

    router.events.on('routeChangeStart', preventAccess);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeStart', preventAccess);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [dispatch, router, router.events, user]);

  return authorized ? children : <Loader />;
};

export default RouteGuard;
