import {connect} from 'react-redux'
import Trips from '../components/Trips'

// the module folder will contain all actions related to the home page
import { 
    getGroupedTripsAction,
    assignFcmTokenAction,
    getNotificationTripDataAction,
    closeTripNotificationAction,
    notificationAcceptTripAction,
    notificationDeclineTripAction
} from '../modules/trips'

const mapStateToProps = (state) =>({
    completeTrips: state.trips.completeTrips,
    incompleteTrips: state.trips.incompleteTrips,
    vehicle: state.trips.vehicle,
    isLoading: state.trips.isLoading,
    notifications: state.trips.notifications,
    notificationTrip: state.trips.notificationTrip,
    notificationTripIsLoading: state.trips.notificationTripIsLoading
});

const mapActionCreators = {
    getGroupedTripsAction,
    assignFcmTokenAction,
    getNotificationTripDataAction,
    closeTripNotificationAction,
    notificationAcceptTripAction,
    notificationDeclineTripAction
};

export default connect (mapStateToProps,mapActionCreators)(Trips); 