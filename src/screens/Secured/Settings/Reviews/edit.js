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
    CheckBox
} from "native-base";
import {
    View
} from 'react-native';

import BaseComponent from '../../BaseComponent'
import apiReviewLinks from '../../../../api/review_links'
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

class ReviewLinkEdit extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reviewLink: {
                id: null,
                url: null,
                activate: 0,
            },            
            activateCount: 0
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.invisableSideBar();
                console.log("review link edit page mounted")
                let params = this.props.navigation.state.params
                this.setState({
                    reviewLink: params.reviewLink,
                    activateCount: params.activateCount
                })
                let headerTitle = params.reviewLink.id ? 'Edit Link' : 'Create Link'
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
            reviewLink: Object.assign({}, preState.reviewLink, { [property]: value })
        }));
    }

    changedActivate() {
        let newReviewLink = this.state.reviewLink
        newReviewLink.activate = 1 - (newReviewLink.activate ? 1: 0);
        let activateCount = (newReviewLink.activate === 1) ? this.state.activateCount + 1 : this.state.activateCount - 1;
        this.setState({
            reviewLink: newReviewLink,
            activateCount: activateCount
        })
    }

    submit() {
        this.run()
        if (this.state.reviewLink.id) {
            apiReviewLinks.patch(this.state.reviewLink.id, this.state.reviewLink)
                .then(() => {
                    Toast.show({
                        text: 'Review Link successfully updated',
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
            apiReviewLinks.store(this.state.reviewLink)
                .then(() => {
                        Toast.show({
                            text: 'Review Link successfully created',
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
    }

    render() {
        let btnTitle = this.state.reviewLink.id ? 'Save' : 'Create'
        return (
            <Content padder>
            { this.isLoaded() ? (
                <View>
                    <Form style={{flexDirection:'row'}}>
                        <Item style={{flex: 0.8}} success>
                            <Input onChangeText={(text) => this.setInputState("url", text, true)}
                                value={this.state.reviewLink.url}
                                autoCapitalize={'sentences'}
                            />
                        </Item>
                        <View style={[styles.defaultCheckBoxWrapper, {flex: 0.2}]}>
                            <CheckBox disabled={this.state.reviewLink.activate==0 && this.state.activateCount>=3} checked={this.state.reviewLink.activate == 1} onPress={() => this.changedActivate()}/>
                        </View>
                    </Form>                 
                    <Button block info style={{ margin: 15, marginTop: 50 }}
                    onPress={()=> this.submit()} disabled={this.state.isRunning}
                    >
                        <Text>
                            { btnTitle }
                        </Text>
                    </Button>
                 </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReviewLinkEdit);