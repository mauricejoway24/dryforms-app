import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import {
    Content,
    Button,
    Icon,
    Text,
    List,
    Toast,
    Fab
} from "native-base";
import {
    ListView,
    View
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';

import apiUsers from '../../../../api/users'
import apiTeams from '../../../../api/teams'
import apiRoles from '../../../../api/roles'
import {
    changeHeaderTitle,
    changeSideBarInivisble
} from '../../../../actions/shared'
import {
    fetchUser
} from '../../../../service/fetch_user'
import styles from "./styles"
import {
    handleErrorResponse
} from '../../../../service/error_handler'
import NavigationService from '../../../../service/NavigationService';

class Users extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            roles: [],
            teams: [],
            companyId: '',
            isLoaded: false
        }
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Manage Your Users")
                this.props.visableSideBar()
                this.props.fetchUser()
                this.initData()
                console.log("users mounted")
            }),
            this.props.navigation.addListener("willBlur", () => { })
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (shallowCompare(this, nextProps, nextState)) {
            if (nextProps.company.id && !this.state.companyId) {
                nextState.companyId = nextProps.company.id
                nextState.isLoaded = true
            }
            return true
        } else {
            return false;
        }
    }


    initData() {
        const apis = [
            apiUsers.index(),
            apiTeams.index(),
            apiRoles.index()
        ]
        return Promise.all(apis)
            .then(response => {
                this.setState({
                    users: response[0].data.data,
                    teams: response[1].data.data.map(item => {
                        item.value = item.id
                        item.text = item.name
                        return item
                    }),
                    roles: response[2].data.data.map(item => {
                        item.value = item.id
                        item.text = item.name
                        return item
                    })
                })
            })
    }

    deleteUser(data, secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        const newData = [...this.state.users];
        newData.splice(rowId, 1);
        this.setState({
            users: newData
        });
        apiUsers.delete(data.id)
            .then((response) => {
                Toast.show({
                    text: response.data.message,
                    duration: 3000,
                    type: "success"
                })
            })
            .catch((error) => {
                handleErrorResponse(error)
            });
    }

    editUser = (data) => {
        data.team_id = data.teams.length > 0 ? data.teams[0].id : null
        NavigationService.navigate('UserEdit', {
            user: data,
            roles: this.state.roles,
            teams: this.state.teams,
            companyId: this.state.companyId
        })
    }

    createUser = () => {
        NavigationService.navigate('UserEdit', {
            user: {
                id: null
            },
            roles: this.state.roles,
            teams: this.state.teams,
            companyId: this.state.companyId
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.isLoaded ? (
                    <View style={{ flex: 1 }}>
                        <Content>
                            <List style={{ marginTop: 10, flex: 1 }}
                                dataSource={this.ds.cloneWithRows(this.state.users)}
                                renderRow={data =>
                                    <View style={styles.listView}>
                                        <Text style={[styles.defaultText, { flex: 0.3 }]} numberOfLines={1}>
                                            {data.first_name} {data.last_name}
                                        </Text>
                                        <Text style={[styles.defaultText, { flex: 0.3 }]} numberOfLines={1}>
                                            {data.email}
                                        </Text>
                                        <Text style={[styles.defaultText, { flex: 0.2 }]} numberOfLines={1}>{data.role.name}</Text>
                                        <Text style={[styles.defaultText, { flex: 0.2 }]} numberOfLines={1}>{data.teams.length ? data.teams[0].name : 'n/a'}</Text>
                                    </View>}
                                renderLeftHiddenRow={data =>
                                    <Button full info onPress={_ => this.editUser(data)}>
                                        <Icon active name="md-create" />
                                    </Button>}
                                renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                                    <Button full danger onPress={_ => this.deleteUser(data, secId, rowId, rowMap)}>
                                        <Icon active name="trash" />
                                    </Button>}
                                leftOpenValue={50}
                                rightOpenValue={-50}
                            />
                        </Content>
                        <Fab style={{ backgroundColor: '#5067FF' }}
                            position="bottomRight"
                            onPress={() => { this.createUser() }}>
                            <Icon name="md-add-circle" />
                        </Fab>
                    </View>
                ) : null}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        company: state.user.company
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeHeaderTitle: (headerTitle) => {
            dispatch(changeHeaderTitle(headerTitle))
        },
        visableSideBar: () => {
            dispatch(changeSideBarInivisble(false))
        },
        fetchUser: () => {
            dispatch(fetchUser())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);
