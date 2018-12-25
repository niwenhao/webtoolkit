import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import URLDecoder from './com/url-decoder'
import JSONFormater from './com/json-formater'

class App extends Component {
  render() {
    return (
      <div className="App">
        <URLDecoder/>
        <JSONFormater/>
      </div>
    );
  }
}

export default App;
