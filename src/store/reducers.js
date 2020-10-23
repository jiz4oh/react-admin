import {combineReducers} from "redux";
import {reducer as header} from '../components/Header/store'
import {reducer as imagePreview} from '../components/ImagePreviewModal/store'

const reducers = combineReducers({
  header,
  imagePreview,
})

export default reducers
