import React, { Component } from 'react';
import {connect} from 'react-redux';
import Nav from './route';

import {changeSideBarMenus} from '../../../actions/shared';

class Equipment extends Component {

    constructor(props) {
        super(props);
    }

    state = {
    }

    componentDidMount() {
        this.props.changeSideBarMenus(['Inventory', 'Categories', 'Models']);
    }

    render() {
        return (
            <Nav />
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeSideBarMenus: (sideBarMenus) => {dispatch(changeSideBarMenus(sideBarMenus)) }
    }
}

export default connect(undefined, mapDispatchToProps)(Equipment);
