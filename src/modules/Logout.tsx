import React, { useContext } from 'react'
import Firebase from '../services/firebase'
import { GlobalUserContext, userState, personalUser } from 'context/GlobalState'
import { ws } from '../apis/WebSocket'
import { useHistory } from 'react-router-dom'
import MaxAllowedDropdown from 'components/MaxAllowedDropdown'

// Dialog in presentation window of theater: ATM
// TODO: Should be broken out into separate components
// Parent Presentation1 | Children [logout, findMe, maxAllowedDropdown]
const SignOut: React.FC = () => {
  const { state, dispatch } = useContext(GlobalUserContext)
  const history = useHistory()
  const { displayName } = state.loggedIn

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

  // Event for finding one's own meeple
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

  // trigger of find meeple event that should filter redundant request
  // TODO: some redundant request still need to be filtered
  const triggerHighlightBlink = () => {
    if (!flashes) {
      highlightBlink()
    } // button only works at zero flashes
  }

  // hide component when logged out
  if (state.loggedIn === null) { return null }
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
      <h2> Virtual Theater </h2>
      {displayName && <p>Logged in as {displayName}</p>}
      <button onClick={logoutFunc}>
        Logout
      </button>
      <button onClick={triggerHighlightBlink}>
        Where am I?
      </button>
      <MaxAllowedDropdown />
    </div>
  )
}

export default SignOut