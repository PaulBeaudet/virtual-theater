// displays user data
import React, { useContext } from 'react'
import { GlobalUserContext } from 'context/GlobalState'

export default function User() {
  const { state } = useContext(GlobalUserContext);
  const picSize: number = 70
  if (state.loggedIn === null) { return null }
  return (
    <div style={{
      width: '300px',
      height: '300px',
      top: '300px',
      left: '1610px',
      position: 'absolute',
      textAlign: 'center'
    }}>
      <h1>{state.loggedIn.displayName}</h1>
      <img
        src={state.loggedIn.photoURL}
        alt={` ${state.loggedIn.displayName}`}
        width={picSize}
        height={picSize} />
    </div>
  )
}
