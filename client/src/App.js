import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
      <div className="App">
      Hello world
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
