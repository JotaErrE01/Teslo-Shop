import { Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import { CartContext } from '../../context';
import { currency } from '../../utils';

export const OrdenSummary = () => {
  // No destructuring here, because we need to use the context object
  const { orderSummary, cart } = useContext( CartContext );

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ cart.length } Items</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.format(orderSummary.subTotal) }</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos ({ process.env.NEXT_PUBLIC_TAX_RATE?.split('.').pop() }%)</Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.format(orderSummary.getImpuesto()) }</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>Total:</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
        <Typography variant='subtitle1'>{ currency.format(orderSummary.getTotal()) }</Typography>
      </Grid>
    </Grid>
  )
};
