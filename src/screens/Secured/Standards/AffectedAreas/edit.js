import React from 'react';
import {
    connect
} from 'react-redux';
import {
    Content,
    Button,
    Item,
    Input,
    Form,
    Text,
    Toast,
    CheckBox,
    Label
} from "native-base";
import {
    View
} from 'react-native';

import BaseComponent from '../../BaseComponent'
import apiStandardArea from '../../../../api/standard_area'
import {
    changeHeaderTitle,
    changeSideBarInivisble
} from '../../../../actions/shared'
import {
    fetchUser
} from '../../../../service/fetch_user'
import {
    handleErrorResponse
} from '../../../../service/error_handler'
import NavigationService from '../../../../service/NavigationService';
import styles from "./styles"

class AffectedAreaEdit extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            newArea: ''
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.invisableSideBar();
                console.log("standard affected area add page mounted")
                // let params = this.props.navigation.state.params
                // this.setState({
                //     newArea: params.newArea
                // })
                this.props.changeHeaderTitle('Add Standard Area');
                this.loaded();
            }),
            this.props.navigation.addListener("willBlur", () => {})
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    submit() {
        this.run()
        apiStandardArea.store({
            title: this.state.newArea
        })
            .then((response) => {
                Toast.show({
                    text: 'Affected Area successfully created',
                    duration: 3000,
                    type: "success"
                });
                this.dataReady();
                NavigationService.goBack();
            })
            .catch(error => {
                handleErrorResponse(error)
                this.dataFailed()
            })
    }

    render() {
        return (
            this.isLoaded() ? (
                <Content padder>
                    <Form style={{flexDirection:'row'}}>
                        <Item style={{flex: 1}} success>
                            <Label>New Area:</Label>
                            <Input 
                                onChangeText={(text) => this.setState({
                                    newArea: text
                                })}
                                value={this.state.newArea}
                                autoCapitalize={'sentences'}
                            />
                        </Item>
                    </Form>                 
                    <Button block info style={{ margin: 15, marginTop: 50 }}
                    onPress={()=> this.submit()} disabled={this.state.isRunning}
                    >
                        <Text>
                            Create
                        </Text>
                    </Button>
                 </Content>
            ) : null
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
        invisableSideBar: () => {
            dispatch(changeSideBarInivisble(true))
        },
        fetchUser: () => {
            dispatch(fetchUser())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffectedAreaEdit);