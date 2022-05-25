import { CartState } from "./";
import { ICartProduct, IOrderSummary } from '../../interfaces';

type CartActionType =
  | { type: '[cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
  | { type: '[cart] - Update Products', payload: ICartProduct[] }
  | { type: '[cart] - Update Cart Quantity', payload: ICartProduct }
  | { type: '[cart] - Delete Product Cart', payload: ICartProduct }
  | { type: '[cart] - Update Order Summary', payload: IOrderSummary }

export const cartReducer  = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case '[cart] - LoadCart from cookies | storage':
      return { ...state, cart: [...action.payload] };

    case '[cart] - Update Products':
      return {
        ...state,
        cart: [...action.payload],
      }

    case '[cart] - Update Cart Quantity':
      return {
        ...state,
        cart: state.cart.map(product => {
          if(product._id === action.payload._id && product.size === action.payload.size){
            return action.payload;
          }
          return product;
        })
      }

    case '[cart] - Delete Product Cart':
      return {
        ...state,
        cart: state.cart.filter(product => !(product._id === action.payload._id && product.size == action.payload.size))
      }

    case '[cart] - Update Order Summary':
      return {
        ...state,
        orderSummary: { ...action.payload }
      }

    default:
      return state;
  }
};
