import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Content,Form, View, Icon, Picker, Input, Label, Item,  Button, Text, CheckBox, Body} from 'native-base';
import {handleErrorResponse} from '../../../../service/error_handler';
import {changeHeaderTitle, changeSideBarInivisble} from '../../../../actions/shared';
import NavigationService from '../../../../service/NavigationService';
import apiStatus from '../../../../api/status';
import apiteams from '../../../../api/teams';
import apicategory from '../../../../api/categories';
import apimodels from '../../../../api/models';
import BaseComponent from '../../BaseComponent';
import apiequipment from '../../../../api/equipment';

class EquipmentAdd extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            teams: [{
                id: 0,
                name: "--Select--",
                company_id: 0,
            }],
            statuses: [{
                id: 0,
                name: "--Select--",
                created_at: null,
                updated_at: null
            }],
            categories: [{
                id: 0,
                name: "--Select--",
                prefix: "",
                description: null,
                company_id: 0
            }],
            models: [{
                id: 0,
                name: "--Select--"
            }],
            newcategory: "",
            newprefix: "",
            newmodel: "",
            quantity: "1",
            automatic: true,
            selectedCategoryValue: "0",
            selectedModelValue: "0",
            selectedTeamValue: "0",
            selectedStatusValue: "0",
        }
        this.refreshData = this.refreshData.bind(this);
        this.refreshModel = this.refreshModel.bind(this);
        this.categoryDropDownChange = this.categoryDropDownChange.bind(this);
        this.modelDropDownChange = this.modelDropDownChange.bind(this);
        this.teamDropDownChange = this.teamDropDownChange.bind(this);
        this.statusDropDownChange  = this.statusDropDownChange.bind(this);
        this.changeCheckBoxState = this.changeCheckBoxState.bind(this);
        this.postEquipment = this.postEquipment.bind(this);
    }

    postEquipment() {
        const postingData = {
            category_id: this.state.selectedCategoryValue,
            status_id: this.state.selectedStatusValue,
            model_id: this.state.selectedModelValue,
            team_id: this.state.selectedTeamValue,
            quantity: this.state.quantity,
            serial: "12 sd",
            company_id: "2"
        };

        apiequipment.store(postingData)
            .then(response => {
                this.props.navigation.goBack();
                console.log(JSON.stringify(response.data, null, 3));
            })
            .catch(err => {
                console.log("Error", JSON.stringify(err, null, 3));
            })
    }

    refreshData() {
        Promise.all([
            apicategory.index(),
            apiStatus.index(),
            apiteams.index(),
        ])
        .then(result => {
            console.log("Categories", JSON.stringify(result[0].data.data, null, 3));
            const categories = result[0].data.data;
            console.log("Statuses", JSON.stringify(result[1].data.data, null, 3));
            console.log("Teams", JSON.stringify(result[2].data.data, null, 3));
            const statuses = result[1].data.data;
            const teams = result[2].data.data;
            this.setState({
                categories: [...this.state.categories, ...categories],
                statuses: [...this.state.statuses, ...statuses],
                teams: [...this.state.teams, ...teams]
            });
           // this.setState({
           //     categories: catgories,
           //     teams: teams,
           //     statuses: statuses
           // });
        })
        .catch(err => {
            console.log(JSON.stringify(err, null, 3));
        })
    };

    refreshModel() {
        apimodels.category_based(this.state.selectedCategoryValue)
            .then(response => {
                this.setState({
                    models: [...response.data.data, ...models]
                })
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 3));
            });
    }

    componentDidMount() {
       this.subs = [
           this.props.navigation.addListener("didFocus", () => {
               this.props.changeHeaderTitle("Add new Equipment");
               this.props.visableSideBar();
               this.refreshData();
               console.log("Equipments add mounted");
           }),
           this.props.navigation.addListener("willBlur", () => {
           })
       ] 
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    categoryDropDownChange(value){
        console.log(value)
        this.setState({
            selectedCategoryValue: value
        }, () => {
            this.refreshModel();
        });
    } 

    modelDropDownChange(value) {
        console.log(value);
        this.setState({
            selectedModelValue: value
        });
    }

    teamDropDownChange(value) {
        console.log(value);
        this.setState({
            selectedTeamValue: value
        });
    }

    statusDropDownChange(value) {
        console.log(value);
        this.setState({
            selectedStatusValue: value
        });
    }

    changeCheckBoxState () {
        this.setState( prevState => ({
            automatic: !prevState.automatic
        }));
    }

    render() {
        return(
            <Container>
                <Content padder>
                    <Form>
                        <Item picker>
                            <Item>
                                <Label>
                                    Select category
                                </Label>
                            </Item>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                style={{
                                    width: undefined
                                }}
                                placeHolder="Select category"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selectedCategoryValue}
                                onValueChange={(value) => {
                                    this.setState({
                                        selectedCategoryValue: value
                                    }, this.refreshModel());
                                }}
                            >
                        
                            {
                                 (this.state.categories.length > 0) ?
                                    this.state.categories.map(category => {
                                        return <Picker.Item label={category.name} value={category.id} />
                                    })
                                    :
                                    null
                            }
                            </Picker>
                        </Item>
                        <Item inlineLabel>
                            <Input placeholder="Category :" value={this.state.newcategory} onChangeText={(value) => {
                                this.setState({
                                    newcategory: value
                                })
                            }} />
                        </Item>   

                        <Item inlineLabel>
                            <Input placeholder="Prefix :" value={this.state.newprefix} onChangeText={(value) => {
                                this.setState({
                                    newprefix: value
                                });
                            }}/>
                        </Item>

                        <Item picker>
                            <Label>
                               Select Make/Model
                            </Label>
                             <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                style={{
                                    width: undefined
                                }}
                                placeHolder="Select Make/Model"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selectedModelValue}
                                onValueChange={(value) => {
                                    this.setState({
                                        selectedModelValue: value
                                    })
                                }}
                            >
                             {
                                 (this.state.models.length > 0) 
                                    ? this.state.models.map(model => {
                                        return <Picker.Item label={model.name} value={model.id} />
                                    })
                                    : null
                             }
                           </Picker>
                        </Item>
                        <Item inlineLabel>
                            <Input placeholder="Add new make / model :" value={this.state.newmodel} onChangeText={(value) => {
                                    this.setState({
                                        newmodel: value
                                    })
                            }} />
                        </Item>

                        <Item>
                            <Label>
                                Crew/Team
                            </Label>
                        </Item>

                        
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                style={{
                                    width: undefined
                                }}
                                placeHolder="Select Team"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selectedTeamValue}
                                onValueChange={(value) => {
                                    console.log("Team", value);
                                    this.setState({
                                        selectedTeamValue: value
                                    });
                                }}
                            >
                                {
                                    (this.state.teams.length > 0) 
                                    ? this.state.teams.map(team => {
                                        return <Picker.Item label={team.name} value={team.id} />
                                    })
                                    : null
                                }
                            </Picker>
                        </Item>

                        <Item>
                            <Label>
                                Statuses
                            </Label>
                        </Item>

                        
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                style={{
                                    width: undefined
                                }}
                                placeHolder="Select Status"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selectedStatusValue}
                                onValueChange={(value) => {
                                    this.setState({
                                        selectedStatusValue: value 
                                    })
                                }}
                            >
                                {
                                    (this.state.statuses.length > 0) 
                                    ? this.state.statuses.map(status => {
                                        return <Picker.Item label={status.name} value={status.id} />
                                    })
                                    : null
                                }
                            </Picker>
                        </Item>
                        <Item inlineLabel>
                            <Label>
                                Quantity :
                            </Label>
                            <Input value={this.state.quantity} onChangeText={(value) => {
                                this.setState({
                                    quantity: value
                                })
                            }} />
                        </Item>
                        <Item>
                             <CheckBox checked={this.state.automatic} onPress={ () => {
                                 this.changeCheckBoxState();
                             }} style={{
                                 margin: 15,
                             }} />

                        <Item style={{
                            margin: 15,
                            padding: 5
                        }}>
                            <Label>
                                Add equipments numbers automatically
                            </Label>
                        </Item>
                        </Item>
                    </Form>
                    <Button full primary onPress={this.postEquipment}>
                        <Text>
                            Submit
                        </Text>
                    </Button>

                    <Button full warning onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <Text>
                            Cancel
                        </Text>
                    </Button>
                </Content>
            </Container>
        )
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changeHeaderTitle: (headerTitle) => {
            dispatch(changeHeaderTitle(headerTitle))
        },
        visableSideBar: () => {
            dispatch(changeSideBarInivisble(false))
        },
    }
}

export default connect(undefined, mapDispatchToProps)(EquipmentAdd);
