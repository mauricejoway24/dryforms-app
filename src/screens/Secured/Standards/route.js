import React, {Component} from "react";
import {
    Root
} from "native-base";
import {
    StackNavigator
} from "react-navigation";

import FormsOrder from "./Forms Order"
import ProjectScope from "./Project Scope"
import DailyLog from "./DailyLog"
import MoistureMap from "./MoistureMap"
import MoistureMapEdit from "./MoistureMap/edit"
import AffectedAreas from "./AffectedAreas"
import AffectedAreaEdit from "./AffectedAreas/edit"
import StandardForm from "./StandardForm"

import NavigationService from '../../../service/NavigationService';

export const StackNav = StackNavigator({
    "Forms Order": {
        screen: FormsOrder,
        path: 'standards/forms_order'
    },
    "StandardForm": {
        screen: StandardForm,
        path: 'standards/standard_orm'
    },
    "Project Scope": {
        screen: ProjectScope,
        path: 'standards/project_scope'
    },
    "Daily Log": {
        screen: DailyLog,
        path: 'standards/daily_log'
    },
    "Moisture Map": {
        screen: MoistureMap,
        path: 'standards/moisture_maps'
    },
    "MoistureMapEdit": {
        screen: MoistureMapEdit,
        path: 'standards/moisture_map/edit'
    },
    "Affected Areas": {
        screen: AffectedAreas,
        path: 'standards/affected_areas'
    },
    "AffectedAreaEdit": {
        screen: AffectedAreaEdit,
        path: 'standards/affected_area/edit'
    }
}, {
    index: 0,
    initialRouteName: "Affected Areas",
    headerMode: "none"
});

export default class Nav extends Component {
    render() {
        return (
            <Root>
                <StackNav 
                    ref={navigatorRef  => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />            
            </Root>
        )
    }
}