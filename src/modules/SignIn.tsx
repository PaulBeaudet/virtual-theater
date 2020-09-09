import React, { useEffect, useContext } from 'react';
import Firebase from '../services/firebase';
import { useHistory } from 'react-router-dom';
import { GlobalUserContext } from '../context/GlobalState';
import { personalType } from 'interfaces';


const SignIn: React.FC = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(GlobalUserContext)

  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const addUserData: personalType = {
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        }
        console.log(addUserData)
        // NOTE this doesn't actually work
        history.push('/theater');
      }
    });
  }, [history, dispatch]);

  const redirect = () => {
    const provider = new Firebase.auth.GoogleAuthProvider();
    Firebase.auth().signInWithPopup(provider);
  };

  if (state.loggedIn) { return null } // Only show sign in when logged out
  return (
    <div
      style={{
        top: '2%',
        left: '470px',
        position: 'fixed',
        textAlign: 'center'
      }}
    >
      <h1> Remo Ludo </h1>
      <button onClick={redirect}> Sign in with Google </button>
    </div>
  );
};

export default SignIn;