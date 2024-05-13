import { FC, ReactNode, useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@mui/material';

import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarContext } from '@/contexts/SidebarContext';

interface AccentHeaderLayoutProps {
  children?: ReactNode;
}

const AccentHeaderLayout: FC<AccentHeaderLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const { sidebarToggle } = useContext(SidebarContext);

  return (
    <>
      <Header />
      <Sidebar />
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          display: 'flex',
          pt: `${theme.header.height}`,

          [theme.breakpoints.up('lg')]: {
            pl: sidebarToggle ? `${theme.sidebar.width}` : ''
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <Box flexGrow={1}>{children}</Box>
        </Box>
      </Box>
    </>
  );
};

AccentHeaderLayout.propTypes = {
  children: PropTypes.node
};

export default AccentHeaderLayout;
