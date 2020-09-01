import React from 'react'
import { tableProps } from '../interfaces'
import Seat from './seat'

const Table: React.FC<tableProps> = ({ tableObj, tableNumber }) => {
  return (
    <div className='rt-room' style={{
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
