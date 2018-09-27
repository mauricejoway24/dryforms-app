import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';
import {Root} from 'native-base';
import Home from './Home';
import Categories from './Categories';
import Models from './Models';
import AddEquipment from './Home/add';

import NavigationService from '../../../service/NavigationService';

export const StackNav = StackNavigator({
    "Home": {
        screen: Home,
        path: 'equipment/home'
    },

    "Add": {
        screen: AddEquipment,
        path: 'equipment/home/add'
    },

    "Categories": {
        screen: Categories,
        path: 'equipment/categories'
    },

   "Models": {
        screen: Models,
        path: 'equipment/models'
    }
},  {
    index: 0,
    initialRouteName: "Home",
    headerMode: "none"
});


export default class Nav extends Component {

    render() {
        return(
            <Root>
                <StackNav
                    ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
            </Root>
        );
    }
}
