import {combineReducers} from "redux";
import {reducer as header} from '../layouts/Header/store'

const reducers = combineReducers({
  header,
})

export default reducers
