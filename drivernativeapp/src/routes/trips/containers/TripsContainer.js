import {connect} from 'react-redux'
import Trips from '../components/Trips'

// the module folder will contain all actions related to the home page
import { 
} from '../modules/trips'

const mapStateToProps = (state) =>({

});

const mapActionCreators = {
};

export default connect (mapStateToProps,mapActionCreators)(Trips); 