import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data = 
  | { message: string }
  | IProduct[]

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getSearchProducts(req, res);
  
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

async function getSearchProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
  let { q = '' } = req.query;

  if(!q.length) return res.status(400).json({ message: 'Debe de especificar el query de búsqueda' });

  await db.connect();

  const products = await Product.find({
    // busqueda en la base de datos paracida al includes en un string o arreglo
    $text: { $search: q.toString().toLowerCase() }
  })
  .select('title images price inStock slug -_id')
  .lean();

  res.status(200).json( products );

  await db.disconnect();
}
