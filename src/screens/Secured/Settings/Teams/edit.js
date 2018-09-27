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
import apiTeams from '../../../../api/teams'
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

class TeamEdit extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            team: {
                id: null,
                name: null
            }
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.invisableSideBar();
                console.log("team edit page mounted")
                let params = this.props.navigation.state.params
                this.setState({
                    team: params.team
                })
                let headerTitle = params.team.id ? 'Edit Team' : 'Create Team'
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
            team: Object.assign({}, preState.team, { [property]: value })
        }));
    }

    submit() {
        this.run()
        if (this.state.team.id) {
            apiTeams.patch(this.state.team.id, this.state.team)
                .then(() => {
                    Toast.show({
                        text: 'Team successfully updated',
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
            apiTeams.store(this.state.team)
                .then(response => {                    
                    Toast.show({
                        text: 'Team successfully created',
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
        let btnTitle = this.state.team.id ? 'Save' : 'Create'
        return (
            <Content padder>
            { this.isLoaded() ? (
                <Form>
                    <Item >
                        <Label>Name:</Label>
                        <Input
                            onChangeText={(text) => this.setInputState("name", text, true)}
                            value={this.state.team.name}
                            autoCapitalize={'sentences'}
                        />
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

export default connect(mapStateToProps, mapDispatchToProps)(TeamEdit);