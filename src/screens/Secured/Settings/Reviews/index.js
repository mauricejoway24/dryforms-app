import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import {
    Content,
    Button,
    Icon,
    Text,
    List,
    Toast,
    Fab,
    CheckBox,
    ListItem,
    Body
} from "native-base";
import {
    ListView,
    View
} from 'react-native';
import styles from "./styles"
import apiReviewLinks from '../../../../api/review_links'
import apiReviewRequestMessage from '../../../../api/review_request_message'
import {
    changeHeaderTitle,    
    changeSideBarInivisble
} from '../../../../actions/shared'
import {
    handleErrorResponse
} from '../../../../service/error_handler'
import NavigationService from '../../../../service/NavigationService';
import BaseComponent from '../../BaseComponent'

class Reviews extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reviewLinks: [],
            reviewRequestMessage: {
                company_id: null,
                message: ''
            },
            count: 0,
            activateCount: 0,
            activeFab: false
        }
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Manage Your Reviews")
                this.props.visableSideBar()
                this.initData()
                console.log("reviews mounted")
            }),
            this.props.navigation.addListener("willBlur", () => {})
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    initData() {
        const apis = [
            apiReviewLinks.index({page: 1}),
            apiReviewRequestMessage.index()
        ]
        return Promise.all(apis)
            .then(response => {
                this.setState({
                    count: response[0].data.reviewLinks.total,
                    activateCount: response[0].data.activateCount,
                    reviewLinks: response[0].data.reviewLinks.data || [],
                    reviewRequestMessage: response[1].data
                })
                this.loaded();
            })
    }

    changedActivate(data) {
        let newReviewLink = data
        newReviewLink.activate = 1 - newReviewLink.activate;
        this.saveLink(newReviewLink)
    }

    refreshList() {
        return apiReviewLinks.index({page: 1})
            .then(response => {
                this.setState({
                    count: response.data.reviewLinks.total,
                    activateCount: response.data.activateCount,
                    reviewLinks: response.data.reviewLinks.data || []
                })
            })
    }

    saveLink(reviewLink) {
        apiReviewLinks.patch(reviewLink.id, reviewLink)
            .then(response => {
                this.refreshList()
            })
            .catch(error => {
                handleErrorResponse(error)
            })
    }

    deleteReview(data, secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        const newData = [...this.state.reviewLinks];
        newData.splice(rowId, 1);
        apiReviewLinks.delete(data.id)
            .then((response) => {                
                this.setState({
                    reviewLinks: newData,
                    activateCount: this.state.activateCount - data.activate
                });
                Toast.show({
                    text: response.data.message,
                    duration: 3000,
                    type: "success"
                })
            })
            .catch((error) => {
                handleErrorResponse(error)
            });
    }

    editReview = (data) => {
        NavigationService.navigate('ReviewLinkEdit', {
            reviewLink: data,
            activateCount: this.state.activateCount
        })
    }

    createReview = () => {
        NavigationService.navigate('ReviewLinkEdit', {
            reviewLink: {
                id: null,
                url: null,
                activate: 0
            },
            activateCount: this.state.activateCount
        })
    }

    editRequestMessage = () => {
        NavigationService.navigate('RequestMessageEdit', {
            reviewRequestMessage: this.state.reviewRequestMessage
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
            { this.state.isLoaded ? (
                <View style={{ flex: 1 }}>
                    <Content>
                        <List style={{marginTop:10, flex:1}}
                            dataSource={this.ds.cloneWithRows(this.state.reviewLinks)}
                            renderRow={data =>
                                <View style={styles.listView}>
                                    <View style={[styles.defaultCheckBoxWrapper, {flex: 0.2}]}>
                                        <CheckBox disabled={data.activate==0 && this.state.activateCount>=3} checked={data.activate == 1} onPress={() => this.changedActivate(data)}/>
                                    </View>
                                    <Text style={[styles.defaultText, {flex: 0.8}]} numberOfLines={1}>
                                        {data.url}
                                    </Text>
                                </View>}
                            renderLeftHiddenRow={data =>
                                <Button full info onPress={_ => this.editReview(data)}>
                                    <Icon active name="md-create" />
                                </Button>}
                            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                                <Button full danger onPress={_ => this.deleteReview(data,secId, rowId, rowMap)}>
                                    <Icon active name="trash" />
                                </Button>}
                            leftOpenValue={50}
                            rightOpenValue={-50}
                        />
                    </Content>                
                    <Fab style={{ backgroundColor: '#5067FF' }}
                        active={this.state.activeFab}
                        direction="left"
                        position="bottomRight" 
                        onPress={() => this.setState({ activeFab: !this.state.activeFab })}
                        >
                        <Icon name="settings" />
                        <Button style={{ backgroundColor: '#3B5998' }} onPress={() => this.createReview()}>
                            <Icon name="md-add" />
                        </Button>
                        <Button style={{ backgroundColor: '#DD5144'}} onPress={() => 
                            this.editRequestMessage()}>
                            <Icon name="ios-mail" />
                        </Button>
                    </Fab>
                </View>
            ) : null }
            </View>
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
        visableSideBar: () => {
            dispatch(changeSideBarInivisble(false))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reviews);