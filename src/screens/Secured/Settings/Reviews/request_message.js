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
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import {
    changeHeaderTitle,    
    changeSideBarInivisble
} from '../../../../actions/shared'
import {
    handleErrorResponse
} from '../../../../service/error_handler'
import NavigationService from '../../../../service/NavigationService';
import BaseComponent from '../../BaseComponent'
import apiReviewRequestMessage from '../../../../api/review_request_message'
class RequestMessageEdit extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reviewRequestMessage: {
                company_id: null,
                message: ''
            }
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Review Request Message")
                this.props.invisableSideBar()
                console.log("review request message edit mounted")
                let params = this.props.navigation.state.params
                this.setState({
                    reviewRequestMessage: params.reviewRequestMessage
                })                
                this.loaded();
            }),
            this.props.navigation.addListener("willBlur", () => {})
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    async submit() {
        this.run()
        const contentHtml = await this.richtext.getContentHtml();
        this.setState((preState) => ({
            reviewRequestMessage: Object.assign({}, preState.reviewRequestMessage, { message: contentHtml })
        }), () => {
            apiReviewRequestMessage.patch(this.state.reviewRequestMessage.company_id, this.state.reviewRequestMessage)
                .then(() => {
                    Toast.show({
                        text: 'Review Request Message successfully updated',
                        duration: 3000,
                        type: "success"
                    });
                    this.dataReady()
                })
                .catch(error => {            
                    handleErrorResponse(error)
                    this.dataFailed()
                })
        });        
    }

    render() {
        return (
            <View style={{flex: 1}}>            
            { this.isLoaded() ? (
                <View style={styles.container}>
                    <RichTextEditor
                        ref={(r)=>this.richtext = r}
                        style={styles.richText}
                        hiddenTitle= {true}
                        initialContentHTML={this.state.reviewRequestMessage.message}
                    />
                    <RichTextToolbar
                        getEditor={() => this.richtext}
                    />
                    <Button block info style={{ margin: 15, marginTop: 20 }}
                    onPress={()=> this.submit()} disabled={this.state.isRunning}
                    >
                        <Text>
                            Save
                        </Text>
                    </Button>
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
        invisableSideBar: () => {
            dispatch(changeSideBarInivisble(true))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestMessageEdit);