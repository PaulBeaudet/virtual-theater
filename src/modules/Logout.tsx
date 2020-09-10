import React, { useContext } from 'react';
import Firebase from '../services/firebase';
import { GlobalUserContext, userState, personalUser } from 'context/GlobalState';
import { ws } from '../apis';
import { useHistory } from 'react-router-dom';

const SignOut: React.FC = () => {
  const { state, dispatch } = useContext(GlobalUserContext)
  const history = useHistory()

  const logoutFunc = () => {
    Firebase.auth().signOut()
      .then(() => {
        history.push('/');
      })
    ws.msg('logout', { uid: state.loggedIn.uid })
    dispatch({
      type: 'SIGN_OUT',
      payload: userState,
    });
  }

  const numberOfFlashes = 10
  let flashes = 0
  const highlightBlink = () => {
    const original = personalUser.highlight ? personalUser.highlight : 'red'
    let highlight = flashes % 2 === 0 ? 'yellow' : original
    // Base case: flashes have exceeded number of flashes
    if (flashes <= numberOfFlashes) {
      flashes++
      setTimeout(highlightBlink, 190)
    } else {
      flashes = 0
      highlight = original
    }
    dispatch({
      type: 'HIGHLIGHT',
      payload: {
        highlight
      }
    })
  }

  const triggerHighlightBlink = () => {
    if (!flashes) {
      highlightBlink()
    } // button only works at zero flashes
  }
  if (state.loggedIn === null) { return null } // hide component when logged out
  const { displayName } = state.loggedIn
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
      <h1> Virtual Theater </h1>
      {displayName && <p>Logged in as {displayName}</p>}
      <button onClick={logoutFunc}>
        Logout
      </button>
      <button onClick={triggerHighlightBlink}>
        Where am I?
      </button>
    </div>
  );
};

export default SignOut;