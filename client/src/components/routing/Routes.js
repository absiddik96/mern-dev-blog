import React, {Fragment} from 'react';
import {Route, Switch} from "react-router-dom";

import Alert from "../layout/Alert";
import Login from "../auth/Login";
import Register from "../auth/Register";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../dashboard/Dashboard";
import Landing from "../layout/Landing";
import Navbar from "../layout/Navbar";
import ProfileForm from "../profile-form/ProfileForm";

const Routes = props => {
  return (
    <Fragment>
      <Navbar/>
      <Route exact path="/" component={Landing}/>
      <section className="container">
        <Alert/>
        <Switch>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/register" component={Register}/>
          <PrivateRoute exact path="/dashboard" component={Dashboard}/>
          <PrivateRoute exact path="/create-profile" component={ProfileForm}/>
          <PrivateRoute exact path="/edit-profile" component={ProfileForm}/>
        </Switch>
      </section>
    </Fragment>
  );
};

export default Routes;