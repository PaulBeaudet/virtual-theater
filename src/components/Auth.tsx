import React, { useEffect, useContext } from 'react';
import Firebase from '../services/firebase';
import { useHistory } from 'react-router-dom';
import { sendPostRequest } from '../apis';
import { GlobalUserContext } from '../context/GlobalState';

const Auth: React.FC = () => {
  const history = useHistory();
  const { dispatch } = useContext(GlobalUserContext)
  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(JSON.stringify(user, null, 4))
        sendPostRequest(`new-participant`, {
          name: user.displayName,
          photoUrl: user.photoURL,
        }).then(response => {
          dispatch({
            type: 'UPDATE_USER',
            payload: {
              display_name: user.displayName,
              photoUrl: user.photoURL,
            }
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