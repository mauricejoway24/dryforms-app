import React, {
    Component
} from 'react';

class BaseComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRunning: false,
            isLoaded: false
        }
    }

    run() {
        this.setState({
            isRunning: true
        })
    }

    dataReady() {
        this.setState({
            isRunning: false
        })
    }

    dataFailed() {
        this.setState({
            isRunning: false
        })
    }

    loaded() {
        this.setState({
            isLoaded: true
        })
    }

    isLoaded() {
        return this.state.isLoaded
    }
}

export default BaseComponent;