import React from 'react';
import {
    connect
} from 'react-redux';
import {
    Content,
    ListItem,
    Button,
    Text,
    Toast,
    CheckBox,
    Body
} from "native-base";
import _ from 'lodash'

import apiStandardDailylogSettings from '../../../../api/standard_dailylog_settings'
import {
    changeHeaderTitle,
    changeSideBarInivisble
} from '../../../../actions/shared'
import {
    handleErrorResponse
} from '../../../../service/error_handler'
import BaseComponent from '../../BaseComponent'

class DailyLog extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            dailylogSetting: {
                automatically_copy: 1
            }
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Daily Log Management")
                this.props.visableSideBar()
                this.init()
                console.log("daily log mounted")
            }),
            this.props.navigation.addListener("willBlur", () => {})
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }
    
    init() {
        this.run()
        apiStandardDailylogSettings.index()
            .then(res => {
                this.dataReady()
                this.loaded()
                this.setState({
                    dailylogSetting: res.data.id ? res.data : this.state.dailylogSetting
                })
            })
            .catch((error) => {
                handleErrorResponse(error);
                this.dataFailed();
            })
    }

    changedActivate() {
        this.setState({
            dailylogSetting: {
                automatically_copy: 1- (this.state.dailylogSetting.automatically_copy == 1) ? 1 : 0
            }
        })
    }

    save() {
        this.run()
        const api = this.state.dailylogSetting.id ? 
            apiStandardDailylogSettings.patch(this.state.dailylogSetting.id, this.state.dailylogSetting) : apiStandardDailylogSettings.store(this.state.dailylogSetting)
        api.then(() => {
            Toast.show({
                text: 'Daily Log Setting successfully updated',
                duration: 3000,
                type: "success"
            });
            this.dataReady();
        }).catch((error) => {
            handleErrorResponse(error);
            this.dataFailed();
        })
    }

    render() {
        return (
            this.isLoaded() ? (
                <Content padder>
                    <ListItem>
                        <CheckBox checked={this.state.dailylogSetting.automatically_copy == 1} onPress={() => this.changedActivate()} />
                        <Body>
                            <Text>Copy all notes to daily log?</Text>
                        </Body>
                    </ListItem>
                    <Button block info style={{ margin: 15, marginTop: 50 }}
                    onPress={()=> this.save()} disabled={this.state.isRunning}
                    >
                        <Text>
                            Save
                        </Text>
                    </Button>
                 </Content>
            ) : null
        );
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
        },
        fetchUser: () => {
            dispatch(fetchUser())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyLog);