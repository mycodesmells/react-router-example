import React, { Component, PropTypes } from 'react';

class Login extends Component {
    componentWillMount() {
        const { user } = this.props;

        if (user.auth) {
            this.context.router.push('/');
        }
    }

    render() {
        return <div>Login</div>;
    }
}

Login.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Login;
