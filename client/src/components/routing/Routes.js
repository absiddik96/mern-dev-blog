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
import ExperienceForm from "../profile-form/ExperienceForm";
import AddEducation from "../profile-form/EducationForm";

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
          <PrivateRoute exact path="/add-experience" component={ExperienceForm}/>
          <PrivateRoute exact path="/edit-experience/:exp_id" component={ExperienceForm}/>
          <PrivateRoute exact path="/add-education" component={AddEducation}/>
          <PrivateRoute exact path="/edit-education/:edu_id" component={AddEducation}/>
        </Switch>
      </section>
    </Fragment>
  );
};

export default Routes;