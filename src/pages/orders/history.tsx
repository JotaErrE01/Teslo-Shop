import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { ShopLayout } from "../../components/layouts";
import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullName', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagado',
    description: 'Revisa si su compra esta pagada o no',
    width: 200,
    renderCell: (params: GridValueGetterParams) => (
      params.row.paid ?
        <Chip color='success' label='Pagado' variant='outlined' />
        :
        <Chip color='error' label='No Pagado' variant='outlined' />
    )
  },
  {
    field: 'link',
    headerName: 'Enlace',
    width: 150,
    renderCell: (params: GridValueGetterParams) => (
        <NextLink href={`/orders/${params.row.link}`} passHref>
          <Link style={{ width: '100%', textAlign: 'center' }} underline='always'>Ver Orden</Link>
        </NextLink>
    ),
    sortable: false,
  }
];

// const rows = [
//   { id: 1, paid: true, fullName: 'Fernando Herrera', link: '12345' },
//   { id: 2, paid: false, fullName: 'Jonathan Ruiz', link: '12345' },
//   { id: 3, paid: true, fullName: 'Karla Robalino', link: '12345' },
//   { id: 4, paid: false, fullName: 'Natalia Herrera', link: '12345' },
//   { id: 5, paid: true, fullName: 'Ana Ruiz', link: '12345' },
// ]

interface Props {
  userOrders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ userOrders }) => {
  const rows = userOrders.map((order, i) => ({
    id: i + 1,
    paid: order.isPaid,
    fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    link: order._id,
  }));

  
  
  return (
    <ShopLayout title="Historial de ordenes" pageDescription="Historial de ordenes del cliente">
      <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      }
    }
  }  

  const userOrders = await dbOrders.getOrderByUser(session.user._id);

  return {
    props: {
      userOrders,
    }
  }
}

export default HistoryPage;