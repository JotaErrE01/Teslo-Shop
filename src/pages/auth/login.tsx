import { useState, useContext } from 'react';
import NextLink from 'next/link';
import { ErrorOutline } from '@mui/icons-material';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Box, Grid, Typography, TextField, Button, Link, Chip } from '@mui/material';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';

interface FormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { loginUser } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);
    const isValidLogin = await loginUser(email, password);
    if (isValidLogin) return router.replace(router.query.p?.toString() || '/');

    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  }

  return (
    <AuthLayout title='Ingresar'>
      <form
        noValidate
        onSubmit={handleSubmit(onLoginUser)}
      >
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
              <Chip
                label='No reconocemos el usuario / contraseña?'
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Correo"
                type="email"
                variant='filled'
                fullWidth
                {...register('email', { required: 'Este campo es requerido', validate: validations.isEmail })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register('password', { required: 'Este campo es requerido', minLength: { value: 6, message: 'Este campo debe tener minimo 6 caracteres' } })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" color="secondary" className="circular-btn" size='large' fullWidth>
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <NextLink href={`/auth/register?p=${router.query.p || '/'}`} passHref>
                <Link underline="always">¿No tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export default LoginPage