import _ from 'lodash'

import constants from './constants'

export const defaultState = {
  previewVisible: false,
  previewImages: []
};

const reducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case constants.SHOW_PREVIEW:
      return {
        previewVisible: true,
        previewImages: action.payload
      }
    case constants.CANCEL_PREVIEW:
      return _.cloneDeep(defaultState)
    default:
      return state;
  }
};

export default reducer;