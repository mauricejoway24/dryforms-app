import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, List, ListItem, Button, Text, Left, Right, Icon } from 'native-base';
import _ from 'lodash'

import commonColor from "../../../theme/variables/commonColor";
import { changeSideBarMenus } from '../../../actions/shared'
import NavigationService from '../../../service/NavigationService';

class Sidebar extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    navigateToSubPage(sideBarMenu) {
        var formId = _.result(_.find(this.props.formsOrder, function(form) {
            return form.name === sideBarMenu;
        }), 'form_id');
        if (formId && _.indexOf(["Forms Order"], sideBarMenu) === -1 && _.indexOf([1, 2, 3, 7, 8, 12], formId) === -1) {
            NavigationService.navigate("StandardForm", {
                form_id: formId
            })
        } else {
            NavigationService.navigate(sideBarMenu, null)
        }
        this.props.closeDrawer();
    }

    render() {
        console.log(this.props.sideBarMenus)

        const listComponents = this.props.sideBarMenus.map((sideBarMenu) => (
            <ListItem key={sideBarMenu} noIndent button onPress={() => this.navigateToSubPage(sideBarMenu)}>
                <Left>
                    <Text>{sideBarMenu}</Text>
                </Left>
                <Right>
                    <Icon name="ios-arrow-forward" />
                </Right>
            </ListItem>
        ))
        return (
            <Content style={commonColor.sideBar}>
                <List>
                    {listComponents}
                </List>
            </Content>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        sideBarMenus: state.shared.sideBarMenus,
        formsOrder: state.standard_form.formsOrder
    };
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        changeSideBarMenus: () => { dispatch(changeSideBarMenus()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);