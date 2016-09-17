# Auth Checks with react-router

One of the most common problem that we, as web developers, face with every single page app, is handling authentication. One of the things that we have to have in mind is redirecting unauthorized users from pages restricted for logged-in user. Let's take a look on how we should handle that without affecting page components too much.

### Information about users

In order to perform any authentication checks within the application, we need to know something about the user: whether they are logged in, their personal data, roles within application, etc. This should be done on the highest level possible - in our case we'll handle it in the `Root` component. At the moment, we'd like to focus on redirecting users, so let's assume that we just need to verify if the authentication token exists in browser's storage. Then we want to pass the data to children routes with `React.cloneElement(..)` function. In the end, our top-level component should look like this:

    // src/components/Root.js
    ...
    const Root = ({ children }) => {
        const token = localStorage.getItem('access_token');
        const user = token ? { auth: true, name: 'John Doe', token } : { auth: false };

        const childs = React.cloneElement(children, { user });

        return (
            <div><h1>Root level</h1>{ childs }</div>
        )
    }
    ...

### Redirecting programatically

One thing that we want to do is redirect our anonymous users to the login page every time they want to access some restricted page. This requires us to perform two actions: add react-router's context to the component's `contextTypes` attribute, and then add redirection logic. We need to remember, however, that we must not make switch the page within component's `render` method, as it will be recognized as a state change within rendering, what is considered a big anti-pattern in React (we'd be warned about that in the console). Instead, we should make the redirection in `componentWillMount` method, as it is caled before rendering:

    // src/components/App.js
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

To make our application consistent, we should also do the opposite on the login page - if the user is alread authenticated, we should redirect them to the welcome page (as we don't want to ask them about credentials any more):

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

### Summary

As you can see, checking if the user is authenticated doesn't require that much effort. This is certainly good piece of news for every web developer, as you can handle one of the most important aspect without too much hassle. Another advantage of having these checks performed that easy is that you should never overlook security in any of your applications, so making it easier by any means is really cool.

The source code of this example is available [on Github](https://github.com/mycodesmells/react-router-example).
