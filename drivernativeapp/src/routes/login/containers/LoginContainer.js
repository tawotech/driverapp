import {connect} from 'react-redux'
import Login from '../components/Login'

// the module folder will contain all actions related to the home page
import { 
} from '../modules/login'

import { 
    setShowMessageBox
 } from '../../../navigations/modules/navigation';

const mapStateToProps = (state) =>({
    showMessageBox: state.navigate.showMessageBox,
    message: state.navigate.message
});

const mapActionCreators = {
    setShowMessageBox
};

export default connect (mapStateToProps,mapActionCreators)(Login); 