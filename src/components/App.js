import React, { Component, PropTypes } from 'react';

class App extends Component {
    componentWillMount() {
        const { user } = this.props;

        if (!user.auth) {
            this.context.router.push('/login');
        }
    }

    render() {
        const { children } = this.props;

        return <div><h3>Hello, Cool User!</h3>{ children }</div>;
    }
}

App.contextTypes = {
    router: PropTypes.object.isRequired
}

export default App;
