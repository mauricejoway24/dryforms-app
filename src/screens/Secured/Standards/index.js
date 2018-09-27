import React, {Component} from "react";
import { connect } from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare';
import _ from 'lodash'

import Nav from './route'
import { changeSideBarMenus } from "../../../actions/shared";
import { fetchFormsOrder } from '../../../service/standard_form'

class Standards extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {
        this.props.fetchFormsOrder()
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (shallowCompare(this, nextProps, nextState)) {
            if (JSON.stringify(this.props.formsOrder) !== JSON.stringify(nextProps.formsOrder)) {
                let menus = this.getSideBarMenus(nextProps.formsOrder)
                this.props.changeSideBarMenus(menus);
            }
            return true
        } else {
            return false;
        }
    }
    
    getSideBarMenus(formsOrder) {
        let menus = ['Forms Order', 'Affected Areas'];
        _.forEach(formsOrder, form => {
            if (_.indexOf([1, 8, 12], form.form_id) === -1) {
                menus.push(form.name)
            }
        })
        return menus;
    }

    render() {
        return (
            <Nav />
        );
    }
}
  
const mapStateToProps = (state) => {
    return {
        formsOrder: state.standard_form.formsOrder
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeSideBarMenus: (sideBarMenus) => {
            dispatch(changeSideBarMenus(sideBarMenus))
        },
        fetchFormsOrder: () => {
            dispatch(fetchFormsOrder())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Standards);