// displays user data
import React, { useContext } from 'react'
import { GlobalUserContext } from 'context/GlobalState'

export default function User() {
  const { state } = useContext(GlobalUserContext);
  const picSize: number = 70
  if (!state.loggedIn) { return null }
  return (
    <div style={{
      top: '2%',
      left: '1290px',
      position: 'fixed',
      textAlign: 'center'
    }}>
      <h1>{state.displayName}</h1>
      <img src={state.photoURL} alt={` ${state.displayName}`} width={picSize} height={picSize} />
    </div>
  )
}
