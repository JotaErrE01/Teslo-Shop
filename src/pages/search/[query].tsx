import { GetServerSideProps } from 'next'
import { Typography } from '@mui/material';
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductList } from '../../components/products/ProductList';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces/Products';

interface Props {
  products: IProduct[];
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, query }) => {

  return (
    <ShopLayout
      title="Teslo-Shop - Home"
      pageDescription='Encuentra los mejores productos de Teslo aqui'
    >
      <Typography variant='h1' component='h1'>Buscar Producto</Typography>
      <Typography variant='h2' sx={{ mb: 1, textTransform: 'capitalize' }} >{ query }</Typography>

      <ProductList
        products={products}
      />

    </ShopLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = params?.query as string || '';
  let products = await dbProducts.getSearchProducts(query);

  return {
    props: {
      products,
      query
    }
  }
}

export default SearchPage
