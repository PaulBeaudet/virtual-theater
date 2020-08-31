import React, { useContext } from 'react';
import Firebase from '../services/firebase';
import { GlobalUserContext, userState } from 'context/GlobalState';


const SignOut: React.FC = () => {
  const { state, dispatch } = useContext(GlobalUserContext)
  if (!state.loggedIn) { return null } // only show when logged in
  return (
    <div style={{
      top: '2%',
      left: '470px',
      position: 'fixed',
      textAlign: 'center'
    }}>
      <h1> Remo Ludo </h1>
      <button onClick={() => {
        Firebase.auth().signOut()
          .then(() => {
            dispatch({
              type: 'SIGN_OUT',
              payload: userState,
            })
          })
      }}>
        Logout
      </button>
    </div>
  );
};

export default SignOut;