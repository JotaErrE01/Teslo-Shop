import { GetServerSideProps } from 'next'
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Typography, Grid, TextField, FormControl, InputLabel, MenuItem, Select, Box, Button } from '@mui/material';
import { jwt } from '../../utils';

const AdressPage = () => {
  return (
    <ShopLayout title='Dirección' pageDescription='Confirmar dirección de destino'>
      <Typography variant='h1' component={'h1'}>Direccón</Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField label="Nombre" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Apellido" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Dirección" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Direccón 2 (optional)" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Código Postal" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Ciudad" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Select
              variant="filled"
              label="País"
              value={1}
            >
              <MenuItem value={1}>Consta Rica</MenuItem>
              <MenuItem value={1}>Honduras</MenuItem>
              <MenuItem value={1}>El Salvador</MenuItem>
              <MenuItem value={1}>México</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Ciudad" variant="filled" fullWidth />
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
        <Button color='secondary' className='circular-btn' size='large'>
          Revisar Pedido
        </Button>
      </Box>
    </ShopLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = '' } = req.cookies;
  let isValidToken = false;

  try {
    await jwt.isValidToken(token);
    isValidToken = true;
  } catch (error) {
    isValidToken = false;
  }

  if(!isValidToken) {
    return {
      redirect: {
        destination: 'auth/login?p=/checkout/adress',
        permanent: false
      }
    }
  }

  return {
    props: {
      
    }
  }
}

export default AdressPage