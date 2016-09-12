import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Root from './components/Root';
import Welcome from './components/Welcome';
import Logout from './components/Logout';
import Login from './components/Login';
import App from './components/App';

render((
    <Router history={browserHistory}>
        <Route path="/" component={Root}>
            <IndexRoute component={App}>
                <IndexRoute component={Welcome} />
                <Route path="logout" component={Logout} />
            </IndexRoute>
            <Route path="login" component={Login} />
        </Route>
    </Router>
), document.getElementById('main'))
