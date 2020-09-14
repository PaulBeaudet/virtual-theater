// seat.tsx Copyright 2020 Paul Beaudet
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
import React, { useContext } from 'react'
import { seatProps } from '../interfaces'
import { GlobalUserContext } from 'context/GlobalState'

// Component for individual spots that meeples/avatars are placed in
const Seat: React.FC<seatProps> = ({ seatObj, tableNumber, seatNumber }) => {
  const { state } = useContext(GlobalUserContext)
  const { table, seat, highlight } = state.loggedIn
  const seatOfSelf = table === tableNumber && seat === seatNumber ? true : false
  const seatColor = seatOfSelf ? highlight : 'green'
  const name: string = state.participants[tableNumber][seatNumber].displayName
  const seatDimension = name ? 50 : 0
  return (
    <img
      src={state.participants[tableNumber][seatNumber].photoURL}
      alt={name}
      width={seatDimension}
      height={seatDimension}
      style={{
        borderRadius: name ? '50%' : '',
        border: name ? `4px solid ${seatColor}` : '',
        top: seatObj.y,
        left: seatObj.x,
        position: 'absolute'
      }}
    ></img>
  )
}

export default Seat