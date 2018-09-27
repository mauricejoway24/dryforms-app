import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Content, Form, Item, Header, Left, Body, Title, Input, Text, Toast, Label, Button} from 'native-base';
import {View} from 'react-native';
import {handleErrorResponse} from '../../../../service/error_handler';
import {changeHeaderTitle, changeSideBarInvisible} from '../../../../actions/shared';
import apiCategory from '../../../../api/categories';
import NavigationService from '../../../../service/NavigationService';
import Dialog from 'react-native-dialog';


export default class CategoryEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }


    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Body>
                            <Title>
                                Edit Category
                            </Title>
                        </Body>
                    </Left>
                </Header>

                <Form>
                    <Item floatingLabel>
                        <Label>
                            Name 
                        </Label>
                        <Input />
                    </Item>

                    <Item floatingLabel last>
                        <Label>
                            Prefix
                        </Label>
                        <Input />
                    </Item>
                </Form>

                <View styles={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItem: "center"
                }}>
                    <Button small primary>
                        <Text>Ok</Text>
                    </Button>
                    <Button small light>
                        <Text>Cancel</Text>
                    </Button>
                </View>
            </Container>
        )
    }
}

