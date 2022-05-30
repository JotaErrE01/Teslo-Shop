import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext, UiContext } from "../../context";
import { useRouter } from 'next/router';

export const SideMenu = () => {
  const router = useRouter();
  const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
  const { user, logout } = useContext(AuthContext);
  const inputRef = useRef<any>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const onSearchTerm = () => {
    if (!searchTerm.length) return;
    navigateTo(`/search/${searchTerm}`);
  }

  const navigateTo = (url: string) => {
    toggleSideMenu();
    router.push(url);
  }

  useEffect(() => {
    if (!isMenuOpen) return;
    setTimeout(() => {
      inputRef.current.querySelector('input').focus();
    }, 100);

  }, [isMenuOpen]);

  return (
    <Drawer
      open={isMenuOpen}
      onClose={toggleSideMenu}
      anchor='right'
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              onChange={e => setSearchTerm(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && onSearchTerm()}
              placeholder="Buscar..."
              autoFocus
              type='text'
              value={searchTerm}
              ref={inputRef}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                  >
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          {
            !user ? (
              <ListItem
                button
                onClick={() => navigateTo(`/auth/login?p=${ router.asPath }`)}
              >
                <ListItemIcon>
                  <VpnKeyOutlined />
                </ListItemIcon>
                <ListItemText primary={'Ingresar'} />
              </ListItem>
            )
              : (
                <>
                  <ListItem
                    button
                    onClick={() => navigateTo('/')}
                  >
                    <ListItemIcon>
                      <AccountCircleOutlined />
                    </ListItemIcon>
                    <ListItemText primary={'Perfil'} />
                  </ListItem>

                  <ListItem
                    button
                    onClick={() => navigateTo('/')}
                  >
                    <ListItemIcon>
                      <ConfirmationNumberOutlined />
                    </ListItemIcon>
                    <ListItemText primary={'Mis Ordenes'} />
                  </ListItem>

                  <ListItem
                    button
                    onClick={logout}
                  >
                    <ListItemIcon>
                      <LoginOutlined />
                    </ListItemIcon>
                    <ListItemText primary={'Salir'} />
                  </ListItem>

                  {
                    user?.role === 'admin' && (
                      <>
                        {/* Admin */}
                        <Divider />
                        <ListSubheader>Admin Panel</ListSubheader>

                        <ListItem
                          button
                          onClick={() => navigateTo('/')}
                        >
                          <ListItemIcon>
                            <CategoryOutlined />
                          </ListItemIcon>
                          <ListItemText primary={'Productos'} />
                        </ListItem>
                        <ListItem
                          button
                          onClick={() => navigateTo('/')}
                        >
                          <ListItemIcon>
                            <ConfirmationNumberOutlined />
                          </ListItemIcon>
                          <ListItemText primary={'Ordenes'} />
                        </ListItem>

                        <ListItem
                          button
                          onClick={() => navigateTo('/')}
                        >
                          <ListItemIcon>
                            <AdminPanelSettings />
                          </ListItemIcon>
                          <ListItemText primary={'Usuarios'} />
                        </ListItem>
                      </>
                    )
                  }
                </>
              )
          }

          <ListItem
            button
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/men')}
          >
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Hombres'} />
          </ListItem>

          <ListItem
            button
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/women')}
          >
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Mujeres'} />
          </ListItem>

          <ListItem
            button
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/kids')}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={'Niños'} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}