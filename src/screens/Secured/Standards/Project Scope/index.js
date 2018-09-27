import React, { Component } from 'react';
import { Container, Content, ScrollView, Text, View, Button, Image, ImageBackground, StyleSheet } from 'react-native';


class ProjectScope extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {
        console.log("project scope mounted")
    }
    
    render() {
        return (
            <Text>Project Scope</Text>
        );
    }
}

export default ProjectScope;