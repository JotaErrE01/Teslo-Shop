import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material';
import { CartList, OrdenSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, isPaid, numberOfItems, shippingAddress, orderItems, subTotal, total, tax } = order;

  return (
    <ShopLayout
      title={`Resumen de la orden ${_id}`}
      pageDescription='Resumen de la orden'
    >
      <Typography variant='h1' component='h1' sx={{ mb: 2 }}>Orden: {_id}</Typography>
      {
        isPaid ? (
          <Chip
            sx={{ my: 2 }}
            label='Orden Pagada'
            variant='outlined'
            color='success'
            icon={<CreditScoreOutlined />}
          />
        ) : (
          <Chip
            sx={{ my: 2 }}
            label='Pendiente de Pago'
            variant='outlined'
            color='error'
            icon={<CreditCardOffOutlined />}
          />
        )
      }

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList products={orderItems} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Resumen {numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Dirección de entrega</Typography>
              </Box>

              <Typography>{shippingAddress.firstName}</Typography>
              <Typography>{shippingAddress.lastName}</Typography>
              <Typography>{shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}</Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrdenSummary orderValues={{ total, subTotal, tax, numberOfItems }} />

              <Box sx={{ mt: 3 }} display="flex" flexDirection={'column'}>
                {
                  isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label='Orden Pagada'
                      variant='outlined'
                      color='success'
                      icon={<CreditScoreOutlined />}
                    />
                  )
                    : (
                      <h1>Pagar</h1>
                    )
                }
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      }
    }
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      }
    }
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      }
    }
  }

  return {
    props: {
      order
    }
  }
}

export default OrderPage