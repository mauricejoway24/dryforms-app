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
import apiStandardStructure from '../../../../api/standard_structures'
import apiStandardMaterials from '../../../../api/standard_materials'
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

class MoistureMapEdit extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            newVal: '',
            type: 'structure'
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.invisableSideBar();
                console.log("standard moisture map add page mounted")
                let params = this.props.navigation.state.params
                this.setState({
                    type: params.type
                })
                if (params.type === 'structure')
                    this.props.changeHeaderTitle('Add Standard Structure');
                else 
                    this.props.changeHeaderTitle('Add Standard Material');
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
        const api = this.state.type === 'structure' ? apiStandardStructure : apiStandardMaterials;
        api.store({
            title: this.state.newVal
        })
            .then((response) => {
                Toast.show({
                    text: 'Success',
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
        label = (this.state.type === 'structure' ? (
            <Label>New Structure:</Label>
        ): (
            <Label>New Material:</Label>
        ))
        return (
            this.isLoaded() ? (
                <Content padder>
                    <Form style={{flexDirection:'row'}}>
                        <Item style={{flex: 1}} success>
                            {label}
                            <Input 
                                onChangeText={(text) => this.setState({
                                    newVal: text
                                })}
                                value={this.state.newVal}
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

export default connect(mapStateToProps, mapDispatchToProps)(MoistureMapEdit);