import NextLink from 'next/link';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Box, Grid, Typography, TextField, Button, Link } from '@mui/material';

const RegisterPage = () => {
  return (
    <AuthLayout title='Ingresar'>
      <Box sx={{ width: 350, padding: '10px 20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h1' component='h1'>Registrate</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField label="Nombre" variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12}>
            <TextField label="Correo" type="email" variant='filled' fullWidth />
          </Grid>

          <Grid item xs={12}>
            <TextField label="Contraseña" type="password" variant="filled" fullWidth />
          </Grid>

          <Grid item xs={12}>
            <TextField label="Confirmar Contraseña" type="password" variant="filled" fullWidth />
          </Grid>

          <Grid item xs={12}>
            <Button color="secondary" className="circular-btn" size='large' fullWidth>
              Ingresar
            </Button>
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <NextLink href="/auth/login" passHref>
              <Link underline="always">¿Ya tienes Cuenta?</Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  )
}

export default RegisterPage;