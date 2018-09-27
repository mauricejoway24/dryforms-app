import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import {
    Content,
    Input,
    Button,
    Item,
    Label,
    Text,
    Form,
    Toast
} from 'native-base';

import validator from '../../../../service/validator'
import {
    handleErrorResponse
} from '../../../../service/error_handler'
import {
    changeHeaderTitle,
    changeSideBarInivisble
} from '../../../../actions/shared'
import ApiAccount from '../../../../api/account'

class Account extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isFocused: false,
            passwordData: {
                old_password: null,
                new_password: null,
                new_password_confirmation: null
            },
            emailData: {
                old_email: null,
                new_email: null,
                new_email_confirmation: null
            },
            valid: {
                old_password: 0, //0 untouch, 1 valid, 2 invalid
                new_password: 0,
                new_password_confirmation: 0,
                old_email: 0, //0 untouch, 1 valid, 2 invalid
                new_email: 0,
                new_email_confirmation: 0
            }
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {            
                this.props.changeHeaderTitle("Manage Your Account")
                this.props.visableSideBar();
                console.log("account mounted")
            }),
            this.props.navigation.addListener("willBlur", () => {
            })
        ];
    }
    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    setInputState = (property, value, isPassword) => {
        if (isPassword) {
            this.setState((preState) => ({
                passwordData: Object.assign({}, preState.passwordData, {
                    [property]: value
                })
            }), () => {
                if (validator(value, 'password')) {
                    if (property.indexOf('new') === -1 || (property.indexOf('new') !== -1 && this.state.passwordData.new_password === this.state.passwordData.new_password_confirmation)) {
                        this.setState((preState) => ({
                            valid: Object.assign({}, preState.valid, {
                                [property]: 1
                            })
                        }));
                        if (property.indexOf('new') !== -1) {
                            this.setState((preState) => ({
                                valid: Object.assign({}, preState.valid, {
                                    new_password: 1,
                                    new_password_confirmation: 1
                                })
                            }));
                        }
                        return;
                    }
                }
                this.setState((preState) => ({
                    valid: Object.assign({}, preState.valid, {
                        [property]: 2
                    })
                }));
                if (property.indexOf('new') !== -1) {
                    this.setState((preState) => ({
                        valid: Object.assign({}, preState.valid, {
                            new_password: 2,
                            new_password_confirmation: 2
                        })
                    }));
                }
            });
        } else {
            this.setState((preState) => ({
                emailData: Object.assign({}, preState.emailData, {
                    [property]: value
                })
            }), () => {
                if (validator(value, 'email')) {
                    if (property.indexOf('new') === -1 || (property.indexOf('new') !== -1 && this.state.emailData.new_email === this.state.emailData.new_email_confirmation)) {
                        this.setState((preState) => ({
                            valid: Object.assign({}, preState.valid, {
                                [property]: 1
                            })
                        }));
                        if (property.indexOf('new') !== -1) {
                            this.setState((preState) => ({
                                valid: Object.assign({}, preState.valid, {
                                    new_email: 1,
                                    new_email_confirmation: 1
                                })
                            }));
                        }
                        return;
                    }
                }
                this.setState((preState) => ({
                    valid: Object.assign({}, preState.valid, {
                        [property]: 2
                    })
                }));
                if (property.indexOf('new') !== -1) {
                    this.setState((preState) => ({
                        valid: Object.assign({}, preState.valid, {
                            new_email: 2,
                            new_email_confirmation: 2
                        })
                    }));
                }
            });
        }
    }

    updatePassword = () => {
        if (this.state.valid.old_password != 1 || this.state.valid.new_password != 1 || this.state.valid.new_password_confirmation != 1) {
            return;
        }
        ApiAccount.changePassword(this.state.passwordData)
            .then(response => {                
                this.setState({
                    passwordData: {
                        old_password: null,
                        new_password: null,
                        new_password_confirmation: null
                    }
                });

                Toast.show({
                    text: response.data.message,
                    duration: 3000,
                    type: "success"
                })
            }).catch(error => {
                handleErrorResponse(error)
            })

    }

    updateEmail = () => {
        if (this.state.valid.old_email != 1 || this.state.valid.new_email != 1 || this.state.valid.new_email_confirmation != 1) {
            return;
        }
        ApiAccount.changeEmail(this.state.emailData)
            .then(response => {
                this.setState({
                    emailData: {
                        old_email: null,
                        new_email: null,
                        new_email_confirmation: null
                    }
                });
                
                Toast.show({
                    text: response.data.message,
                    duration: 3000,
                    type: "success"
                })
            }).catch(error => {
                handleErrorResponse(error)
            })
    }

    render() {
        return (
            <Content padder>
                <Form>
                    <Item error={this.state.valid.old_password != 2 ? false : true}>
                        <Label>Old Password:</Label>
                        <Input onChangeText={(text) => this.setInputState("old_password", text, true)} value={this.state.passwordData.old_password} secureTextEntry={true}/>
                    </Item>
                    <Item error={this.state.valid.new_password != 2 ? false : true}>
                        <Label>New Password:</Label>
                        <Input onChangeText={(text) => this.setInputState("new_password", text, true)} value={this.state.passwordData.new_password} secureTextEntry={true}/>
                    </Item>
                    <Item error={this.state.valid.new_password_confirmation != 2 ? false : true}>
                        <Label>New Password Confirmation:</Label>
                        <Input onChangeText={(text) => this.setInputState("new_password_confirmation", text, true)} value={this.state.passwordData.new_password_confirmation} secureTextEntry={true}/>
                    </Item>
                    <Button block info style={{ margin: 15, marginTop: 30 }} onPress={() => this.updatePassword()}>
                            <Text>Submit</Text>
                    </Button>
                </Form>

                <Form>
                    <Item error={this.state.valid.old_email != 2? false : true}>
                        <Label>Old Email:</Label>
                        <Input onChangeText={(text) => this.setInputState("old_email", text, false)} value={this.state.emailData.old_email}/>
                    </Item>
                    <Item error={this.state.valid.new_email != 2 ? false : true}>
                        <Label>New Email:</Label>
                        <Input onChangeText={(text) => this.setInputState("new_email", text, false)} value={this.state.emailData.new_email} />
                    </Item>
                    <Item error={this.state.valid.new_email_confirmation != 2 ? false : true}>
                        <Label>New Email Confirmation:</Label>
                        <Input onChangeText={(text) => this.setInputState("new_email_confirmation", text, false)}  value={this.state.emailData.new_email_confirmation} />
                    </Item>
                    <Button block info style={{ margin: 15, marginTop: 30 }} onPress={() => this.updateEmail()}>
                        <Text>Submit</Text>
                    </Button>
                </Form>                
            </Content>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeHeaderTitle: (headerTitle) => {
            dispatch(changeHeaderTitle(headerTitle))
        },
        onLogout: () => {
            dispatch(logout())
        },
        visableSideBar: () => {
            dispatch(changeSideBarInivisble(false))
        },
    }
}

export default connect(undefined, mapDispatchToProps)(Account);
