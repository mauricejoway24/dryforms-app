import React, {
    Component
} from "react";
import {
    StackNavigator
} from "react-navigation";
import {
    Root
} from "native-base";

import Main from "./Main"

import NavigationService from '../../../service/NavigationService';

export const StackNav = StackNavigator({
    Main: {
        screen: Main,
        path: 'training/main'
    }
}, {
        index: 0,
        initialRouteName: "Main",
        headerMode: "none"
    });

export default class Nav extends Component {
    render() {
        return (
            <Root>
                <StackNav
                    ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
            </Root>
        )
    }
}