import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import Sidebar from './components/Sidebar';
import UNCCanvas from './components/UNCCanvas';
import Home from './components/Home';
import React from 'react';

function App() {
  return (
  
    <React.Fragment>
      <Router>
      {/* <Sidebar/> */}
      <Switch>
        <Route exact path='/' component={UNCCanvas}></Route>
      </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
