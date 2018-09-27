import React, { Component } from "react";
import { connect } from 'react-redux';

import Login from "./screens/Login/";
import Home from "./screens/Secured/Home";

class Parent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.isLoggedIn) {
            return <Home />
        } else {
            return <Login />
        }
    }
}

const mapStateToProps = (state) => {
    return {
      isLoggedIn: state.auth.isLoggedIn,
      isLoggingIn: state.auth.isLoggingIn,
      error: state.auth.error,
      token: state.auth.token
    };
}

export default connect(mapStateToProps, undefined)(Parent);