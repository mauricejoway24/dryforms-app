import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Content, Body, List, Button, Form, Title, Item, Label,Input, ListItem, CardItem, SwipeRow, Text, Left, Right, Picker, Icon, Fab} from 'native-base';
import {View, Modal} from 'react-native';
import {handleErrorResponse} from '../../../../service/error_handler';
import {changeHeaderTitle, changeSideBarInivisble} from '../../../../actions/shared';
import Search from 'react-native-search-box';
import apiModels from '../../../../api/models';
import apiCategory from '../../../../api/categories';
import NavigationService from '../../../../service/NavigationService';
import Dialog from "react-native-dialog";

class Models extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: [], 
            pagenumber: 1,
            selectedDeleteId: 0,
            deleteDialogvisible: false,
            modalOpen: false,
            addModalOpen: false,
            modalId: 0,
            existingModel: "",
            addnewModel: "",
            categories: [],
            addmodalcateegories: [],
            selectedCategory: "",
            selectedCategoryAdd: "",
            category_id: 0,
            addcategory_id: 0,
            total: 0,
            description: null,
            company_id: 0
        }
        this.cellRefsMap = {};
        this.dataTableRef = null;
        this.handleCancel = this.handleCancel.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.showModal = this.showModal.bind(this);
        this.showAddModal = this.showAddModal.bind(this);
        this.closeAddModal = this.closeAddModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.modalNameChange = this.modalNameChange.bind(this);
        this.modalAddNameChange = this.modalAddNameChange.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.addStatus = this.addStatus.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onAddValueChange = this.onAddValueChange.bind(this);
    };

    showModal(rowData) {
        this.refreshStatus(rowData.id);
    }
    
    showAddModal() {
        this.setState({
            addModalOpen: true
        })
    }

    closeModal() {
        this.setState({
            modalOpen: false
        });
    }

    closeAddModal() {
        this.setState({
            addModalOpen: false
        })
    }

    modalNameChange(data) {
        console.log(data);
        this.setState({
            existingModel: data
        });
    }

    modalAddNameChange(data) {
        console.log(data);
        this.setState({
            addnewModel: data
        })
    }

    addStatus() {
        console.log("Time to add new status");
        var dataBody = {
            name: this.state.addnewModel,
            category_id: this.state.addcategory_id,
            total: 1,
            description: null,
            company_id: this.state.categories[0].company_id
        };

        console.log(JSON.stringify(dataBody, null, 3));

        apiModels.store(dataBody)
            .then(response => {
                this.setState({
                    addnewModel: ""
                });
                this.closeAddModal();
                this.refreshData();
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 3));
            });
    }

    updateStatus() {
        console.log("Time for updating status");
        var dataBody = {
            name: this.state.existingModel,
            category_id: this.state.category_id,
            total: this.state.total,
            description: this.state.description,
            company_id: this.state.company_id
        };

        console.log("this is modal id", this.state.modalId);
        console.log("this is a dataBody",  JSON.stringify(dataBody, null, 3));
        apiModels.patch(this.state.modalId, dataBody)
            .then(response => {
                console.log(JSON.stringify(response.data, null, 3));
                this.closeModal();
                this.refreshData();
            })
            .catch(err => {
                console.log(JSON.strigify(err, null, 3));
            });
    }

    handleCancel() {
        this.setState({
            deleteDialogvisible: false
        });
    }

    handleConfirm () {
        console.log("Delete this id: ", this.state.selectedDeleteId);
        this.setState({deleteDialogvisible: false});
        apiModels.delete(this.state.selectedDeleteId)
            .then(response => {
                console.log(JSON.stringify(response.data, null, 3));
                this.refreshData();
            })
            .catch(err => {
                console.log(JSON.stringify(err,  null, 3));
            });
    }

    showDialog(rowData) {
        console.log(rowData);
        this.setState({
            selectedDeleteId: rowData.id,
            deleteDialogvisible: true
        });
    }

   /* renderRow(rowData) {
        const cells = [];
        if (this.state.data && this.state.data.length > 0) {
            const firstObject = this.state.data[0];
            for (const [key] of Object.entries(firstObject)) {
                let itemString = (rowData[key] === null) ? "N/A": rowData[key].toString();
                console.log("Item String", itemString);
                if (key !== "id") {
                    (itemString === "placeholder")
                    ?
                        cells.push(
                            <Cell
                            key={key}
                            width={1}
                            >
                            <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }} 
                            >
                            <Button info onPress={() => {
                                this.showModal(rowData);
                            }}>
                                <Icon name="create" />
                            </Button>
                            <Button danger onPress={() => {
                                this.showDialog(rowData);
                            }}>
                                <Icon name="trash" />
                            </Button>
                            </View>
                            </Cell>
                    )
                :
                    cells.push(
                        <Cell
                            key={key}
                            width={1}>
                            {(typeof(itemString) === Object) ? itemString.name: itemString}
                            </Cell>
                    )
                }
            }
        }
        return (
            <Row>
                {cells}
            </Row>
        );
    }*/

    setDataSource(data, categories) {
        this.setState({
            data: data,
            categories: categories,
            addmodalcategories: categories
        });
    }

    refreshStatus(id) {
        apiModels.show(id)
            .then(response => {
                console.log("Working");
                console.log(JSON.stringify(response.data, null, 3));
                const {category_id, name, description, total, company_id} = response.data;
                this.setState({
                    modalOpen: true,
                    modalId: id,
                    existingModel: name,
                    category_id: category_id,
                    description: description,
                    total: total,
                    company_id: company_id
                });
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 3));
            });
    }


    refreshData() {
        apiModels.pageNumberIndexed(this.state.pagenumber)
            .then(response => {
                console.log(JSON.stringify(response.data.data, null, 3));
                const data = JSON.parse(JSON.stringify(response.data.data));
                const renderarray = [];
                data.forEach(obj => {
                    if (obj !== null) {
                        const name = (obj.name === null) ? "N/A" : obj.name;
                        const category = (obj.category === null) ? "N/A": obj.category.name;
                        const id = (obj.id === null) ? "N/A": obj.id;
                        const row = {
                            id,
                            Name: name,
                            Category: category,
                            Action: "placeholder",
                        }
                        renderarray.push(row);
                    }
                });
                console.log("data in array: ", renderarray);
                apiCategory.pageNumberIndex(1)
                    .then(response => {
                        const data = JSON.parse(JSON.stringify(response.data.data));
                        this.setDataSource(renderarray, data);
                    }).catch(err => {
                        console.log(JSON.stringify(err, null, 3));
                    })
               // this.setDataSource(renderarray);
            })
            .catch(err => {
                console.log(JSON.stringify(err, nulll, 3));
            });
    }

    componentDidMount() {

        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Manage inventory models");
                this.props.visableSideBar();
                this.refreshData();
                console.log("Equipments Models mounted");
            }),
            this.props.navigation.addListener("willBlur",  () => {

            })
        ]
    }

    onValueChange(data) {
        this.setState({
            category_id: data
        });
    }

    onAddValueChange(data) {
        this.setState({
            addcategory_id: data
        });
    }

    componentWillUnmount(){
        this.subs.forEach(sub => sub.remove());
    }

    render() {
        return(
            <Container>
                <View>
                    <Search
                        ref="filter_box"
                        shadowVisible={true}
                        placeHolder="Models"
                        afterFocus={() => {
                            console.log("After focus");
                        }}
                        onChangeText={text => {
                            console.log(text);
                            var newdata = [];
                            this.state.data.forEach(mode => {
                                console.log(mode.Name);
                                if (String(mode.Name).includes(text)) {
                                    console.log("Match found", mode.Name);
                                    newdata.push(mode);
                                }
                            });
                            if (newdata.length > 0) {
                                console.log(newdata);
                                this.setState({
                                    data: newdata
                                })
                            }
                        }}
                        onCancel={() => {
                            this.refreshData();
                        }}
                    />
                    <Picker
                        mode="dropdown"
                        placeholder="page number"
                        placeHolderStyle={{color: "#2874F0"}}
                        note={false}
                        selectedValue={String(this.state.pagenumber)}
                        onValueChange={value => {
                            console.log("Value change", value);
                            this.setState({
                                pagenumber: Number(value)
                            })
                        }, () => {
                            this.refreshData();
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
                            this.state.data.map(ds => {
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
                                                    margin: 5
                                                }}>
                                                    <Body>
                                                        <Item regular style={{
                                                            margin: 2,
                                                            padding: 5
                                                        }}
                                                        >
                                                        <Label>
                                                            Name :
                                                        </Label>
                                                        <Text>
                                                            {ds.Name}
                                                        </Text>
                                                        </Item>
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
                                );
                         })
                        :  null
                        }

                    </List>
                </Content>
                <Dialog.Container visible={this.state.deleteDialogvisible}>
                    <Dialog.Title>Delete Model Confirmation </Dialog.Title>
                    <Dialog.Description>
                        Are you sure ?
                    </Dialog.Description>
                    <Dialog.Button label="Confirm" onPress={this.handleConfirm} />
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />   
                </Dialog.Container>

                <Modal
                    visible={this.state.addModalOpen}
                    transparent={false}
                    animationType={"slide"}
                    onRequestClose={this.closeAddModal}>
                    <View>
                        <View>
                            <Title>
                                Add new model
                            </Title>
                        </View>
                        <Form>
                        <Item stackedLabel>
                                <Label>
                                    Name
                                </Label>
                                <Input value={this.state.addnewModel} onChangeText={this.modalAddNameChange} />
                            </Item>
                            <Item>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                placeHolder="Select category"
                                placeHolderStyle={{color: "#bfc6ea"}}
                                placeHolderIconColor="#007aff"
                                style={{width: undefined}}
                                selectedValue={this.state.addcategory_id}
                                onValueChange={this.onAddValueChange}
                            >

                            {
                               (this.state.categories.length > 0)
                               ?
                                this.state.addmodalcategories.map((category) => {
                                   console.log("Category", JSON.stringify(category, null, 3));
                                   console.log("Category id", category.id);
                                    return (
                                        <Picker.Item label={category.name} value={category.id} />
                                    );
                                })
                                : <Picker.Item label="No categories available" value="" />
                            }
                            </Picker>
                            </Item>
                            </Form>
                        <Button full style={{
                            margin: 5
                        }} onPress={this.addStatus} >
                            <Text>Ok</Text>
                        </Button>

                        <Button warning full style={{
                            margin: 5
                        }} onPress={this.closeAddModal}>
                            <Text>Cancel</Text>
                        </Button>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.modalOpen}
                    transparent={false}
                    animationType={"slide"}
                    onRequestClose={() => {
                        this.setState({
                            modalOpen: false
                        });
                    }}
                >
                    <View>
                    <View>
                        <Title>
                          Edit Model
                        </Title>
                    </View>
                    <Form>
                            <Item stackedLabel>
                                <Label>
                                    Name
                                </Label>
                                <Input value={this.state.existingModel} onChangeText={this.modalNameChange} />
                            </Item>
                            <Item>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                placeHolder="Select category"
                                placeHolderStyle={{color: "#bfc6ea"}}
                                placeHolderIconColor="#007aff"
                                style={{width: undefined}}
                                selectedValue={this.state.category_id}
                                onValueChange={this.onValueChange.bind(this)}
                            >

                            {
                               (this.state.categories.length > 0)
                               ?
                                this.state.categories.map((category) => {
                                   console.log("Category", JSON.stringify(category, null, 3));
                                   console.log("Category id", category.id);
                                    return (
                                        <Picker.Item label={category.name} value={category.id} />
                                    );
                                })
                                : <Picker.Item label="No categories available" value="" />
                            }
                            </Picker>
                            </Item>
                            </Form>
                        <Button full style={{
                            margin: 5
                        }} onPress={this.updateStatus} >
                            <Text>Ok</Text>
                        </Button>

                        <Button warning full style={{
                            margin: 5
                        }} onPress={this.closeModal}>
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

export default connect(undefined, mapDispatchToProps)(Models);
