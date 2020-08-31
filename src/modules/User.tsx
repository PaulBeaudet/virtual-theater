// displays user data
import React, { useContext } from 'react'
import { GlobalUserContext } from 'context/GlobalState'

export default function User() {
  const { state } = useContext(GlobalUserContext);
  return (
    <>
      <span style={{ display: "block" }}>{state.displayName}</span>
      <img src={state.photoURL} alt={` ${state.displayName}`} width="130" height="130" />
    </>
  )
}
