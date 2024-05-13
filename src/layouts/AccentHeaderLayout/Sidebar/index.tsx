import { useContext } from 'react';
import Scrollbar from 'src/components/Scrollbar';
import { SidebarContext } from 'src/contexts/SidebarContext';

import { Box, styled } from '@mui/material';

import SidebarMenu from './SidebarMenu';
import SidebarTopSection from './SidebarTopSection';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.sidebar.textColor};
        background: ${theme.sidebar.background};
        box-shadow: ${theme.sidebar.boxShadow};
        position: relative;
        z-index: 7;
        height: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          height: calc(100% - ${theme.header.height});
          margin-top: ${theme.header.height};
        }
`
);

const TopSection = styled(Box)(
  ({ theme }) => `
        margin: ${theme.spacing(2)};
`
);

function Sidebar() {
  const { sidebarToggle } = useContext(SidebarContext);
  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: 'none',
            lg: sidebarToggle ? 'inline-block' : 'none',
            xl: sidebarToggle ? 'inline-block' : 'none'
          },
          position: 'fixed',
          left: 0,
          top: 0
        }}
      >
        <Scrollbar>
          <TopSection>
            <SidebarTopSection />
          </TopSection>
          <SidebarMenu />
        </Scrollbar>
      </SidebarWrapper>
    </>
  );
}

export default Sidebar;
