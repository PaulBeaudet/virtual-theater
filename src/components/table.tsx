// table.tsx Copyright 2020 Paul Beaudet
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
import React from 'react'
import { tableProps } from '../interfaces'
import Seat from './seat'
import { ws } from '../apis/WebSocket'

// Component for tables within a virtual conference room
const Table: React.FC<tableProps> = ({ tableObj, tableNumber }) => {
  // Selection event for changing tables on double click
  const tableSelection = () => {
    ws.msg('switch_table', {
      table: tableNumber,
    })
  }
  return (
    <div className='rt-room'
      onDoubleClick={tableSelection}
      style={{
        width: tableObj.width,
        height: tableObj.height,
        top: tableObj.y,
        left: tableObj.x,
      }}>
      {tableObj.seats.map((seat, seatIndex) => {
        return (<Seat
          key={String(seat.x) + String(seat.y)}
          seatObj={seat}
          seatNumber={seatIndex}
          tableNumber={tableNumber}
        />)
      })}
      <div className='rt-room-name'>{tableObj.id}</div>
    </div>
  )
}

export default Table
