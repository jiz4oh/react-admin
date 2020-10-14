import {combineReducers} from "redux";
import {reducer as DBTable} from '../components/DBTable/store'
import {reducer as header} from '../components/Header/store'
import {reducer as imagePreview} from '../components/ImagePreviewModal/store'

const reducers = combineReducers({
  table: DBTable,
  header,
  imagePreview,
})

export default reducers
