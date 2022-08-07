import type { NextApiRequest, NextApiResponse } from 'next'
import { IOrder } from '../../../interfaces';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { Order, Product } from '../../../models';

type Data = 
  | { message: string; }
  | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);
  
    default:
      return res.status(405).json({ message: 'Method Not Allowed' })
  }
}


async function createOrder(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { orderItems, total } = req.body as IOrder;

  // verificar que tengamos un usuario logueado
  const session: any = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ message: 'Debe de estar autorizado para hacer esto' })
  }

  // Crear un arreglo con los productos que la persona quiere
  const productsId = orderItems.map(product => product._id);
  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productsId } }); // $in => existe en el arreglo

  try {
    const subTotal = orderItems.reduce((acc, curr) => {
      const realPrice = dbProducts.find(({ id }) => id === curr._id)?.price;
      if(!realPrice) {
        throw new Error('No se encontro el precio del producto');
      }

      return acc + (realPrice * curr.quantity);
    }, 0);

    const taxtRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal + (subTotal * taxtRate);

    if(total !== backendTotal) {
      throw new Error('El total no coincide con el monto');
    }

    // esta todo bien, guardar el pedido
    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    newOrder.total = Math.round(newOrder.total * 100) / 100;// math.round elimina los decimales
    await newOrder.save();

    await db.disconnect();

    return res.status(201).json(newOrder);

  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    return res.status(500).json({ message: error.message || 'Revise logs del servidor' });
  }
}

