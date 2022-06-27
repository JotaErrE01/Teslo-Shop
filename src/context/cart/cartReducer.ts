import { CartState } from "./";
import { ICartProduct, IOrderSummary, IShippingAddress } from '../../interfaces';

type CartActionType =
  | { type: '[cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
  | { type: '[cart] - Update Products', payload: ICartProduct[] }
  | { type: '[cart] - Update Cart Quantity', payload: ICartProduct }
  | { type: '[cart] - Delete Product Cart', payload: ICartProduct }
  | { type: '[cart] - Update Order Summary', payload: IOrderSummary }
  | { type: '[cart] - LoadAddress from Cookies', payload: IShippingAddress }
  | { type: '[cart] - Update Shipping Address', payload: IShippingAddress }
  | { type: '[cart] - Order Complete' }

export const cartReducer  = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case '[cart] - LoadCart from cookies | storage':
      return { ...state, isLoaded: true, cart: [...action.payload] };

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

    case '[cart] - Update Shipping Address':
    case '[cart] - LoadAddress from Cookies':
      return {
        ...state,
        shippingAddress: action.payload
      }

    case '[cart] - Order Complete':
      return {
        ...state,
        cart: [],
        orderSummary: {
          ...state.orderSummary,
          subTotal: 0,
          numberOfItems: 0,
        }
      }

    default:
      return state;
  }
};
