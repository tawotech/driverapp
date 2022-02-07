import {connect} from 'react-redux'
import TermsAndConditions from '../components/TermsAndConditions';
// the module folder will contain all actions related to the home page
import { 
} from '../modules/termsAndConditions'

const mapStateToProps = (state) =>({

});

const mapActionCreators = {
};

export default connect (mapStateToProps,mapActionCreators)(TermsAndConditions); 