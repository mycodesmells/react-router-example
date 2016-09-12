# Setting up React with Router

When creating a Single Page Application (SPA) you cannot go too far without setting up some kind of routing. Router is built into Angular 2 out of the box, but as React is a much lighter solution, some things must be configured at least semi-manually. Let's take a look at how you can make your simple React app up and running with react-router.

### Rendering routes

First of all, we need to remember that we need to render something. This doesn't changes, as it is a responsibility of our application to manage all routing changes, path matching etc. So, the bottom line is, we need to render a component that will represent all the routes. Once, we set up a place in our HTML template (best some `<div>` with a unique ID), we can create the main JavaScript file:

    import React from 'react';
    import { render } from 'react-dom';
    import { Router, hashHistory } from 'react-router';

    render((
        <Router history={ hashHistory }>
            ...
            // Routes definitions
            ...
        </Router>
    ), document.getElementById('main'))

As you can see, we set up two things - the main component called `Router` and bound its state with browsers hash history via `history` attribute.

### Building blocks

Routes built with `react-router` consist of two core components that you need to remember:
- `Route` is the most common one, and it contains a basic definition of which path should be rendered by which component
- `IndexRoute` is a shortcut for defining a route that should be mounted on _slash_, that is an index of given path

There was a time, where we had another piece in this puzzle called `Redirect`, but it has been replaced with a path wildcard so that all routes can be redirected to a given controller, most often some pretty _404 Not Found_ handler.

Building routes structure is relatively simple, as we represent nested routes with nested React components, that is we put children `Routes` into parent ones and declare their paths level-by-level so that they are very easy to read.

### Real example

Let's create a simple routing structure, where we want to have Three views: _Login Page_, _Logout Page_ and _Welcome Page_. Additionally, we'd like to have a common parent to the _Logout_ and _Welcome_, as we would in a reap application (we're not going to bother about authentication here). We should start with the bottom, and create three components rendering pages' content:

    // Common for all components files
    import React from 'react';

    // src/components/Login.js
    const Login = () => <div>Login</div>
    export default Login;

    // src/components/Logout.js
    const Logout = () => <div className="logout">Logout</div>
    export default Logout;

    // src/components/Welcome.js
    const Welcome = () => <div className="welcome">Welcome</div>;
    export default Welcome;

To make a common template to both pages for logged-in users, we need to create another view, which can be called `App`. It is slightly different, as we need to tell React where should we render nested routes, passed as `children` property. We can still use shorter React component syntax and use the fact, that `props` are passed as a first argument:

    // src/components/App.js
    const App = ({ children }) => <div><h3>Hello, Cool User!</h3>{ children }</div>
    export default App;

Last but not least, we'll create a `Root` component (using a very similar approach as for `App`):

    // src/components/Root.js
    const Root = ({ children }) => <div><h1>Root level</h1>{ children }</div>;
    export default Root;    

Once we have our components ready to use, we can start defining routes. Our `Root` component will serve as a root indeed:

    <Route path="/" component={ Root }>
        ...
    </Route>

Then, we can define two child routes: `App` and `Logout` or logged-in and anonymous users, respectively:

    ...
    <IndexRoute component={ App }>
        ...
    </IndexRoute>
    <Route path="login" component={ Login } />
    ...

As we want to serve our application on a _slash_ route, we define our `App` route as an `IndexRoute`. If the user adds `login` to it, they will be redirected to our _Login Page_.

Finally, we add two last routes for logged-in user:

    ...
    <IndexRoute component={ Welcome } />
    <Route path="logout" component={ Logout } />
    ...

In the end, our routes definition should look like this:

    <Router history={ browserHistory }>
        <Route path="/" component={ Root }>
            <IndexRoute component={ App }>
                <IndexRoute component={ Welcome } />
                <Route path="logout" component={ Logout } />
            </IndexRoute>
            <Route path="login" component={ Login } />
        </Route>
    </Router>

### Making it work with Webpack

The last step we need to perform is building all the sources into some output file included in the main HTML file. Webpack is probably the most common solution, and it needs just a few steps. First, let's create our `package.json`:

    $ npm init -y

Then we can make our development easier by creating a `.npmrc` file to make npm automatically save all dependencies to the configuration (with locked versions as well):

    // .npmrc
    save=true
    save-exact=true

Now installing dependencies is much easier (we just need to explicitly define which ones are `devDependencies`):

    $ npm i react react-dom react-router
    $ npm i --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react webpack

Then we need to add a simple configuration file for Webpack, so that it can take responsibility for transpiling our ES6 and JSX code into plain ES5 via `babel-loader`:

    // webpack.config.js
    var path = require('path');

    module.exports = {
        entry: './src/index.js',
        output: './public/bundle.js',
        module: {
            loaders: [
                { test: /\.js$/, loader: "babel-loader", query: { presets: ['es2015', 'react'] } }
            ]
        }
    };

To make our development easier, we should also define the transpiling process as an npm script, and call it with eg. `npm run build`:

    // package.json
    ...
    "scripts": {
      "build": "webpack --config webpack.config.js public/bundle.js"
    },
    ...

And this is it! Once we do all this, we can run the build and open our HTML template in a browser to see how smoothly our SPA works!

The source code of this example is available [on Github](https://github.com/mycodesmells/react-router-example).
