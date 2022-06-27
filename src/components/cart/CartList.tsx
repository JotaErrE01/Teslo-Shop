import NextLink from 'next/link';
import { Grid, Typography, Link, CardActionArea, CardMedia, Box, Button } from '@mui/material';
import { ItemCounter } from '../ui';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updatedCartQuantity, deleteProductInCart } = useContext(CartContext);

  const productsToShow = products ? products : cart;

  return (
    <>
      {
        productsToShow.map(product => (
          <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
            <Grid item xs={3}>
              <NextLink href={`/product/${product.slug}`} passHref>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      image={`/products/${product.image}`}
                      component="img"
                      sx={{ borderRadius: '5px' }}
                    />
                  </CardActionArea>
                </Link>
              </NextLink>
            </Grid>

            <Grid item xs={7}>
              <Box display={'flex'} flexDirection='column'>
                <Typography variant='body1'>{product.title}</Typography>
                <Typography variant='body1'>Talla: <strong>{product.size}</strong></Typography>

                {/* Conditional */}
                {
                  editable
                    ?
                    <ItemCounter
                      currentValue={product.quantity}
                      maxValue={10}
                      updatedQuantity={(value) => {
                        product.quantity = value;
                        updatedCartQuantity(product as ICartProduct);
                      }}
                    />
                    : <Typography variant='h5' >{product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}</Typography>
                }
              </Box>
            </Grid>

            <Grid item xs={2} display='flex' alignItems='center' flexDirection='column' >
              <Typography variant='subtitle1'>${product.price}</Typography>
              {
                editable &&
                <Button
                  variant='text'
                  color='secondary'
                  onClick={() => deleteProductInCart(product as ICartProduct)}
                >
                  Remover
                </Button>
              }
            </Grid>
          </Grid>
        ))
      }
    </>
  )
};
