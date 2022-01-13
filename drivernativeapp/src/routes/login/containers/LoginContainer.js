import {connect} from 'react-redux'
import Login from '../components/Login'

// the module folder will contain all actions related to the home page
import { 
} from '../modules/login'

const mapStateToProps = (state) =>({

});

const mapActionCreators = {
};

export default connect (mapStateToProps,mapActionCreators)(Login); 