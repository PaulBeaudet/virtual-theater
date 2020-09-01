import React, { createContext, useReducer } from 'react'
import AppReducer from './AppReducer'
import { GlobalContextType } from '../interfaces'
import TableConfig from '../components/tableConfig.json'

// initial state
const roomLayout = TableConfig.tables.map((table) => {
  return table.seats.map(() => {
    return {
      displayName: '',
      photoURL: '',
    }
  })
})

export const userState: GlobalContextType = {
  loggedIn: {
    displayName: '',
    photoURL: '',
    uid: '',
    email: '',
  },
  participants: roomLayout,
};

interface props {
  children?: any
}

// Create the context
export const GlobalUserContext = createContext<GlobalContextType | any>(userState);

export const GlobalUserProvider: React.FC<props> = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, userState);

  return (<GlobalUserContext.Provider value={{ state, dispatch }}>
    {children}
  </GlobalUserContext.Provider>);
}