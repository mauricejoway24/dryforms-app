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

import apiStandardStructure from '../../../../api/standard_structures'
import apiStandardMaterials from '../../../../api/standard_materials'
import {
    changeHeaderTitle,
    changeSideBarInivisble
} from '../../../../actions/shared'
import {
    handleErrorResponse
} from '../../../../service/error_handler'
import BaseComponent from '../../BaseComponent'
import styles from "./styles"

class MoistureMap extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            structures: [],
            materials: [],
            activeFabForStu: false,
            activeFabForMat: false,
        }

        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Standard Moisture Map Dropdown Management")
                this.props.visableSideBar()
                this.init()
                console.log("standard moisture map mounted")
            }),
            this.props.navigation.addListener("willBlur", () => {})
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }
    
    init() {
        this.run()
        const apis = [
            apiStandardStructure.index(),
            apiStandardMaterials.index()
        ]
        return Promise.all(apis)
            .then(response => {
                this.setState({
                    structures: response[0].data.structures,
                    materials: response[1].data.materials
                })
                this.dataReady()
                this.loaded()
            })
            .catch(error => {
                handleErrorResponse(error);
                this.dataFailed();
            })
    }

    deleteStructure(data, secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        const newData = [...this.state.structures];
        newData.splice(rowId, 1);
        apiStandardStructure.delete(data.id)
            .then((response) => {                
                this.setState({
                    structures: newData,
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

    createStructure = () => {
        NavigationService.navigate('MoistureMapEdit', {
            type: 'structure'
        })
    }

    revertToDefaultStu = () => {
        apiStandardStructure.revert()
            .then(response => {
                this.setState({
                    structures: response.data.structures
                })
            }).catch(error => {
                handleErrorResponse(error)
            })
    }

    deleteMaterial(data, secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        const newData = [...this.state.materials];
        newData.splice(rowId, 1);
        apiStandardMaterials.delete(data.id)
            .then((response) => {                
                this.setState({
                    materials: newData,
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

    createMaterial = () => {
        NavigationService.navigate('MoistureMapEdit', {
            type: 'material'
        })
    }

    revertToDefaultMat = () => {
        apiStandardMaterials.revert()
            .then(response => {
                this.setState({
                    materials: response.data.materials
                })
            }).catch(error => {
                handleErrorResponse(error)
            })
    }

    render() {
        return (
            this.state.isLoaded ? (
                <View style={{ flex: 1 }}>
                    <Content>
                        <Text style={styles.title}>Structure Dropdown Management</Text>
                        <List style={{marginTop:2, flex:1}}
                            dataSource={this.ds.cloneWithRows(this.state.structures)}
                            renderRow={data =>
                                <View style={styles.listView}>
                                    <Text style={[styles.defaultText, {flex: 1}]} numberOfLines={1}>
                                        {data.title}
                                    </Text>
                                </View>}
                            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                                <Button full danger onPress={_ => this.deleteStructure(data,secId, rowId, rowMap)}>
                                    <Icon active name="trash" />
                                </Button>}
                            leftOpenValue={0}
                            rightOpenValue={-50}
                        />

                        <Text style={[styles.title, {marginTop: 5}]}>Material Dropdown Management</Text>
                        <List style={{marginTop:2, flex:1}}
                            dataSource={this.ds.cloneWithRows(this.state.materials)}
                            renderRow={data =>
                                <View style={styles.listView}>
                                    <Text style={[styles.defaultText, {flex: 1}]} numberOfLines={1}>
                                        {data.title}
                                    </Text>
                                </View>}
                            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                                <Button full danger onPress={_ => this.deleteMaterial(data,secId, rowId, rowMap)}>
                                    <Icon active name="trash" />
                                </Button>}
                            leftOpenValue={0}
                            rightOpenValue={-50}
                        />
                    </Content>
                    <Fab style={{ backgroundColor: '#5067FF' }}
                        active={this.state.activeFabForStu}
                        direction="left"
                        position="bottomRight" 
                        onPress={() => this.setState({ activeFabForStu: !this.state.activeFabForStu })}
                        >
                        <Text>Stu</Text>
                        <Button style={{ backgroundColor: '#3B5998' }} onPress={() => this.createStructure()}>
                            <Icon name="md-add" />
                        </Button>
                        <Button style={{ backgroundColor: '#DD5144'}} onPress={() => 
                            this.revertToDefaultStu()}>
                            <Icon name="ios-mail" />
                        </Button>
                    </Fab>
                    <Fab style={{ backgroundColor: '#5067FF' }}
                        active={this.state.activeFabForMat}
                        direction="right"
                        position="bottomLeft" 
                        onPress={() => this.setState({ activeFabForMat: !this.state.activeFabForMat })}
                        >
                        <Text>Mat</Text>
                        <Button style={{ backgroundColor: '#3B5998' }} onPress={() => this.createMaterial()}>
                            <Icon name="md-add" />
                        </Button>
                        <Button style={{ backgroundColor: '#DD5144'}} onPress={() => 
                            this.revertToDefaultMat()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(MoistureMap);