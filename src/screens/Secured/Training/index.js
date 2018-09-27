import React, { Component } from 'react';
import { connect } from 'react-redux';
import Nav from './route';
import { changeSideBarMenus } from "../../../actions/shared";
import NavigationService from '../../../service/NavigationService';

class Training extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <Nav />
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeSideBarMenus: () => { dispatch(changeSideBarMenus()) }
    }
}

export default connect(undefined, mapDispatchToProps)(Training);
