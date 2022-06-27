import { FC, useReducer, ReactNode, useEffect } from 'react';
import { cartReducer, CartContext } from '.';
import { ICartProduct, IOrder, IOrderSummary, IShippingAddress } from '../../interfaces';
import Cookie from 'js-cookie';
import { tesloApi } from '../../api';
import axios from 'axios';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  orderSummary: IOrderSummary;
  shippingAddress?: IShippingAddress;
}


const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  orderSummary: {
    numberOfItems: 0,
    subTotal: 0,
    getImpuesto(){ return 0 },
    getTotal(){ return 0 },
  },
  shippingAddress: undefined
};

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  // Effect to load cart from cookie
  useEffect(() => {
    const cart = JSON.parse(Cookie.get('cart') || '[]');
    dispatch({ type: '[cart] - LoadCart from cookies | storage', payload: cart });
  }, []);

  useEffect(() => {
    // si un valo es undefined, no realizar nada
    if(!Cookie.get('firstName')) return;

    const shippingAddress = {
      firstName: Cookie.get('firstName') || '',
      lastName: Cookie.get('lastName') || '',
      address: Cookie.get('address') || '',
      address2: Cookie.get('address2') || '',
      zip: Cookie.get('zip') || '',
      city: Cookie.get('city') || '',
      country: Cookie.get('country') || '',
      phone: Cookie.get('phone') || '',
    }
    dispatch({ type: '[cart] - LoadAddress from Cookies', payload: shippingAddress });
  }, []);
  
  useEffect(() => {
    // if(!state.cart.length) return;
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

  const updateShippingAddress = (shippingAddress: IShippingAddress) => {
    Cookie.set('firstName', shippingAddress.firstName);
    Cookie.set('lastName', shippingAddress.lastName);
    Cookie.set('address', shippingAddress.address);
    Cookie.set('address2', shippingAddress.address2 || '');
    Cookie.set('zip', shippingAddress.zip);
    Cookie.set('city', shippingAddress.city);
    Cookie.set('country', shippingAddress.country);
    Cookie.set('phone', shippingAddress.phone);
    dispatch({
      type: '[cart] - Update Shipping Address',
      payload: shippingAddress
    });
  }

  const createOrder = async (): Promise<{ hasError: boolean; message: string; }> => {
    if(!state.shippingAddress) {
      throw new Error('No shipping address');
    }

    const body: IOrder = {
      orderItems: state.cart.map( product => ({ ...product, size: product.size! }) ),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.orderSummary.numberOfItems,
      subTotal: state.orderSummary.subTotal,
      tax: state.orderSummary.getImpuesto(),
      total: state.orderSummary.getTotal(),
      isPaid: false
    }

    try {
      const { data } = await tesloApi.post<IOrder>('/orders', body);

      dispatch({ type: '[cart] - Order Complete' });
      return {
        hasError: false,
        message: data._id!
      }
      
    } catch (error) {
      if(axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: (error.response?.data as { message: string }).message,
        }
      }
      return {
        hasError: true,
        message: 'Error al crear la orden, hable con el administrador'
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        ...state,

        // METHODS
        updateProductInCart,
        updatedCartQuantity,
        deleteProductInCart,
        updateShippingAddress,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};