import {combineReducers} from "redux";
import {reducer as header} from '../components/Header/store'

const reducers = combineReducers({
  header,
})

export default reducers
