import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Content,Form, Item, Input, List, Left, Title,Icon, ListItem, CardItem,SwipeRow, Body, Picker, Text, Toast, Label, Button, Fab} from 'native-base';
import { View, TouchableOpacity, Modal} from 'react-native';
import {handlerErrorResponse} from '../../../../service/error_handler';
import {changeHeaderTitle, changeSideBarInivisble} from '../../../../actions/shared';
import Search from 'react-native-search-box';
import apiCategory from '../../../../api/categories';
import NavigationService from '../../../../service/NavigationService';
import Dialog from "react-native-dialog";

class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pageNumber: 1,
            selectedDeleteId: 0,
            deleteDialogvisible: false,
            isOpen: false, 
            isDisabled: false,
            swipeToClose: false,
            modelOpen: false,
            modalId: 0,
            existingCategory: "",
            existingPrefix: "",
            description: null,
            company_id: 0,
            addModalVisible: false,
            addModalName: "",
            addModalPrefix: ""
        }
        this.cellRefsMap = {};
        this.dataTableRef = null;
        this.handleCancel = this.handleCancel.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.showAddModal = this.showAddModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeAddModal = this.closeAddModal.bind(this);
        this.modalAddNameChange = this.modalAddNameChange.bind(this);
        this.modelNameChange = this.modelNameChange.bind(this);
        this.modalAddPrefixChange = this.modalAddPrefixChange.bind(this);
        this.modelPrefixChange = this.modelPrefixChange.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.addStatus = this.addStatus.bind(this);
    }

    showModal(rowData) {
        this.refreshStatus(rowData.id);
    }

    showAddModal(rowData) {
        this.setState({
            addModalVisible: true
        });
    }
 
    closeAddModal() {
        this.setState({
            addModalVisible: false
        });
    }

    closeModal() {
        this.setState({
            modelOpen: false
        });
    }

    modalAddNameChange(data) {
        console.log(data);
        this.setState({
            addModalName: data
        });
    }

    modalAddPrefixChange(data) {
        console.log(data);
        this.setState({
            addModalPrefix: data
        })
    }

    modelNameChange(data) {
        console.log(data)
        this.setState({
            existingCategory: data
        });
    }

    modelPrefixChange(data) {
        console.log(data)
        this.setState({
            existingPrefix: data
        });
    }

    addStatus() {
        var dataBody = {
            name: this.state.addModalName,
            prefix: this.state.addModalPrefix,
            description: null
        }
        apiCategory.store(dataBody)
            .then(response => {
                this.closeAddModal();
                this.refreshData();
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 3));
            })
    }

    updateStatus () {
        var dataBody = {
            name: this.state.existingCategory,
            prefix: this.state.existingPrefix,
            description: this.state.description,
            company_id: this.state.company_id
        };

        apiCategory.patch(this.state.modalId, dataBody)
            .then(response => {
                this.closeModal();
                this.refreshData();
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 3));
            })
    }

    handleCancel () {
        this.setState({deleteDialogvisible: false})
    }

    handleConfirm () {
        console.log("Delete this id : ", this.state.selectedDeleteId);
        this.setState({deleteDialogvisible: false});
        apiCategory.delete(this.state.selectedDeleteId)
            .then(response => {
                console.log(JSON.stringify(response.data, null, 3));
                this.refreshData();
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 3));
            })
    }

    showDialog (rowData) {
        console.log(rowData);
        this.setState({
            selectedDeleteId: rowData.id,
            deleteDialogvisible: true
        })
       // this.setState({
       //     selectedDeleteId: id,
       //     deleteDialogvisible: true
       // });
    }

    setDataSource(data) {
        this.setState({
            data: data,
        });
    }


    refreshStatus(id) {
        apiCategory.show(id)
            .then(response => {
                console.log("Working");
                console.log(JSON.stringify(response.data, null, 3));
                //console.log(JSON.stringify(response.data, null, 3));
                const {name, prefix, description, company_id} = response.data;
                this.setState({         
                    modelOpen: true,
                    modalId: id,
                    existingCategory: name,
                    existingPrefix: prefix,
                    description: description,
                    company_id: company_id
                });
            })
            .catch(err =>  {
                console.log(JSON.stringify(err, null, 3));
            });
    }

    refreshData() {
        apiCategory.pageNumberIndex(this.state.pageNumber)
            .then(response => {
                console.log(JSON.stringify(response.data.data, null, 3));
                const data = JSON.parse(JSON.stringify(response.data.data));
                const renderarray = [];
                data.forEach(obj => {
                    if (obj !== null) {
                        const id = obj.id;
                        const name = obj.name;
                        const prefix = obj.prefix;
                        const categoryrow = {
                            id: id,
                            Name: name,
                            Prefix: prefix,
                            Action: "placeholder"
                        }
                        renderarray.push(categoryrow);
                    }
                });
                console.log("Data in array: ", renderarray);
                this.setDataSource(renderarray);
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 3));
            });
    };


    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Manage inventory categories");
                this.props.visableSideBar();
                this.refreshData();
                console.log("Equipments Categories mounted")
            }),
            this.props.navigation.addListener("willBlur",  () => {

            })
        ]
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    render() {
        return(
            <Container>
                <View>
                    <Search
                        ref="filter_box"
                        shadowVisible={true}
                        placeholder="Categories"
                        afterFocus={() => {
                            console.log("after focus");
                        }}
                        onChangeText={text => {
                            console.log(text);
                            var newdata = [];
                            this.state.data.forEach(cat => {
                                console.log(cat.Name);
                                if (String(cat.Name).includes(text)) {
                                    console.log("Match found", cat.Name);
                                    newdata.push(cat);
                                }
                            })
                            if (newdata.length > 0) {
                                console.log(newdata);
                                this.setDataSource(newdata);
                            }
                        }}
                        onCancel={() => {
                            this.refreshData();
                        }}
                    />
                    <Picker
                        mode="dropdown"
                        placeholder="page number"
                        placeholderStyle={{color: "#2874F0"}}
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
                                    <Content>
                                    <SwipeRow
                                        leftOpenValue={75}
                                        rightOpenValue={-75}
                                        left={
                                            <Button success onPress={() => {
                                                this.showModal(ds);
                                            }}>
                                                <Icon name="create" />
                                            </Button>
                                        }
                                        body={
                                            <CardItem style={{
                                                margin: 8,
                                                width: "100 %"
                                            }}>
                                                <Body>
                                                    <Item regular style={{
                                                        margin: 2,
                                                    }}>
                                                        <Label>
                                                            Name :
                                                        </Label>
                                                        <Text>
                                                            {ds.Name}
                                                        </Text>
                                                    </Item>
                                                    <Item regular style={{
                                                        margin: 2,
                                                    }}>
                                                        <Label>
                                                            Prefix :
                                                        </Label>
                                                        <Text>
                                                            {ds.Prefix}
                                                        </Text>
                                                    </Item>
                                                </Body>
                                            </CardItem>
                                        }
                                        right={
                                            <Button danger onPress={() => {
                                                this.showDialog(ds);
                                            }}>
                                                <Icon active name="trash" />
                                            </Button>
                                        }
                                    />
                                    </Content>
                                )
                            })
                            : null
                        }
                    </List>
                </Content>

                <Dialog.Container visible={this.state.deleteDialogvisible}>
                    <Dialog.Title>Delete Category Confirmation</Dialog.Title>
                    <Dialog.Description>
                        Are you sure ?
                    </Dialog.Description>
                    <Dialog.Button label="Confirm" onPress={this.handleConfirm} />
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                </Dialog.Container>
                <Modal
                    visible={this.state.modelOpen}
                    transparent={false}
                    animationType={"slide"}
                    onRequestClose={this.closeModal}
                >
                    <View>
                    <View>
                        <Title>
                            Edit category
                        </Title>
                    </View>
                    <Form>
                        <Item stackedLabel>
                            <Label>
                            Name 
                            </Label>
                            <Input value={this.state.existingCategory} onChangeText={this.modelNameChange}/>
                        </Item>

                        <Item stackedLabel last>
                            <Label>
                            Prefix
                            </Label>
                            <Input value={this.state.existingPrefix} onChangeText={this.modelPrefixChange}/>
                        </Item>

                    </Form>

                    <Button full style={{
                        margin: 5
                    }} onPress={this.updateStatus}>
                        <Text>Ok</Text>
                    </Button>

                    <Button warning full style={{
                        margin: 5
                    }} onPress={this.closeModal}>
                        <Text>Cancel</Text>
                    </Button>
                 </View>
                 </Modal>

                <Modal
                    visible={this.state.addModalVisible}
                    transparent={false}
                    animationType={"slide"}
                    onRequestClose={this.closeAddModal}
                >
                    <View>
                    <View>
                        <Title>
                            Add category
                        </Title>
                    </View>
                    <Form>
                        <Item stackedLabel>
                            <Label>
                            Name 
                            </Label>
                            <Input value={this.state.addModalName} onChangeText={this.modalAddNameChange}/>
                        </Item>

                        <Item stackedLabel last>
                            <Label>
                            Prefix
                            </Label>
                            <Input value={this.state.addModalPrefix} onChangeText={this.modalAddPrefixChange}/>
                        </Item>

                    </Form>

                    <Button full style={{
                        margin: 5
                    }} onPress={this.addStatus}>
                        <Text>Ok</Text>
                    </Button>

                    <Button warning full style={{
                        margin: 5
                    }} onPress={this.closeAddModal}>
                        <Text>Cancel</Text>
                    </Button>
                 </View>
                 </Modal>
                 <Fab
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={this.showAddModal}>
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
        },
    }
}

export default connect(undefined, mapDispatchToProps)(Categories);
