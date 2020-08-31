import React from 'react';
import Firebase from '../services/firebase';
import { useHistory } from 'react-router-dom';


const SignOut: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <button onClick={() => {
        Firebase.auth().signOut()
          .then(() => {
            history.push('/');
          })
      }}>
        Logout
      </button>
    </>
  );
};

export default SignOut;