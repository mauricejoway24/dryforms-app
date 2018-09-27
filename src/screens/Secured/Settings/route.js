import React, {
    Component
} from "react";
import {
    StackNavigator
} from "react-navigation";
import {
    Root
} from "native-base";

import Account from "./Account"
import Company from "./Company"
import Users from "./Users"
import UserEdit from "./Users/edit"
import Teams from "./Teams"
import TeamEdit from "./Teams/edit"
import Reviews from "./Reviews"
import ReviewLinkEdit from "./Reviews/edit"
import RequestMessageEdit from "./Reviews/request_message"

import NavigationService from '../../../service/NavigationService';

export const StackNav = StackNavigator({
    Account: {
        screen: Account,
        path: 'settings/account'
    },
    Company: {
        screen: Company,
        path: 'settings/company'
    },
    Users: {
        screen: Users,
        path: 'settings/users'
    },
    UserEdit: {
        screen: UserEdit,
        path: 'settings/user/edit'
    },
    Teams: {
        screen: Teams,
        path: 'settings/teams'
    },
    TeamEdit: {
        screen: TeamEdit,
        path: 'settings/team/edit'
    },
    Reviews: {
        screen: Reviews,
        path: 'settings/reviews'
    },
    ReviewLinkEdit: {
        screen: ReviewLinkEdit,
        path: 'settings/review_link/edit'
    },
    RequestMessageEdit: {
        screen: RequestMessageEdit,
        path: 'settings/request_message_edit'
    }
}, {
    index: 0,
    initialRouteName: "Account",
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