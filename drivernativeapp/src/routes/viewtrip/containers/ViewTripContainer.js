import {connect} from 'react-redux'
import ViewTrip from '../components/ViewTrip';
// the module folder will contain all actions related to the home page
import { 
    getTripDataAction,
    acceptTripAction,
    onRouteAction,
    getPassengerAction,
    completeTripAction,
    endTripAction,
    openInGoogeMapsAction,
    openCallDialogAction,
    declineTripAction,
    skipTripAction
} from '../modules/viewTrip'

const mapStateToProps = (state) =>({
    tag: state.viewTrip.tag,
    date: state.viewTrip.date,
    time: state.viewTrip.time,
    trip_id: state.viewTrip.trip_id,
    company: state.viewTrip.company,
    status: state.viewTrip.status,
    total_distance: state.viewTrip.total_distance,
    order: state.viewTrip.order,
    trips: state.viewTrip.trips,
    isLoading: state.viewTrip.isLoading,
    passengerIsLoading: state.viewTrip.passengerIsLoading,
    passenger: state.viewTrip.passenger,
    passengerStatus: state.viewTrip.passengerStatus,
    passengerBound: state.viewTrip.passengerBound,
    passengerLocation: state.viewTrip.passengerLocation,
    passengerDestination: state.viewTrip.passengerDestination,
    passengerName: state.viewTrip.passengerName,
    passengerSurname: state.viewTrip.passengerSurname,
    firstPassenger: state.viewTrip.firstPassenger,
    distanceTravelled: state.viewTrip.distanceTravelled
});

const mapActionCreators = {
    getTripDataAction,
    acceptTripAction,
    onRouteAction,
    getPassengerAction,
    completeTripAction,
    endTripAction,
    openInGoogeMapsAction,
    openCallDialogAction,
    declineTripAction,
    skipTripAction
};

export default connect (mapStateToProps,mapActionCreators)(ViewTrip); 