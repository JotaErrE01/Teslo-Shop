import { db } from "."
import { IProduct } from "../interfaces";
import { Product } from "../models";

export const getProductBySlug = async ( slug: string ): Promise<null | IProduct> => {
  await db.connect();

  const product = await Product.findOne({ slug }).select('title images price inStock slug sizes description').lean();

  if(!product) return null;  

  await db.disconnect();

  // Serializar el _id para que este sea un string y no un objeto de mongo, si el product tuviera fechas updateAt, createAt, etc, estas tambien deben serializarce
  product._id = product._id.toString();

  return product;
}

interface ProductSlug {
  slug: string;
}

export const getAllProducts = async (): Promise<ProductSlug[]> => {
  await db.connect();

  const slugs = await Product.find().select('slug -_id').lean();

  await db.disconnect();

  return slugs;
}

export const getSearchProducts = async (query: string): Promise<IProduct[]> => {
  await db.connect();

  let products = await Product.find({
    // busqueda en la base de datos paracida al includes en un string o arreglo
    $text: { $search: query.toLowerCase() }
  })
  .select('title images price inStock slug -_id')
  .lean();

  if(!products.length) products = await Product.find().select('title images price inStock slug -_id').lean();

  await db.disconnect();

  return JSON.parse(JSON.stringify(products));
}


