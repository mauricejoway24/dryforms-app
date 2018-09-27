import React, {
    Component
} from 'react';
import {
    connect
} from 'react-redux';
import ImagePicker from 'react-native-image-picker'
import shallowCompare from 'react-addons-shallow-compare';
import {
    ListItem,
    Thumbnail,
    Content,
    Button,
    Item,
    Label,
    Input,
    Icon,
    Right,
    Body,
    Left,
    Picker,
    Form,
    Text,
    Toast,
    Row,
    Col
} from "native-base";

import {
    API_DOMAIN
} from '../../../../../config/env'
import apiCompanies from '../../../../api/company'
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
import {
    setCompany
} from '../../../../actions/user'
import BaseComponent from '../../BaseComponent'
import styles from "./styles"

StatesJson = require('../../../../config/states.json')
const imgPickerOptions = {
    title: 'Select Logo',
    storageOptions: {
        skipBackup: true,
        path: 'dryforms'
    }
};

class Company extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            companyInfo: {
                id: null,
                logo: null,
                public_logo_path: null,
                dropbox_access_token: '',
                dropbox_token: '',
                name: '',
                email: '',
                phone: '',
                city: '',
                state: '',
                zip: '',
                street: ''
            },
            companyId: '',
            userId: '',
            states: Object.keys(StatesJson).map(function (key) {
                return {
                    key: key,
                    name: StatesJson[key]
                }
            })
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {            
                this.props.changeHeaderTitle("Manage Your Company Profile")
                this.props.visableSideBar();
                this.props.fetchUser()
                console.log("company mounted")
            }),
            this.props.navigation.addListener("willBlur", () => {
            })
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (shallowCompare(this, nextProps, nextState)) {
            if (nextProps.company.id && !this.state.companyId) {
                nextState.companyInfo = nextProps.company
                nextState.companyId = nextProps.company.id
                nextState.userId = nextProps.user.id
                this.loaded()
            }
            return true
        } else {
            return false;
        }
    }

    setInputState = (property, value) => {
        this.setState((preState) => ({
            companyInfo: Object.assign({}, preState.companyInfo, {
                [property]: value
            })
        }));
    }

    onStateChange(value) {
        this.setInputState("state", value);
    }

    removeCompanyLogo() {
        apiCompanies.removeLogo(this.state.companyId)
            .then(response => {
                this.setState({
                    companyId: ''
                })
                this.props.setCompany(response.data.company)
            })
            .catch(response => {
            })
    }

    setCompanyLogo() {
        ImagePicker.showImagePicker(imgPickerOptions, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const data = new FormData();
                data.append('logo', {
                    uri: response.uri,
                    type: 'image/jpeg',
                    name: 'logo.jpg'
                })
                apiCompanies.storeLogo(this.state.companyId, data)
                    .then(response => {                        
                        this.setState({
                            companyId: ''
                        })
                        this.props.setCompany(response.data.company)
                    })
                    .catch(response => {
                    })
            }
        });
    }

    getImageUri(img) {
        if (img.indexOf('data:image/jpeg') !== -1 || img.indexOf('content://') !== -1) {
            return img;
        }
        return API_DOMAIN + '/' + img;
    }

    submit = () => {
        apiCompanies.patch(this.state.companyId, this.state.companyInfo)
            .then(response => {
                this.setState({
                    companyId: ''
                })
                this.props.setCompany(response.data.company)
                Toast.show({
                    text: response.data.message,
                    duration: 3000,
                    type: "success"
                })
            })
            .catch(error => {
                handleErrorResponse(error)
            })
    }

    render() {
        let statesPickerItems = this.state.states && this.state.states.map((s, i) => {
            return <Picker.Item key={i} value={s.key} label={s.name} />
        })
        return (
            this.isLoaded() ? (
            <Content padder>
                <Form>
                    <Item inlineLabel>
                        <Label>Company logo:</Label>
                        {
                            this.state.companyInfo && this.state.companyInfo.public_logo_path ? 
                                (
                                    <ListItem thumbnail>
                                        <Left>
                                            <Thumbnail square source={{uri: this.getImageUri(this.state.companyInfo.public_logo_path)}} />
                                        </Left>
                                        <Body>
                                        </Body>
                                        <Right>
                                            <Button block danger
                                            onPress={()=> this.removeCompanyLogo()} >
                                                <Text>Remove Logo</Text>
                                            </Button>
                                        </Right>
                                    </ListItem>
                                ) : 
                                (
                                    <ListItem>
                                        <Button block info
                                            onPress={()=> this.setCompanyLogo()} >
                                                <Text>Set Company Logo</Text>
                                        </Button>
                                    </ListItem>
                                )
                        }
                    </Item>
                    <Item >
                        <Label>Company Name:</Label>
                        <Input
                            onChangeText={(text) => this.setInputState("name", text)}
                            value={this.state.companyInfo.name} autoCapitalize={'sentences'} />
                    </Item>

                    <Item inlineLabel>
                        <Label>Street Address:</Label>
                        <Input onChangeText={(text) => this.setInputState("street", text)}
                            value={this.state.companyInfo.street} />
                    </Item>

                    <Item inlineLabel>
                        <Label>City:</Label>
                        <Input onChangeText={(text) => this.setInputState("city", text)}
                            value={this.state.companyInfo.city} autoCapitalize={'sentences'} />
                    </Item>
                    <Item inlineLabel>
                        <Label>State:</Label>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                            placeholder="Select State"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            style={{ borderBottomWidth: 1 }}
                            selectedValue={this.state.companyInfo.state}
                            onValueChange={this.onStateChange.bind(this)}
                        >
                            <Picker.Item label="-- Select State ---" value="" />
                            {statesPickerItems}
                        </Picker>
                    </Item>
                    <Item inlineLabel>
                        <Label>Zip Code:</Label>
                        <Input onChangeText={(text) => this.setInputState("zip", text, false)}
                            value={this.state.companyInfo.zip} keyboardType={'phone-pad'}
                        />
                    </Item>

                    <Item >
                        <Label>Phone:</Label>
                        <Input onChangeText={(text) => this.setInputState("phone", text)}
                            value={this.state.companyInfo.phone} keyboardType={'phone-pad'} maxLength={14} placeholder={'xxxxxxxxxx'} placeholderTextColor={'lightgray'} />
                    </Item>

                    <Item >
                        <Label>Email:</Label>
                        <Input onChangeText={(text) => this.setInputState("email", text)}
                            value={this.state.companyInfo.email} keyboardType={'email-address'} />
                    </Item>

                    <Button block info style={{ margin: 10, marginTop: 30 }}
                    onPress={()=> this.submit()}
                    >
                        <Text>Submit</Text>
                    </Button>
                    <Row>
                        <Col>
                            <Button block success style={styles.btnText}
                            onPress={()=> this.updateCreditCard()}
                            >
                                <Text>Update Credit Card Info</Text>
                            </Button>
                        </Col>
                        <Col>
                        {this.props.user.isSubscribed ? (
                            <Button block success style={styles.btnText}
                            onPress={()=> this.cancelSubscription()}
                            >
                                <Text>Cancel Subscription</Text>
                            </Button>
                        ): (
                            this.props.user.is_stripe_assigned ? (
                                <Button block success style={styles.btnText}
                                onPress={()=> this.resumeSubscription()}
                                >
                                    <Text>Resume Subscription</Text>
                                </Button>
                            ) : null                           
                        )}
                        </Col>
                    </Row>
                    {/* <Item inlineLabel>
                        <Label>Cloud Link:</Label>
                        <Input
                            onChangeText={(text) => this.setInputState("cloudLink", text, false)}
                            value={this.state.companyInfo.cloudLink}
                            keyboardType={'phone-pad'}
                        />
                    </Item> */}
                </Form>
            </Content>
            ) : null
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        company: state.user.company,
        isSubscribed: state.user.is_subscribed,
        isGracePeriod: state.user.is_grace_period
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
        },
        setCompany: (company) => {
            dispatch(setCompany(company))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Company);