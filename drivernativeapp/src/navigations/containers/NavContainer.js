import {connect} from 'react-redux'
import Navigation from '../components/Navigation';

// the module folder will contain all actions related to the home page
import { 
    loginAction,
    logoutAction,
    retrieveTokenAction
} from '../modules/navigation'

const mapStateToProps = (state) =>({
    loginState: state.navigate
});

const mapActionCreators = {
    loginAction,
    logoutAction,
    retrieveTokenAction
};

export default connect (mapStateToProps,mapActionCreators)(Navigation); 