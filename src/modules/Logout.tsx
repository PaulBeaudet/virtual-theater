import React, { useContext } from 'react';
import Firebase from '../services/firebase';
import { GlobalUserContext, userState } from 'context/GlobalState';
import { sendPostRequest } from '../apis';
import { useHistory } from 'react-router-dom';

const SignOut: React.FC = () => {
  const { state, dispatch } = useContext(GlobalUserContext)
  const history = useHistory();

  const logoutFunc = () => {
    Firebase.auth().signOut()
      .then(() => {
        history.push('/');
      })
    sendPostRequest('logout-participant', { ...state.loggedIn })
      .then(() => {
        console.log('Logged out server side')
      })
    dispatch({
      type: 'SIGN_OUT',
      payload: userState,
    });
  }

  if (state.loggedIn === null) { return null } // hide component when logged out
  return (
    <div style={{
      width: '300px',
      height: '300px',
      top: '300px',
      left: '772px',
      position: 'absolute',
      textAlign: 'center'
    }}
    >
      <h1> Remo Ludo </h1>
      <button onClick={logoutFunc}>
        Logout
      </button>
    </div>
  );
};

export default SignOut;