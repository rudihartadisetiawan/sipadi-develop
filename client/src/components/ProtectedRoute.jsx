import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../lib/auth';

const ProtectedRoute = ({ component: Component, allowedRoles = [], ...rest }) => {
  const authenticated = isAuthenticated();
  const currentUser = getCurrentUser();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authenticated) {
          return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
          return <Redirect to="/dashboard" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;