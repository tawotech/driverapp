import {combineReducers} from 'redux'
import {LoginReducer as login} from '../routes/login/modules/login'
import {TripsReducer as trips} from '../routes/trips/modules/trips'
import { NavigationReducer as navigate } from '../navigations/modules/navigation'

export const makeAppReducer = () => {
    return combineReducers({
        login,
        trips,
        navigate
        // all single reducers are added here
    });
}

export default makeAppReducer;
