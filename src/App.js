import React, { Component } from 'react';
import logo from './logo.svg';
import URLDecoder from './com/url-decoder'
import JSONFormater from './com/json-formater'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const Home = () => <div></div>

class App extends Component {
  render() {
    return (
        <Router>
          <div style={{
            width: "950px",
            margin: "auto"
          }}>
            <div style={{
              fontSize: 30,
              width: "200px",
              height: "80px",
              margin: "auto",
            }}>My Toolbox</div>
            <nav style={{
              float: "left",
              width: "180px",
              textAlign: "left"
            }}>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/url-decode">Decode a URL</Link></li>
                <li><Link to="/json-format">Format a Json</Link></li>
              </ul>
            </nav>
            <div style={{
              float: "right",
              width: "700px"
            }}>
              <Route path='/' component={Home} />
              <Route path='/url-decode' component={URLDecoder} />
              <Route path='/json-format' component={JSONFormater} />
            </div>
          </div>

        </Router>
    );
  }
}

export default App;
