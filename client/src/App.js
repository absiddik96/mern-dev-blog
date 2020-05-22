import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {Provider} from "react-redux";

import './App.css';
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import {loadUser} from "./actions/auth";
import Routes from "./components/routing/Routes";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  
  useEffect(() => {
    store.dispatch(loadUser())
  }, []);
  
  return (
    <Provider store={store}>
      <Router>
        <Route component={Routes}/>
      </Router>
    </Provider>
  );
};

export default App;
