import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const Kids = () => {
  const { products,  isLoading } = useProducts('/products?gender=kid');

  return (
    <ShopLayout title='Teslo Shop - KIDS' pageDescription='Productos para niños'>
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

export default Kids;