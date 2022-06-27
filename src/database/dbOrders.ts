import { isValidObjectId } from "mongoose";
import { IOrder } from "../interfaces";
import { Order } from "../models";
import { db } from '.';

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  if(!isValidObjectId(id)) return null;

  await db.connect();
  const order = await Order.findById(id).lean();

  if(!order) return null;

  await db.disconnect();
  return JSON.parse(JSON.stringify(order));
}

export const getOrderByUser = async (uid: string): Promise<IOrder[]> => {
  if(!isValidObjectId(uid)) return [];

  await db.connect();
  const order = await Order.find({ user: uid }).lean();

  if(!order) return [];

  await db.disconnect();
  return JSON.parse(JSON.stringify(order));
}
