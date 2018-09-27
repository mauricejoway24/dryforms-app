import React from 'react';
import {
    connect
} from 'react-redux';
import {
    Content,
    ListItem,
    Item,
    Button,
    Text,
    Toast,
    CheckBox,
    Body,
    Form,
    Input,
    Label
} from "native-base";
import {
    View,
    ScrollView
} from 'react-native'
import _ from 'lodash'
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';

import apiStandardForm from '../../../../api/standard_form'
import {
    changeHeaderTitle,
    changeSideBarInivisble
} from '../../../../actions/shared'
import {
    handleErrorResponse
} from '../../../../service/error_handler'
import BaseComponent from '../../BaseComponent'
import Statement from '../Statement'
import { fetchFormsOrder } from '../../../../service/standard_form'
import styles from "./styles"

class StandardForm extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            formId: null,
            form: {},
            statements: [],
            refreshChild: false
        }

        this.init = this.init.bind(this)
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                let params = this.props.navigation.state.params
                this.setState({
                    isLoaded: false
                }, () => {                
                    this.setState({
                        formId: params.form_id
                    }, () => {
                        this.props.visableSideBar()
                        this.init()
                    })                
                    console.log("standard form mounted")
                })
            }),
            this.props.navigation.addListener("willBlur", () => {})
        ];
    }

    componentWillReceiveProps(props) {
        let params = props.navigation.state.params
        if (params.form_id !== this.props.navigation.state.params.form_id) {
            this.setState({
                isLoaded: false
            }, () => {                
                this.setState({
                    formId: params.form_id
                }, () => {
                    this.props.visableSideBar()
                    this.init()
                })                
                console.log("standard form mounted")
            })
        }
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    init() {
        this.run()
        apiStandardForm.show(this.state.formId)
            .then(response => {
                let form = { 
                    ...response.data.form,
                    footer_text: response.data.form.footer_text || ' '
                }
                this.setState({
                    form: form,
                    statements: response.data.statements,
                    refreshChild: !this.state.refreshChild
                }, () => {
                    this.props.changeHeaderTitle(form.title)
                    this.loaded()
                    this.dataReady();
                })
            })
            .catch(error => {
                handleErrorResponse(error)
                this.dataFailed();
            })
    }

    setInputState = (property, value) => {
        this.setState((preState) => ({
            form: Object.assign({}, preState.form, {
                [property]: value
            })
        }));
    }

    changeCheckbox = (property, value) => {
        this.setInputState(property, 1 - (value == 1) ? 1 : 0)
    }

    async submit() {
        this.run()
        let statements = []
        let form = this.state.form
        for (let index = 0; index < this.children.length; index++) {
            const child = this.children[index];
            if (!child) continue;
            let statementInfo = child.props.statementInfo;       
            statementInfo.statement = await child.getContent()
            statements.push(statementInfo)            
        }
        if (this.state.form.footer_text_show == 1) {
            let footerText = await this.richtext.getContentHtml();
            form.footer_text = footerText
        }
        form.statements = statements
        apiStandardForm.patch(form.id, form)
            .then(response => {
                Toast.show({
                    text: 'Standard Form successfully updated',
                    duration: 3000,
                    type: "success"
                });
                this.props.changeHeaderTitle(form.title)
                this.props.fetchFormsOrder()
                this.dataReady();
            }).catch(error => {
                handleErrorResponse(error)
                this.dataFailed();
            })
    }

    render() {
        this.children = []
        return (
            this.isLoaded() ? (
                <Content>
                    <Form>
                        <Item>
                            <Label>*Enter side menu name: </Label>
                            <Input onChangeText={(text) => this.setInputState("name", text, true)} value={this.state.form.name} />
                        </Item>
                        <Item>
                            <Label>*Enter form title: </Label>
                            <Input onChangeText={(text) => this.setInputState("title", text, true)} value={this.state.form.title} />
                        </Item>
                    </Form>
                    {
                        this.state.statements.map((statement, key) => {
                            return (
                                <View key={key} style={{marginTop: 20, marginHorizontal:5, height: 400, borderWidth: 1, borderColor: 'skyblue'}}>
                                    <Statement
                                        ref={ref => (this.children[statement.id] = ref)} statementInfo={statement}
                                        formId={this.state.form.form_id}
                                        onRevert={this.init} 
                                        refresh={this.state.refreshChild}/>
                                </View>
                            )
                        })
                    }
                    <ListItem>
                        <CheckBox checked={this.state.form.additional_notes_show == 1} onPress={() => this.changeCheckbox('additional_notes_show', this.state.form.additional_notes_show) } />
                        <Body>
                            <Text>Additional notes.(Select if you wish to have Additional notes text box)</Text>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <CheckBox checked={this.state.form.footer_text_show == 1} onPress={() => this.changeCheckbox('footer_text_show', this.state.form.footer_text_show) } />
                        <Body>
                            <Text>Footer Text.(Select if you wish to have a footer text)</Text>
                        </Body>
                    </ListItem>
                    {
                        this.state.form.footer_text_show ? (
                            <View style={{marginTop: 20, marginHorizontal:5, height: 300, borderWidth: 1, borderColor: 'skyblue'}}>
                                <View style={styles.container}>
                                    <RichTextEditor
                                        ref={(r)=>this.richtext = r}
                                        style={styles.richText}
                                        hiddenTitle= {true}
                                        initialContentHTML={this.state.form.footer_text}
                                    />
                                    <RichTextToolbar
                                        getEditor={() => this.richtext}
                                    />
                                </View>
                            </View>
                        ) : null
                    }
                    <Button block info style={{ margin: 15, marginVertical: 10 }}
                    onPress={()=> this.submit()} disabled={this.state.isRunning}
                    >
                        <Text>
                            Submit
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
        fetchFormsOrder: () => {
            dispatch(fetchFormsOrder())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StandardForm);