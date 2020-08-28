import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import Auth from './components/Auth';
import Theater from './components/Theater';
// import { createStore } from 'redux';
// import { Provider } from 'react-redux';
// import reducers from './reducers';
// import GlobalStateProvider from './store/GlobalStateProvider'
import { GlobalUserProvider } from './context/GlobalState'

// const store = createStore(reducers, {});

const App = () => {
  return (
    <GlobalUserProvider>
      <Router>
        <Switch>
          <Route exact={true} path='/' component={Auth} />
          <Route exact={true} path='/theater' component={Theater} />
        </Switch>
      </Router>
    </GlobalUserProvider>
  );
};

export default App;
