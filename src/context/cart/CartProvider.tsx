import { FC, useReducer, ReactNode, useEffect } from 'react';
import { cartReducer, CartContext } from '.';
import { ICartProduct, IOrderSummary } from '../../interfaces';
import Cookie from 'js-cookie';

export interface CartState {
  cart: ICartProduct[];
  orderSummary: IOrderSummary;
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
  orderSummary: {
    numberOfItems: 0,
    subTotal: 0,
    getImpuesto(){ return 0 },
    getTotal(){ return 0 },
  }
};

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  // Effect to load cart from cookie
  useEffect(() => {
    const cart = JSON.parse(Cookie.get('cart') || '[]');
    dispatch({ type: '[cart] - LoadCart from cookies | storage', payload: cart });
  }, []);
  
  useEffect(() => {
    if(!state.cart.length) return;
    // Guardar carrito en las cookies
    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const orderSummary = {
      numberOfItems: state.cart.reduce((acc, curr) => curr.quantity + acc, 0),
      subTotal: state.cart.reduce((acc, curr) => ( curr.price * curr.quantity ) + acc, 0),
      getImpuesto() { return this.subTotal * Number(process.env.NEXT_PUBLIC_TAX_RATE || 0); },
      getTotal() { return this.subTotal + this.getImpuesto(); },
    }

    dispatch({ type: '[cart] - Update Order Summary', payload: orderSummary });
  }, [state.cart]);
  

  const updateProductInCart = ( product: ICartProduct ) => {
    const existProductInCart = state.cart.some( item => item._id === product._id && item.size === product.size );

    if(!existProductInCart) return dispatch({ type: '[cart] - Update Products', payload: [ ...state.cart, product ] });

    dispatch({ type: '[cart] - Update Products', payload: [ ...state.cart.map(item => {
      if(item._id === product._id && item.size === product.size) return { ...item, quantity: item.quantity + product.quantity };
      return item;
    })] });    
  }

  const updatedCartQuantity = ( product: ICartProduct ) => {
    dispatch({
      type: '[cart] - Update Cart Quantity',
      payload: product
    });
  }

  const deleteProductInCart = (product: ICartProduct) => {
    dispatch({
      type: '[cart] - Delete Product Cart',
      payload: product
    });
  }

  return (
    <CartContext.Provider
      value={{
        ...state,

        // METHODS
        updateProductInCart,
        updatedCartQuantity,
        deleteProductInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};