import React, { createContext, useReducer } from 'react'
import AppReducer from './AppReducer'

interface userType {
  display_name: string | null
  photoUrl: string | null
}

export interface userContextType extends userType {
  photoUrl: string
}

// initial state
const userState = {
  isLoggedIn: false,
  display_name: '',
  photoUrl: '',
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