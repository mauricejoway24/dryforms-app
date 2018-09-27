import React from 'react';
import {
    connect
} from 'react-redux';
import {
    Content,
    List,
    Icon,
    Button,
    Text,
    Fab,
    Toast
} from "native-base";
import {
    ListView,
    View
} from 'react-native';
import _ from 'lodash'
import NavigationService from '../../../../service/NavigationService';

import apiStandardArea from '../../../../api/standard_area'
import {
    changeHeaderTitle,
    changeSideBarInivisble
} from '../../../../actions/shared'
import {
    handleErrorResponse
} from '../../../../service/error_handler'
import BaseComponent from '../../BaseComponent'
import styles from "./styles"

class AffectedAreas extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            areas: [],
            activeFab: false
        }

        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Standard Affected Areas Management")
                this.props.visableSideBar()
                this.init()
                console.log("affect area mounted")
            }),
            this.props.navigation.addListener("willBlur", () => {})
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }
    
    init() {
        this.run()
        apiStandardArea.index()
            .then((response) => {
                this.setState({
                    areas: response.data.areas
                })
                this.dataReady()
                this.loaded()
            })
            .catch(error => {
                handleErrorResponse(error);
                this.dataFailed();
            })
    }

    deleteArea(data, secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        const newData = [...this.state.areas];
        newData.splice(rowId, 1);
        apiStandardArea.delete(data.id)
            .then((response) => {                
                this.setState({
                    areas: newData,
                });
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

    createArea = () => {
        NavigationService.navigate('AffectedAreaEdit')
    }

    revertToDefault = () => {
        apiStandardArea.restore()
            .then(response => {
                this.init()
            }).catch(error => {
                handleErrorResponse(error)
            })
    }

    render() {
        return (
            this.state.isLoaded ? (
                <View style={{ flex: 1 }}>
                    <Content>
                        <List style={{marginTop:10, flex:1}}
                            dataSource={this.ds.cloneWithRows(this.state.areas)}
                            renderRow={data =>
                                <View style={styles.listView}>
                                    <Text style={[styles.defaultText, {flex: 1}]} numberOfLines={1}>
                                        {data.title}
                                    </Text>
                                </View>}
                            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                                <Button full danger onPress={_ => this.deleteArea(data,secId, rowId, rowMap)}>
                                    <Icon active name="trash" />
                                </Button>}
                            leftOpenValue={0}
                            rightOpenValue={-50}
                        />
                    </Content>                
                    <Fab style={{ backgroundColor: '#5067FF' }}
                        active={this.state.activeFab}
                        direction="left"
                        position="bottomRight" 
                        onPress={() => this.setState({ activeFab: !this.state.activeFab })}
                        >
                        <Icon name="settings" />
                        <Button style={{ backgroundColor: '#3B5998' }} onPress={() => this.createArea()}>
                            <Icon name="md-add" />
                        </Button>
                        <Button style={{ backgroundColor: '#DD5144'}} onPress={() => 
                            this.revertToDefault()}>
                            <Icon name="ios-mail" />
                        </Button>
                    </Fab>
                </View>
            ) : null
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(AffectedAreas);