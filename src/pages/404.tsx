import { ShopLayout } from '../components/layouts';
import { Box, Typography } from '@mui/material';

const Custom404 = () => {
  return (
    <ShopLayout title='Page not Found' pageDescription='No hay nada que mostrar aqui'>
      <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
        <Typography variant='h1' component='h1' fontSize={{ xs: 30, sm: 80 }} fontWeight={200}>404 |</Typography>

        <Typography marginLeft={2} fontSize={{ xs: 10, sm: 20 }}>No Se Encontro Ninguna Pagian Aqui</Typography>
      </Box>
    </ShopLayout>
  )
}

export default Custom404