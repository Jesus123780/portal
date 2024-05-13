import { useContext } from 'react';

import { Box, Card, IconButton, Tooltip, alpha, styled } from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { SidebarContext } from 'src/contexts/SidebarContext';
import HeaderUserbox from './Userbox';
import Image from 'next/image';
import Logo from 'public/BAC_H_Blanco.png'
import Link from 'next/link';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
    height: ${theme.header.height};
    color: ${theme.header.textColor};
    padding: ${theme.spacing(0, 2)};
    right: 0;
    z-index: 6;
    background-color: ${alpha(theme.colors.primary.main, 0.95)};
    backdrop-filter: blur(3px);
    position: fixed;
    justify-content: space-between;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 0;
`
);

const IconButtonPrimary = styled(IconButton)(
  ({ theme }) => `
    background: ${theme.colors.alpha.trueWhite[10]};
    color: ${theme.colors.alpha.trueWhite[70]};
    padding: 0;
    width: 42px;
    height: 42px;
    border-radius: 100%;
    margin-left: ${theme.spacing(2)};

    &.active,
    &:active,
    &:hover {
      background: ${alpha(theme.colors.alpha.trueWhite[30], 0.2)};
      color: ${theme.colors.alpha.trueWhite[100]};
    }
`
);

const BoxLogoWrapper = styled(Box)(
  ({ theme }) => `
  margin-right: ${theme.spacing(2)};

  img {
    max-height: 42px !important;
    width: 100% !important;
    max-width: 100% !important;
    &:hover {
      cursor: pointer;
    }
  }

  @media (min-width: ${theme.breakpoints.values.lg}px) {
    width: calc(${theme.sidebar.width} - ${theme.spacing(4)});
  }
    
`
);

function Header() {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <HeaderWrapper>
      <Box display="flex" alignItems="center">
        <BoxLogoWrapper>
          <Link href="/">
            <Image src={Logo} alt="logo BAC" />
          </Link>
        </BoxLogoWrapper>
      </Box>
      <Box display="flex" alignItems="center">
        <HeaderUserbox />
        <Box
          component="span"
          sx={{
            display: 'inline-block'
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButtonPrimary color="primary" onClick={toggleSidebar}>
              <MenuTwoToneIcon />
            </IconButtonPrimary>
          </Tooltip>
        </Box>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
