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

import apiTeams from '../../../../api/teams'
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

class Teams extends Component {
    constructor(props) {
        super(props)
        this.state = {
            teams: [],
            isLoaded: false
        }
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Manage Your Teams")
                this.props.visableSideBar()
                this.initData()
                console.log("teams mounted")
            }),
            this.props.navigation.addListener("willBlur", () => {})
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    initData() {
        const apis = [
            apiTeams.index(),
        ]
        return Promise.all(apis)
            .then(response => {
                this.setState({
                    teams: response[0].data.data.map(item => {
                        item.value = item.id
                        item.text = item.name
                        return item
                    }),
                    isLoaded: true
                })
            })
    }

    deleteTeam(data, secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        const newData = [...this.state.teams];
        newData.splice(rowId, 1);
        this.setState({
            teams: newData
        });
        apiTeams.delete(data.id)
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

    editTeam = (data) => {
        NavigationService.navigate('TeamEdit', {
            team: data
        })
    }

    createTeam = () => {
        NavigationService.navigate('TeamEdit', {
            team: {
                id: null
            }
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
            { this.state.isLoaded ? (
                <View style={{ flex: 1 }}>
                    <Content>
                        <List style={{marginTop:10, flex:1}}
                            dataSource={this.ds.cloneWithRows(this.state.teams)}
                            renderRow={data =>
                                <View style={styles.listView}>
                                    <Text style={[styles.defaultText, {flex: 1}]} numberOfLines={1}>
                                        {data.name}
                                    </Text>
                                </View>}
                            renderLeftHiddenRow={data =>
                                <Button full info onPress={_ => this.editTeam(data)}>
                                    <Icon active name="md-create" />
                                </Button>}
                            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                                <Button full danger onPress={_ => this.deleteTeam(data,secId, rowId, rowMap)}>
                                    <Icon active name="trash" />
                                </Button>}
                            leftOpenValue={50}
                            rightOpenValue={-50}
                        />
                    </Content>                
                    <Fab style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => {this.createTeam()}}>
                    <Icon name="md-add-circle" />
                </Fab>
                </View>
            ) : null }
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

export default connect(mapStateToProps, mapDispatchToProps)(Teams);