import NextLink from 'next/link';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Box, Grid, Typography, TextField, Button, Link, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { tesloApi } from '../../api';
import { validations } from '../../utils';
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>();

  const onRegisterForm = async ({ confirmPassword, ...rest }: FormData) => {
    setShowError(false);
    const { hasError, message } = await registerUser(rest.email, rest.password, rest.name);

    if (!hasError) return router.replace(`${router.query.p || '/'}`);

    setShowError(true);
    setErrorMessage(message!);
    setTimeout(() => setShowError(false), 3000);
  }

  return (
    <AuthLayout title='Ingresar'>
      <form
        onSubmit={handleSubmit(onRegisterForm)}
      >
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Registrate</Typography>
              <Chip
                label={errorMessage}
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Nombre"
                variant='filled'
                fullWidth
                {...register('name', { required: 'Este campo es requerido' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Correo"
                type="email"
                variant='filled'
                fullWidth
                {...register('email', { required: 'Este campo es obligatorio', validate: validations.isEmail })}
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
                {...register('password', { required: 'Este campo es obligatorio', minLength: { value: 6, message: 'Debe tener minimo 6 caracteres' } })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Confirmar Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register('confirmPassword', { required: 'Este campo es obligatorio', validate: (value) => value === getValues().password || 'Las contraseñas no coinciden' })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" color="secondary" className="circular-btn" size='large' fullWidth>
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
      </form>
    </AuthLayout>
  )
}

export default RegisterPage;