import { createContext } from 'react';
import { ICartProduct, IOrderSummary, IShippingAddress } from '../../interfaces';

interface CartContext {
  isLoaded: boolean;
  cart: ICartProduct[];
  orderSummary: IOrderSummary;
  shippingAddress?: IShippingAddress;

  //Methods
  updateProductInCart: (product: ICartProduct) => void;
  updatedCartQuantity: (product: ICartProduct) => void;
  deleteProductInCart: (product: ICartProduct) => void;
  updateShippingAddress: (shippingAddress: IShippingAddress) => void;
  createOrder: () => Promise<{ hasError: boolean, message: string }>;
}

export const CartContext = createContext({} as CartContext);
