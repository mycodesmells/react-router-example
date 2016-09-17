import React from 'react';

const Root = ({ children }) => {
    const token = localStorage.getItem('access_token');
    const user = token ? { auth: true, name: 'John Doe', token } : { auth: false };

    const childs = React.cloneElement(children, { user });

    return (
        <div><h1>Root level</h1>{ childs }</div>
    )
}

export default Root;
