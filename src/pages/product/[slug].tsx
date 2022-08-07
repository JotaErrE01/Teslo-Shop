import { useState, useContext } from 'react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Grid, Box, Typography, Button, Chip } from '@mui/material';
import { ProductSlideshow, SizeSlector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { dbProducts } from '../../database';
import { IProduct, ICartProduct } from '../../interfaces';
import { CartContext } from '../../context';
import { useRouter } from 'next/router';

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const { updateProductInCart } = useContext( CartContext );
  const router = useRouter();

  const addProduct = () => {
    if(!tempCartProduct.size) return;

    // Llamar la accion de context para agregar al carrito
    updateProductInCart(tempCartProduct);
    router.push('/cart');
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/* titulos */}
            <Typography variant='h1' component='h1'>{product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>${product.price}</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter
                currentValue={ tempCartProduct.quantity }
                updatedQuantity={(value) => setTempCartProduct({ ...tempCartProduct, quantity: value })}
                maxValue={ product.inStock }
              />
              <SizeSlector
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                onClickSize={(size) => setTempCartProduct({ ...tempCartProduct, size })}
              />
            </Box>

            {
              !product.inStock ?
                <Chip label="No hay disponibles" color="error" variant='outlined' />
                :
                <Button
                  color="secondary"
                  className="circular-btn"
                  onClick={addProduct}
                >
                  {
                    tempCartProduct.size ? 
                    'Agregar al carrito'
                    : 
                    'Seleccione una talla'
                  }
                </Button>
            }

          {/* Descripcio */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Descripción</Typography>
            <Typography variant="body2">{product.description}</Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
    </ShopLayout >
  )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const paths = await dbProducts.getAllProducts();

  return {
    paths: paths.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const product = await dbProducts.getProductBySlug(params?.slug as string);

  if (!product) return { redirect: { destination: '/404', permanent: false } };

  return {
    props: {
      product
    },
    revalidate: 86400
  }
}


// SERVER SIDE PROPS
// * SERVER SIDE RENDERING NO USAR SI NO ES NECESARIO

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const product = await dbProducts.getProductBySlug(query.slug as string);

//   if(!product){
//     return {
//       redirect: {
//         destination: '/404',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }

export default ProductPage;