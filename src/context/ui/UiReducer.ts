import { UiState } from ".";

type ActionTypes = '[UI] - ToogleMenu';

interface IAction {
    type: ActionTypes;
    payload?: any;
}
type UiActionType =
  | { type: '[UI] - ToogleMenu' }

export const uiReducer  = (state: UiState, action: UiActionType): UiState => {
  switch (action.type) {
    case '[UI] - ToogleMenu':
      return { 
        ...state,
        isMenuOpen: !state.isMenuOpen
      };

    default:
      return state;
  }
};
