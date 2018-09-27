import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import {
    Content,
    Button,
    Item,
    Label,
    Input,
    Icon,
    Form,
    Text,
    Toast, 
    Picker
} from "native-base";

import BaseComponent from '../../BaseComponent'
import apiUsers from '../../../../api/users'
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

class UserEdit extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                id: null,
                first_name: '',
                last_name: '',
                email: '',
                role_id: null,
                team_id: null
            },
            teams: [],
            roles: [],
            companyId: null,
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.invisableSideBar();
                console.log("user edit page mounted")
                let params = this.props.navigation.state.params
                this.setState({
                    user: params.user,
                    teams: params.teams,
                    roles: params.roles,
                    companyId: params.companyId
                })
                let headerTitle = params.user.id ? 'Edit User' : 'Create User'
                this.props.changeHeaderTitle(headerTitle);
                this.loaded();
            }),
            this.props.navigation.addListener("willBlur", () => {})
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    setInputState = (property, value) => {
        this.setState((preState) => ({
            user: Object.assign({}, preState.user, { [property]: value })
        }));
    }

    onRoleChange(value) {
        this.setInputState('role_id', value);
    }

    onTeamChange(value) {
        this.setInputState('team_id', value);
    }
    
    submit() {
        this.run()
        if (this.state.user.id) {
            apiUsers.patch(this.state.user.id, this.state.user)
                .then(() => {
                    Toast.show({
                        text: 'User successfully updated',
                        duration: 3000,
                        type: "success"
                    });
                    this.dataReady()
                })
                .catch(error => {            
                    handleErrorResponse(error)
                    this.dataFailed()
                })
        } else {
            let newUser = this.state.user
            newUser.company_id = this.state.companyId
            apiUsers.store(newUser)
                .then(response => {                    
                    Toast.show({
                        text: 'User successfully created',
                        duration: 3000,
                        type: "success"
                    });
                    this.dataReady()
                    NavigationService.goBack()
                })
                .catch(error => {
                    handleErrorResponse(error)
                    this.dataFailed()
                })
        }
    }

    render() {
        let roleItems = this.state.roles&&this.state.roles.map( (s, i) => {
            return <Picker.Item key={i} value={s.id} label={s.name} />
        });
        let teamItems = this.state.teams&&this.state.teams.map( (s, i) => {
            return <Picker.Item key={i} value={s.id} label={s.name} />
        });
        let btnTitle = this.state.user.id ? 'Save' : 'Create'
        return (
            <Content padder>
            { this.isLoaded() ? (
                <Form>
                    <Item >
                        <Label>First Name:</Label>
                        <Input
                            onChangeText={(text) => this.setInputState("first_name", text, true)}
                            value={this.state.user.first_name}
                            autoCapitalize={'sentences'}
                        />
                    </Item>
                    <Item >
                        <Label>Last Name:</Label>
                        <Input
                            onChangeText={(text) => this.setInputState("last_name", text, true)}
                            value={this.state.user.last_name}
                            autoCapitalize={'sentences'}
                        />
                    </Item>
                    <Item >
                        <Label>Email:</Label>
                        <Input
                            onChangeText={(text) => this.setInputState("email", text, true)}
                            value={this.state.user.email}
                            autoCapitalize={'sentences'}
                        />
                    </Item>
                    <Item inlineLabel>
                        <Label>Type:</Label>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                            placeholder="Select Type"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.user.role_id}
                            onValueChange={this.onRoleChange.bind(this)}
                        >
                            <Picker.Item key={-1} value={''} label={'--- Select ---'} />
                            {roleItems}
                        </Picker>
                    </Item>
                    
                    <Item inlineLabel>
                        <Label>Team:</Label>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                            placeholder="Select Team"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.user.team_id}
                            onValueChange={this.onTeamChange.bind(this)}
                        >
                            <Picker.Item key={-1} value={''} label={'--- Select ---'} />
                            {teamItems}
                        </Picker>
                    </Item>
                    
                    <Button block info style={{ margin: 15, marginTop: 50 }}
                    onPress={()=> this.submit()} disabled={this.state.isRunning}
                    >
                        <Text>
                            { btnTitle }
                        </Text>
                    </Button>
                </Form>
            ) : null }
            </Content>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);