import {connect} from 'react-redux'
import MapView from '../components/MapView';
// the module folder will contain all actions related to the home page
import { 
} from '../modules/mapView'

const mapStateToProps = (state) =>({
    
});

const mapActionCreators = {

};

export default connect (mapStateToProps,mapActionCreators)(MapView); 