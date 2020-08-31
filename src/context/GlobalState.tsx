import React, { createContext, useReducer } from 'react'
import AppReducer from './AppReducer'
import { userContextType } from '../interfaces'

// initial state
export const userState: userContextType = {
  loggedIn: false,
  displayName: '',
  photoURL: '',
  uid: '',
  email: '',
};

interface props {
  children?: any
}

// Create the context
export const GlobalUserContext = createContext<userContextType | any>(userState);

export const GlobalUserProvider: React.FC<props> = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, userState);

  return (<GlobalUserContext.Provider value={{ state, dispatch }}>
    {children}
  </GlobalUserContext.Provider>);
}