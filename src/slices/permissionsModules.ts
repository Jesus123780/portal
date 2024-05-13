import { createSlice } from '@reduxjs/toolkit';

interface PermissionModule {
  CodigoPrivilegio: string;
  Nombre: string;
}

interface User {
  id: string;
  firstName: string;
  LastName: string;
  providerId: string;
  providerName: string;
  userName: string;
  roleCode: string;
  isAuthenticated: boolean;
  roleId: string;
  qa: boolean;
}

interface PermissionModuleState {
  user: User;
  permissions: PermissionModule[];
}

const initialState = {
  user: {
    id: '',
    firstName: '',
    LastName: '',
    providerId: '',
    providerName: '',
    userName: '',
    roleCode: '',
    isAuthenticated: false,
    roleId: '',
    qa: false
  },
  permissions: []
} as PermissionModuleState;

const permissionsModuleSlice = createSlice({
  name: 'permissionsModules',
  initialState,
  reducers: {
    setPermissions(state, action) {
      state.permissions = action.payload;
    },
    setUserData(state, action) {
      state.user = { isAuthenticated: true, ...action.payload };
    },
    setLogOut(state) {
      state.user = {
        ...state.user,
        isAuthenticated: false
      };
    }
  }
});

export const { setPermissions, setUserData, setLogOut } =
  permissionsModuleSlice.actions;
export const { reducer } = permissionsModuleSlice;
export default permissionsModuleSlice;
