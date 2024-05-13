import type { ReactNode } from 'react';

import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import { Article, Payment } from '@mui/icons-material';
import {
  ACTIVATOR_MENU_CODE,
  ASSIGNMENT_MENU_CODE,
  // COMISSIONS_GENERAL_MENU_CODE,
  // COMISSIONS_PROVIDER_2_MENU_CODE,
  // COMISSIONS_PROVIDER_MENU_CODE,
  // COMISSION_GROUP_MENU_CODE,
  CONSULT_MENU_CODE,
  DASHBOARD_MENU_CODE,
  IMPORT_DATA_MENU_CODE,
  MASTERS_CALENDAR_MENU_CODE,
  MASTERS_DOCUMENTS_MENU_CODE,
  MASTERS_ERRORS_MENU_CODE,
  MASTERS_MENU_CODE,
  MASTERS_OFFICERS_MENU_CODE,
  MASTERS_PROCEDURES_MENU_CODE,
  MASTERS_PRODUCTS_MENU_CODE,
  MASTERS_PROVIDERS_MENU_CODE,
  MASTERS_PROVIDERS_ZONE_MENU_CODE,
  MASTERS_RETURNS_MENU_CODE,
  MASTERS_BRANCHOFFICES_MENU_CODE,
  //OFFICERS_ASSIGNMENT_MENU_CODE,
  PERIOD_TIME_MENU_CODE,
  PROVIDERS_MENU_CODE,
  QA_MENU_CODE,
  REPORTS_GENERAL_MENU_CODE,
  REPORTS_MENU_CODE,
  SUPERVISORS_MENU_CODE,
  INVENTORY_MENU_CODE,
  IMPORT_INVENTORY_MENU_CODE,
} from '@/utils/permissions';

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  badgeTooltip?: string;

  items?: MenuItem[];
  name: string;
  code?: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: '',
    items: [
      {
        name: 'Dashboard',
        icon: BackupTableTwoToneIcon,
        code: DASHBOARD_MENU_CODE,
        items: [
          {
            name: 'Supervisors',
            link: '/supervisors',
            code: SUPERVISORS_MENU_CODE
          },
          {
            name: 'Activator',
            link: '/activation',
            code: ACTIVATOR_MENU_CODE
          },
          {
            name: 'Consult',
            link: '/consult',
            code: CONSULT_MENU_CODE
          },
          {
            name: 'Import Data',
            link: '/importdata',
            code: IMPORT_DATA_MENU_CODE
          },
          {
            name: 'Provider',
            link: '/providers',
            code: PROVIDERS_MENU_CODE
          },
          {
            name: 'QA',
            link: '/qa',
            code: QA_MENU_CODE
          },
          {
            name: 'Importar Inventario',
            link: '/import-inventory',
            code: IMPORT_INVENTORY_MENU_CODE
          },
          {
            name: 'Dashboard Inventario',
            link: '/inventory',
            code: INVENTORY_MENU_CODE
          },
        ]
      },
      {
        name: 'Reports',
        icon: Article,
        code: REPORTS_GENERAL_MENU_CODE,
        items: [
          {
            name: 'List of reports',
            link: '/reportlist',
            code: REPORTS_MENU_CODE
          }
        ]
      },
      {
        name: 'Masters',
        icon: BackupTableTwoToneIcon,
        code: MASTERS_MENU_CODE,
        items: [
          {
            name: 'Returns',
            link: '/masters/returns',
            code: MASTERS_RETURNS_MENU_CODE
          },
          {
            name: 'Documents',
            link: '/masters/documents',
            code: MASTERS_DOCUMENTS_MENU_CODE
          },
          {
            name: 'Errors',
            link: '/masters/errors',
            code: MASTERS_ERRORS_MENU_CODE
          },
          {
            name: 'Authentication Security',
            link: '/masters/officers',
            code: MASTERS_OFFICERS_MENU_CODE
          },
          {
            name: 'Products',
            link: '/masters/products',
            code: MASTERS_PRODUCTS_MENU_CODE
          },
          {
            name: 'Formalities',
            link: '/masters/procedures',
            code: MASTERS_PROCEDURES_MENU_CODE
          },
          {
            name: 'Provider',
            link: '/masters/provider',
            code: MASTERS_PROVIDERS_MENU_CODE
          },
          {
            name: 'Provider zones',
            link: '/masters/providerzones',
            code: MASTERS_PROVIDERS_ZONE_MENU_CODE
          },
          {
            name: 'Calendar',
            link: '/masters/calendar',
            code: MASTERS_CALENDAR_MENU_CODE
          },
          {
            name: 'BranchOffice',
            link: '/masters/branchOffices',
            code: MASTERS_BRANCHOFFICES_MENU_CODE
          }
        ]
      },
      {
        name: 'Comission',
        icon: Payment,
        code: ASSIGNMENT_MENU_CODE,
        items: [
          {
            name: 'Period of time',
            link: PERIOD_TIME_MENU_CODE
          }//,
          // {
          //   name: 'Comission group',
          //   link: COMISSION_GROUP_MENU_CODE
          // },
          // {
          //   name: 'Formalizers assignment',
          //   link: OFFICERS_ASSIGNMENT_MENU_CODE
          // },
          // {
          //   name: 'Period of time',
          //   link: PERIOD_TIME_MENU_CODE
          // },
          // {
          //   name: 'Comission Provider',
          //   link: COMISSIONS_PROVIDER_MENU_CODE
          // }
        ]
      }//,
      // {
      //   name: 'Comission Provider',
      //   icon: BackupTableTwoToneIcon,
      //   code: COMISSIONS_GENERAL_MENU_CODE,
      //   items: [
      //     {
      //       name: 'Comission Provider',
      //       link: COMISSIONS_PROVIDER_2_MENU_CODE
      //     }
      //   ]
      // }
    ]
  }
];
export default menuItems;
