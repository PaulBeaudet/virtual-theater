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
    sendPostRequest('logout-participant', { uid: state.uid }).then(() => {
      console.log('Logged out server side')
    })
    dispatch({
      type: 'SIGN_OUT',
      payload: userState,
    });
  }

  if (!state.loggedIn) { return null } // hide component when logged out
  return (
    <div style={{
      top: '2%',
      left: '470px',
      position: 'fixed',
      textAlign: 'center'
    }}>
      <h1> Remo Ludo </h1>
      <button onClick={logoutFunc}>
        Logout
      </button>
    </div>
  );
};

export default SignOut;