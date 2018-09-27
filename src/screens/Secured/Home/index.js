import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import {
    Container,
    Drawer,
    Header,
    Title,
    Left,
    Icon,
    Right,
    Button,
    Body,
    Text,
    Footer,
    FooterTab
} from "native-base";
import shallowCompare from 'react-addons-shallow-compare';
import _ from 'lodash'

import { fetchFormsOrder } from '../../../service/standard_form'
import { changeSideBarMenus } from "../../../actions/shared";

import Settings from '../Settings';
import Standards from '../Standards';
import Equipment from '../Equipment';
import Training from '../Training';
import Sidebar from '../Sidebar';

import {
    logout
} from '../../../service/auth'

import styles from "./styles"
import NavigationService from '../../../service/NavigationService';

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeTab: "settings"
        }

        this.userLogout = this.userLogout.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (shallowCompare(this, nextProps, nextState)) {
            if (this.state.activeTab != nextState.activeTab && nextState.activeTab === 'standards') {
                let menus = this.getSideBarMenus(nextProps.formsOrder)
                this.props.changeSideBarMenus(menus);
            }
            return true
        } else {
            return false;
        }
    }

    getSideBarMenus(formsOrder) {
        let menus = ['Forms Order', 'Affected Areas'];
        _.forEach(formsOrder, form => {
            if (_.indexOf([1, 8, 12], form.form_id) === -1) {
                menus.push(form.name)
            }
        })
        return menus;
    }

    render() {
        const leftHeaderBtn = !this.props.sideBarInvisible ? (
            <Button transparent onPress={() => this.openDrawer()}>
                <Icon name="menu" />
            </Button>
        ) : (
            <Button transparent onPress={() => NavigationService.goBack()}>
                <Icon name="md-arrow-round-back" />
            </Button>
        )

        return (
            <Drawer 
                ref={(ref) => { this._drawer = ref; }}
                content={<Sidebar closeDrawer={this.closeDrawer}/>}
                onClose={() => this.closeDrawer()} >
                <Container>
                    <Header>
                        <Left>
                            {leftHeaderBtn}
                        </Left>
                        <Body>
                            <Title style={styles.headerTitle}>{this.props.headerTitle}</Title>
                        </Body>         
                        <Right>
                            <Button transparent onPress={(e) => this.userLogout(e)}>
                                <Icon name="md-log-out" />
                            </Button>
                        </Right>
                    </Header>
                    {
                        this.state.activeTab === "settings" ? (
                            <Settings />
                        ) : null
                    }
                    {
                        this.state.activeTab === "standards" ? (
                            <Standards />
                        ) : null
                    }
                    {
                        this.state.activeTab === "equipment" ? (
                            <Equipment />
                        ) : null
                    }
                    {
                        this.state.activeTab === "training" ? (
                            <Training />
                        ) : null
                    }
                    <Footer>
                        <FooterTab style={styles.footer}>
                            <Button active={this.state.activeTab === "settings"} onPress={() => this.navigateTab("settings")}>
                                <Text>SETTINGS</Text>
                            </Button>
                            <Button active={this.state.activeTab === "standards"} onPress={() => this.navigateTab("standards")}>
                                <Text>STANDARDS</Text>
                            </Button>
                            <Button active={this.state.activeTab === "equipment"} onPress={() => this.navigateTab("equipment")}>
                                <Text>EQUIPMENT</Text>
                            </Button>
                            <Button active={this.state.activeTab === "training"} onPress={() => this.navigateTab("training")}>
                                <Text>TRAINING</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </Drawer>
        );
    }

    closeDrawer() {
        this._drawer._root.close()
    }

    openDrawer() {
        this._drawer._root.open()
    }

    userLogout(e) {
        this.props.onLogout()
        e.preventDefault();
    }

    navigateTab(activeTab) {
        this.setState(prevState => ({
            activeTab: activeTab
        }))
    }
}

const mapStateToProps = (state) => {
    return {
        formsOrder: state.standard_form.formsOrder,
        headerTitle: state.shared.headerTitle,
        sideBarInvisible: state.shared.sideBarInvisible
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeSideBarMenus: (sideBarMenus) => {
            dispatch(changeSideBarMenus(sideBarMenus))
        },
        onLogout: () => {
            dispatch(logout())
        },
        fetchFormsOrder: () => {
            dispatch(fetchFormsOrder())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);