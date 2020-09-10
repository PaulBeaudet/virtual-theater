import React, { useEffect, useContext } from 'react';
import Firebase, { uiConfig } from '../services/firebase';
import { StyledFirebaseAuth } from 'react-firebaseui'
import { useHistory } from 'react-router-dom';
import { GlobalUserContext } from '../context/GlobalState';

const Auth: React.FC = () => {
  const history = useHistory();
  const { dispatch } = useContext(GlobalUserContext)
  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        history.push('/theater')
      } else {
        history.push('/')
      }
    });
  }, [history, dispatch]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h1> Virtual conference demo </h1>
      <p>Join Room</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={Firebase.auth()} />
    </div>
  );
};

export default Auth;