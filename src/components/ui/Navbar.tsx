import NextLink from 'next/link';
import { AppBar, Toolbar, Link, Typography, Box, Button, IconButton, Badge, Input, InputAdornment } from "@mui/material";
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { UiContext, CartContext } from '../../context';

export const Navbar = () => {
  const router = useRouter();
  const { toggleSideMenu } = useContext(UiContext);
  const { cart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (!searchTerm.length) return;
    router.push(`/search/${searchTerm}`);
  }

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display='flex' alignItems='center'>
            <Typography variant='h6'>Teslo-Shop |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        {
          !isSearchVisible &&
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <NextLink href="/category/men" passHref>
              <Link>
                <Button color={router.pathname === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
              </Link>
            </NextLink>

            <NextLink href="/category/women" passHref>
              <Link>
                <Button color={router.pathname === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
              </Link>
            </NextLink>

            <NextLink href="/category/kids" passHref>
              <Link>
                <Button color={router.pathname === '/category/kids' ? 'primary' : 'info'}>Niños</Button>
              </Link>
            </NextLink>
          </Box>
        }

        <Box flex={1} />

        {/* Pantallas Grandes */}
        {
          isSearchVisible ?
            <Input
              className="fadeIn"
              onChange={e => setSearchTerm(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && onSearchTerm()}
              placeholder="Buscar..."
              autoFocus
              type='text'
              value={searchTerm}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setIsSearchVisible(false)}
                  >
                    <ClearOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
            :
            <IconButton
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              className="fadeIn"
              onClick={() => setIsSearchVisible(true)}
            >
              <SearchOutlined />
            </IconButton>
        }

        {/* Pantallas Pequeñas */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href={`${cart?.length ? '/cart' : '/cart/empty'}`} passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={ cart?.length < 10 ? cart?.length : '+9' } color='secondary'>
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button
          onClick={toggleSideMenu}
        >
          Menú
        </Button>
      </Toolbar>
    </AppBar>
  )
};
