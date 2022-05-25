import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Typography } from '@mui/material';
import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks/useProducts';

const Men = () => {
  const { products,  isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout title='Teslo Shop - MEN' pageDescription='Productos para hombres'>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : (
            <ProductList 
              products={ products }
            />
          )
      }
    </ShopLayout>
  )
}

export default Men;