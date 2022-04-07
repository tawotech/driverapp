import {combineReducers} from 'redux'
import {LoginReducer as login} from '../routes/login/modules/login'
import {TripsReducer as trips} from '../routes/trips/modules/trips'
import {NavigationReducer as navigate } from '../navigations/modules/navigation'
import { ViewTripReducer as viewTrip } from '../routes/viewtrip/modules/viewTrip'
import { TermsAndConditionsReducer as terms } from '../routes/termsandconditions/modules/termsAndConditions'
import { ContactsReducer as contacts } from '../routes/contacts/modules/contacts'

export const makeAppReducer = () => {
    return combineReducers({
        login,
        trips,
        navigate,
        viewTrip,
        terms,
        contacts
        // all single reducers are added here
    });
}

export default makeAppReducer;
