import { createContext } from 'react';
import { ICartProduct, IOrderSummary } from '../../interfaces';

interface CartContext {
  isLoaded: boolean;
  cart: ICartProduct[];
  orderSummary: IOrderSummary;
  updateProductInCart: (product: ICartProduct) => void;
  updatedCartQuantity: (product: ICartProduct) => void;
  deleteProductInCart: (product: ICartProduct) => void;
}

export const CartContext = createContext({} as CartContext);
