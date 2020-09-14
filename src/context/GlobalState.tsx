// GlobalState.tsx Copyright 2020 Paul Beaudet
// This file is part of Virtual-Theater.

// Virtual-Theater is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Virtual-Theater is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Virtual-Theater.  If not, see <https://www.gnu.org/licenses/>.
import React, { createContext, useReducer } from 'react'
import AppReducer from './AppReducer'
import { GlobalContextType, userType, personalType } from '../interfaces'
import TableConfig from '../components/tableConfig.json'

// initial state
export const defaultUser: userType = {
  displayName: '',
  photoURL: '',
}

export const roomLayout = TableConfig.tables.map((table) => {
  return table.seats.map(() => {
    return defaultUser;
  })
})

export const personalUser: personalType = {
  ...defaultUser,
  uid: '',
  highlight: 'red',
  table: null,
  seat: null,
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

// Global state component that child components can derive context from
export const GlobalUserProvider: React.FC<props> = ({ children }) => {
  const [state, dispatch] = useReducer<any>(AppReducer, userState);

  return (<GlobalUserContext.Provider value={{ state, dispatch }}>
    {children}
  </GlobalUserContext.Provider>);
}