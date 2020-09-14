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
