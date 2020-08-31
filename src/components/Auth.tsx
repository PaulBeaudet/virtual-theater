import React, { useEffect, useContext } from 'react';
import Firebase from '../services/firebase';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from '../apis';
import { GlobalUserContext } from '../context/GlobalState';
import { userType } from 'interfaces';

const Auth: React.FC = () => {
  const history = useHistory();
  const { dispatch } = useContext(GlobalUserContext)
  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(JSON.stringify(user, null, 4))
        const addUserData: userType = {
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          email: user.email,
        }
        sendPostRequest(`new-participant`, addUserData)
          .then(response => {
            dispatch({
              type: 'SIGN_IN',
              payload: addUserData
            })
          });
        history.push('/theater');
      }
    });
  }, [history, dispatch]);
  const redirect = () => {
    const provider = new Firebase.auth.GoogleAuthProvider();
    Firebase.auth().signInWithPopup(provider);
  };

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
      <h1> Remo Coding Challenge Join Room </h1>
      <button onClick={redirect}> Login With Google </button>
    </div>
  );
};

export default Auth;