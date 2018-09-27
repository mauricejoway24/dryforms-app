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
import BaseComponent from '../../BaseComponent'
import apiProjectStatements from '../../../../api/project_statements'

class Statement extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.setState({
            initialStatement: this.props.statementInfo.statement
        })
    }

    componentWillReceiveProps(props) {
        const refresh = this.props.refresh
        if (props.refresh !== refresh) {
            this.richtext.setContentHTML(props.statementInfo.statement)
        }
    }
    
    revert(parent) {
        apiProjectStatements.revert(this.props.statementInfo.id, {
            form_id: this.props.formId
        }).then(response => {
            this.props.onRevert()
        }).catch(error => {
            handleErrorResponse(error)
        })
    }

    getContent() {
        return this.richtext.getContentHtml();
    }

    render() {
        return (
            <View style={styles.container}>
                <RichTextEditor
                    ref={(r)=>this.richtext = r}
                    style={styles.richText}
                    hiddenTitle= {true}
                    initialContentHTML={this.props.statementInfo.statement}
                />
                <RichTextToolbar
                    getEditor={() => this.richtext}
                />
                <Button block danger style={{ margin: 15, marginVertical: 10 }}
                onPress={()=> this.revert()} disabled={this.state.isRunning}
                >
                    <Text>
                        Revert
                    </Text>
                </Button>
            </View>
        )
    }
}

export default Statement;