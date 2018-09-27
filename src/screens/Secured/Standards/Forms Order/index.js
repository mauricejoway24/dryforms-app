import React from 'react';
import {
    connect
} from 'react-redux';
import {
    Text,
    View,
} from 'react-native';
import {
    Content
} from 'native-base'
import SortableList from 'react-native-sortable-list';
import _ from 'lodash'

import apiFormsOrder from '../../../../api/forms_order'
import {
    changeHeaderTitle,
    changeSideBarInivisble
} from '../../../../actions/shared'
import {
    handleErrorResponse
} from '../../../../service/error_handler'
import BaseComponent from '../../BaseComponent'
import styles from "./styles"
import Row from './row'
import { fetchFormsOrder } from '../../../../service/standard_form'

class FormsOrder extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            forms: [],
            callReportForm: {}
        }
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Standard Side Menu Forms order Management")
                this.props.visableSideBar()
                this.init()
                console.log("forms order mounted")
            }),
            this.props.navigation.addListener("willBlur", () => {})
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    init() {
        this.run()
        apiFormsOrder.index()
            .then(response => {
                let callReportForm = _.find(response.data, {
                    form_id: 1
                })
                let forms = _.filter(response.data, (form) => {
                    return _.indexOf([1, 12], form.form_id) === -1
                })
                this.setState({
                    callReportForm: callReportForm,
                    forms: forms
                }, () => {
                    this.dataReady()
                    this.loaded()
                })
            })
            .catch(() => {
                handleErrorResponse(error);
                this.dataFailed();
            })
    }

    renderRow = ({data, active}) => {
        return <Row data={data} active={active} />
    }

    
    updateOrder = (forms) => {
        apiFormsOrder.store({
            forms: forms
        }).then(response => {
            this.props.fetchFormsOrder()
        }).catch(this.handleErrorResponse)
    }

    changeOrder = _.debounce((nextOrder) => {
        let forms = [{
            id: this.state.callReportForm.form_id
        }]
        _.forEach(nextOrder, formIndex => {
            forms.push({
                id: this.state.forms[formIndex].form_id
            })
        })
        this.updateOrder(forms)
    }, 500)

    render() {
        return (
            this.isLoaded() ? (
                <View style={styles.container}>
                    <Text style={styles.title}>Standard Side Menu Forms order</Text>
                    <SortableList
                        style={styles.list}
                        contentContainerStyle={styles.contentContainer}
                        data={this.state.forms}
                        renderRow={this.renderRow} 
                        onChangeOrder={(nextOrder) => this.changeOrder(nextOrder)} />
                </View>
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
        },
        fetchFormsOrder: () => {
            dispatch(fetchFormsOrder())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormsOrder);