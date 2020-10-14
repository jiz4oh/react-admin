import constants from './constants'

const defaultState = {
  currentPaths: []
};

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case constants.CHANGE_BREADCRUMB:
      return {...state, currentPaths: action.paths};
    default:
      return state;
  }
};

export default reducer;