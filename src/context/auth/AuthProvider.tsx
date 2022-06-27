import React, { FC, useReducer, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { AuthContext, authReducer } from './';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';
import axios from 'axios';
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();
  // const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch({ type: '[Auth] Login', payload: data?.user as IUser });
    }
  }, [ status, data ]);
  

  // useEffect(() => {
  //   if( !Cookies.get('token') ) {
  //     return;
  //   }
  //   checkToken();
  // }, []);
  
  // const checkToken = async () => {
  //   try {
  //     const { data } = await tesloApi.get('/user/validate-token');
  //     const { user, token } = data;
  //     Cookies.set('token', token);

  //     // dispatch to update the state
  //     dispatch({ type: '[Auth] Login', payload: user });
  //   } catch (error) {
  //     Cookies.remove('token');
  //     console.log(error);
  //   }
  // }

  const loginUser = async ( email: string, password: string ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password });
      const { token, user } = data;

      // almacenar token en cookies
      Cookies.set('token', token);

      // realizar dispatch
      dispatch({ type: '[Auth] Login', payload: user });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  const registerUser = async ( email: string, password: string, name: string ): Promise<{ hasError: boolean, message?: string }> => {
    try {
      const { data } = await tesloApi.post('/user/register', { email, password, name });
      const { token, user } = data;

      // almacenar token en cookies
      Cookies.set('token', token);

      // realizar dispatch
      dispatch({ type: '[Auth] Login', payload: user });
      return { hasError: false };

    } catch (error) {
      if(axios.isAxiosError(error)){
        return {
          hasError: true,
          message: (error.response?.data as { message: string }).message
        }
      }

      return {
        hasError: true,
        message: 'No se puedo crear el usuario, Intente de Nuevo'
      }
    }
  }

  const logout = () => {
    Cookies.remove('cart');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');
    
    signOut();
    // router.reload();
    // Cookies.remove('token');
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,

        // methods
        loginUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

