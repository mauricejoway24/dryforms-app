import React, {Component} from "react";
import { connect } from 'react-redux';
import Nav from './route'

import { changeSideBarMenus } from "../../../actions/shared";

class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {
        this.props.changeSideBarMenus([ 'Account', 'Company', 'Users', 'Teams', 'Invoices', 'Reviews' ])
    }
    
    render() {
        return (
            <Nav />
        );
    }
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        changeSideBarMenus: (sideBarMenus) => { dispatch(changeSideBarMenus(sideBarMenus)) }
    }
}
export default connect(undefined, mapDispatchToProps)(Settings);