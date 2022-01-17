import {connect} from 'react-redux'
import Trips from '../components/Trips'

// the module folder will contain all actions related to the home page
import { 
    getGroupedTripsAction
} from '../modules/trips'

const mapStateToProps = (state) =>({
    completeTrips: state.trips.completeTrips,
    incompleteTrips: state.trips.incompleteTrips,
    vehicle: state.trips.vehicle
});

const mapActionCreators = {
    getGroupedTripsAction
};

export default connect (mapStateToProps,mapActionCreators)(Trips); 