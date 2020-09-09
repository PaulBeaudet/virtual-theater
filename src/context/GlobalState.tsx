import React, { createContext, useReducer } from 'react'
import AppReducer from './AppReducer'
import { GlobalContextType, userType, personalType } from '../interfaces'
import TableConfig from '../components/tableConfig.json'

// initial state
const defaultUser: userType = {
  displayName: '',
  photoURL: '',
}

export const roomLayout = TableConfig.tables.map((table) => {
  return table.seats.map(() => {
    return defaultUser;
  })
})

const personalUser: personalType = {
  ...defaultUser,
  uid: '',
}

export const userState: GlobalContextType = {
  loggedIn: personalUser,
  participants: roomLayout,
};

interface props {
  children?: any
}

// Create the context
export const GlobalUserContext = createContext<GlobalContextType | any>(userState);

export const GlobalUserProvider: React.FC<props> = ({ children }) => {
  const [state, dispatch] = useReducer<any>(AppReducer, userState);

  return (<GlobalUserContext.Provider value={{ state, dispatch }}>
    {children}
  </GlobalUserContext.Provider>);
}