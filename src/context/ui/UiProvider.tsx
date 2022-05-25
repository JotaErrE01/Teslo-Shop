import { FC, useReducer, ReactNode } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState {
  isMenuOpen: boolean;
}

const Ui_INITIAL_STATE: UiState = {
  isMenuOpen: false,
};

interface ProviderProps {
  children: ReactNode;
}

export const UiProvider: FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, Ui_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: '[UI] - ToogleMenu' });
  }

  return (
    <UiContext.Provider
      value={{
        ...state,

        // Methods
        toggleSideMenu
      }}
    >
      {children}
    </UiContext.Provider>
  );
};