import { Grid, Typography } from '@mui/material';
import { useContext, FC } from 'react';
import { CartContext } from '../../context';
import { currency } from '../../utils';

interface Props {
  orderValues?: {
    total: number;
    subTotal: number;
    tax: number;
    numberOfItems: number;
  }
}

export const OrdenSummary: FC<Props> = ({ orderValues }) => {
  // No destructuring here, because we need to use the context object
  const { orderSummary, cart } = useContext( CartContext );
  const { numberOfItems, subTotal } = orderSummary;

  const summaryValues = orderValues ? orderValues : orderSummary;
  
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ summaryValues.numberOfItems } { summaryValues.numberOfItems > 1 ? 'Items' : 'Item' }</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.format(summaryValues.subTotal) }</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos ({ process.env.NEXT_PUBLIC_TAX_RATE?.split('.').pop() }%)</Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.format( orderValues ? orderValues.tax : orderSummary.getImpuesto()) }</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>Total:</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
        <Typography variant='subtitle1'>{ currency.format(orderValues ? orderValues.total : orderSummary.getTotal()) }</Typography>
      </Grid>
    </Grid>
  )
};
