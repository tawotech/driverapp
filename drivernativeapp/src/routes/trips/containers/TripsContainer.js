import {connect} from 'react-redux'
import Trips from '../components/Trips'

// the module folder will contain all actions related to the home page
import { 
    getGroupedTripsAction,
    assignFcmTokenAction
} from '../modules/trips'

const mapStateToProps = (state) =>({
    completeTrips: state.trips.completeTrips,
    incompleteTrips: state.trips.incompleteTrips,
    vehicle: state.trips.vehicle,
    isLoading: state.trips.isLoading
});

const mapActionCreators = {
    getGroupedTripsAction,
    assignFcmTokenAction
};

export default connect (mapStateToProps,mapActionCreators)(Trips); 