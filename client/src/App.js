import React,{useReducer} from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import Dashboard from './components/Dashboard';


export const AppContext = React.createContext();

const initialState = {
  isUser:false,
  uid:''
}

const reducer = (state,action)=>{
  switch(action.type){
    case 'LOGIN': return {
      ...state,
      isUser:true
    }
    case 'LOGOUT' : return {
      isUser : false,
      uid:''
    }

    default : return state
  }
}

function App() {

  const [userDet,dispatch] = useReducer(reducer,initialState);

  return (
    <AppContext.Provider value={{userState:userDet,userFunc:dispatch}}>
      <Router>
        <div className="App">
          <div className="sidenav">
            <Navbar/>
          </div>
          <div className="main">
            <Switch>
                <Route exact path="/" component={Homepage}/>
                <Route exact path="/l" component={Login}/>
                <Route exact path="/s" component={Signup}/>
                <Route exact path="/d/:id" >
                    {
                      userDet.isUser ? <Dashboard uid={userDet.uid} /> : <Login/>
                    }
                </Route>
                <Route exact path="*" component={Homepage}/>
            </Switch>
          </div>        
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
