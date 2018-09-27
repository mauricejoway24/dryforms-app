import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Content, Item, List, ListItem, CardItem, Body, Picker, Text, Toast, Label, Button, Fab, Icon } from 'native-base';
import { View, ListView } from 'react-native';
import { handlerErrorResponse } from '../../../../service/error_handler';
import { changeHeaderTitle, changeSideBarInivisble } from '../../../../actions/shared';
import Search from 'react-native-search-box';
import apiEquipments from '../../../../api/equipment';
import apiStatus from '../../../../api/status';
import NavigationService from '../../../../service/NavigationService';
import BaseComponent from '../../BaseComponent';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class Home extends BaseComponent {
    
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            data: [],
            pageNumber: 1,
            statuses: [
                {
                    id: "0",
                    name: "--Select--",
                    created_at: null,
                    updated_at: null
                }
            ],
            selectedStatusValue: 0
        }
        this.cellRefsMap = {};
        this.dataTableRef = null;
        this.refreshStatus = this.refreshStatus.bind(this);
    };
    
    addEquipment = () => {
        NavigationService.navigate('AddEquipment', {});
    }

    setDataSource(data) {
        this.setState({
            data: data,
        });
    }

    refreshStatus() {
        apiStatus.index()
            .then(response => {
                console.log(JSON.stringify(response.data, null, 3));
                const statuses = response.data.data;
                console.log(statuses)
                this.setState({
                    statuses: [...this.state.statuses, ...statuses]
                });
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 3));
            })
    }

    refreshData() {
        apiEquipments.pageNumber(this.state.pageNumber)
            .then(response => {
                console.log(response.data.data);
                console.log("Type of data is", typeof(response.data.data));
                const data = JSON.parse(JSON.stringify(response.data.data));
                const renderarray = [];
                data.forEach(function(obj) {
                    if (obj.model !== null) {
                        const category = (obj.model.category === null) ? "N/A": obj.model.category.name;
                        const makeModel = (obj.model.name === null) ? "N/A": obj.model.name;
                        const status = (obj.status.name === null) ? "N/A": obj.status.name;
                        const total = obj.model.total.toString();
                        const renderobj = {
                            Category: category,
                            Model: makeModel,
                            Status: status,
                            Total: total 
                        };
                        renderarray.push(renderobj);
                    }
                });
                console.log("Data in array: ", renderarray);
                this.setDataSource(renderarray);
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 3));
            }
         )
    }

    componentDidMount(){
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Manage your Inventory");
                this.props.visableSideBar();
                this.refreshData();
                this.refreshStatus();
                console.log("Equipments home mounted");
            }),
            this.props.navigation.addListener("willBlur", () => {

            })
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }



   // renderSingleData (rowData) {
   //  return (
   //         <ListItem key={rowData.id}>
   //             <Text>
   //                 {(rowData.model === null) ? "Nothing here" : rowData.model.name}
   //             </Text>
   //         </ListItem>
   //     );
   // }

    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return (
            <Container>
                <View styles={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>

                <Search
                    ref="catgory_search"
                    placeholder="Categories"
                    afterFocus={() => {
                        console.log("After focus");
                    }}
                    onChangeText={text => {
                        console.log(text)
                        var newdata = [];
                        this.state.data.forEach(cat => {
                            console.log(typeof(cat.Category));
                            if (String(cat.Category).includes(text)){
                                console.log("Match found", cat.Category)
                                newdata.push(cat);
                            }
                        });
                        if (newdata.length > 0) {
                            console.log(newdata)
                            this.setDataSource(newdata);
                        }
                    }}
                    onCancel={ () => {
                        this.refreshData();
                    }}
                 />

                 <Search
                    ref="model_search"
                    placeholder="Make/Model"
                    afterFocus={() => {
                        console.log("After focus");
                    }}
                    onChangeText={text => {
                        console.log(text);
                        var newdata = [];
                        this.state.data.forEach(mode => {
                            console.log(mode.Model);
                            if (String(mode.Model).includes(text)) {
                                console.log("Match found",  mode);
                                newdata.push(mode);
                            }
                        })
                        if (newdata.length > 0) {
                            console.log(newdata);
                            this.setDataSource(newdata);
                        }
                    }}
                 />

                    <Picker 
                        mode="dropdown"
                        placeholder="page number"
                        placeholderStyle={{ color: "#2874F0" }}
                        note={false}
                        selectedValue={String(this.state.pageNumber)}
                        onValueChange={value => {
                            console.log("Value change", value);
                            this.setState({
                                pageNumber: Number(value)
                            }, () => {
                                this.refreshData();
                            });
                        }}
                    >

                        <Picker.Item label="page 1" value="1" />
                        <Picker.Item label="page 2" value="2" />
                        <Picker.Item label="page 3" value="3" />
                        <Picker.Item label="page 4" value="4" />
                        <Picker.Item label="page 5" value="5" />
                    </Picker>
                </View>

                <Content padder>
                 <List>
                    { 
                        (this.state.data.length > 0)
                        ?
                        this.state.data.map((ds) => {
                            return (
                                <CardItem style={{
                                    margin: 5
                                }}>
                                    <Body>
                                        <Item regular style={{
                                            margin: 2,
                                            padding: 5
                                        }}>
                                            <Label>
                                                Category : 
                                            </Label>
                                            <Text>
                                                {ds.Category}
                                            </Text>
                                        </Item>
                                        <Item regular style={{
                                            margin: 2,
                                            padding: 5
                                        }}>
                                            <Label>
                                                Make/Model :
                                            </Label>
                                            <Text>
                                                {ds.Model}
                                            </Text>
                                        </Item>

                                        <Item picker style={{
                                            margin: 2,
                                            padding: 5
                                        }}>
                                            <Label>
                                                Status :
                                            </Label>
                                            <Picker
                                                mode="dropdown"
                                                iosIcon={
                                                    <Icon name="ios-arrow-down-outline" /> 
                                                }
                                                style={{
                                                    width: undefined
                                                }}
                                                placeholder="Select status"
                                                placeHolderStyle={{ color: "#bfc6ea"  }}
                                                placeHolderIconColor="#007aff"
                                                selectedValue={this.state.selectedStatusValue}
                                                onValueChange={(value) => {
                                                    console.log("Adding value", value);
                                                //    this.props.navigation.navigate('Add', {
                                                //        selectedValue: value,
                                                //        data: ds
                                                //   })
                                                }}
                                            >
                                            {
                                                (this.state.statuses.length > 0)
                                                ?
                                                    this.state.statuses.map(status => {
                                                        return (<Picker.Item label={status.name} value={status.id} />)
                                                })
                                                : null
                                            }
                                            </Picker>
                                        </Item>

                                        <Item regular style={{
                                            margin: 2,
                                            padding: 5
                                        }}>
                                            <Label>
                                                Total: 
                                            </Label>
                                            <Text>
                                                {ds.Total}
                                            </Text>
                                        </Item>
                                    </Body>
                                </CardItem>
                            );
                        })
                        : null
                    }
                 </List>
                </Content>
                 <Fab
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => {
                        this.props.navigation.navigate('Add');
                    }}>
                    <Icon name="add"/>
                </Fab>
            </Container>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        changeHeaderTitle: (headerTitle) => {
            dispatch(changeHeaderTitle(headerTitle))
        },
        visableSideBar: () => {
            dispatch(changeSideBarInivisble(false))
        }
    }
}

export default connect(undefined, mapDispatchToProps)(Home);
