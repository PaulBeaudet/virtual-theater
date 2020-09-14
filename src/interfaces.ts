// interfaces.ts Copyright 2020 Paul Beaudet
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
export interface reducerActionType {
  type: string
  payload: any
}

export interface userType {
  displayName: string | null
  photoURL: string | null
}

export interface personalType extends userType {
  uid: string | null
  highlight?: string | null
  table: number | null
  seat: number | null
}

export interface GlobalContextType {
  loggedIn: personalType
  participants: userType[][]
}

interface xy {
  x: number
  y: number
}
export interface tableProps {
  tableObj: {
    width: number
    height: number
    y: number
    x: number
    id: string
    seats: xy[]
  }
  tableNumber: number
}

export interface seatProps {
  seatObj: xy
  tableNumber: number
  seatNumber: number
}

export interface wsType {
  instance: any | null
  server: string
  init: any
  handlers: any
  on: any
  incoming: any
  send: any
  msg: any
}