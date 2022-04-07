import { state } from 'react-native-push-notification/component';
import {connect} from 'react-redux'
import Contacts from '../components/Contacts'

// the module folder will contain all actions related to the home page
import { 
    getContacts,
    openCallDialogAction,
    openSendEmailAction
} from '../modules/contacts'


const mapStateToProps = (state) =>({
    allContacts: state.contacts.allContacts,
    fleets: state.contacts.fleets,
    etapathSites: state.contacts.etapathSites,
    emergency: state.contacts.emergency
});

const mapActionCreators = {
    getContacts,
    openCallDialogAction,
    openSendEmailAction
};

export default connect (mapStateToProps,mapActionCreators)(Contacts); 