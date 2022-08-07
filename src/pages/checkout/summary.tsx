import { useContext, useMemo, useEffect, useState } from 'react';
import { CartContext } from '../../context';
import NextLink from 'next/link';
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material';
import { CartList, OrdenSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { countries } from '../../utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, orderSummary, createOrder } = useContext(CartContext);
  const [isPoisting, setIsPoisting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!Cookies.get('firstName')) router.push('/checkout/address');
  }, [router]);

  const onCreateOrder = async () => {
    setIsPoisting(true);
    const { hasError, message } = await createOrder();

    if (hasError) {
      setIsPoisting(false);
      setErrorMessage(message);
      return;
    }

    router.replace(`/orders/${message}`)
  }

  if (!shippingAddress) return <></>;

  const { firstName, lastName, address, address2, zip, city, country, phone } = shippingAddress;


  return (
    <ShopLayout
      title='Carrito - 3'
      pageDescription='Resumen de la orden'
    >
      <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Resumen de la Orden</Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Resumen ({orderSummary.numberOfItems} {`${orderSummary.numberOfItems === 1 ? 'producto' : 'productos'}`})</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Dirección de entrega</Typography>

                <NextLink href='/checkout/address' passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>

              <Typography>{`${firstName} ${lastName}`}</Typography>
              <Typography>{address} {address2 ? ',' + address2 : ''}</Typography>
              <Typography>{city} {zip}</Typography>
              {/* <Typography>{ countries.find(({ code }) => code === country)!.name }</Typography> */}
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>

              <OrdenSummary />

              <Box sx={{ mt: 3 }} display='flex' flexDirection={'column'}>
                <Button
                  onClick={onCreateOrder}
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  disabled={isPoisting}
                >
                  Confirmar Orden
                </Button>

                <Chip
                  color='error'
                  label={errorMessage}
                  sx={{ display: errorMessage ? 'flex' : 'none', marginTop: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummaryPage