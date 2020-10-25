import React from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage';
import {BrowserRouter as Router, Route,Switch, Redirect} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { Provider } from 'react-redux';
import store from './ReduxStore/Store';



function App() {

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <div className="sidenav">
            <Navbar/>
          </div>
          <div className="main">
            <Switch>
                <Route exact path="/h" component={Homepage}/>
                <Route exact path="/l" component={Login}/>
                <Route exact path="/s" component={Signup}/>
                <Route exact path="/d" component={Dashboard}/>
                <Route exact path="*">
                  <Redirect to="/h" />
                </Route>
            </Switch>
          </div>        
        </div>
      </Router>
    </Provider>
  );
}

export default App;
