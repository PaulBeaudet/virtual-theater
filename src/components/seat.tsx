import React, { useContext } from 'react'
import { seatProps } from '../interfaces'
import { GlobalUserContext } from 'context/GlobalState'

const Seat: React.FC<seatProps> = ({ seatObj, tableNumber, seatNumber }) => {
  const { state } = useContext(GlobalUserContext);
  const offset = 0;
  const name: string = state.participants[tableNumber][seatNumber].displayName;
  const seatDimension = name ? 50 : 0;
  return (
    <img
      src={state.participants[tableNumber][seatNumber].photoURL}
      alt={name}
      width={seatDimension}
      height={seatDimension}
      style={{
        borderRadius: name ? '50%' : '',
        border: name ? '4px solid green' : '',
        top: seatObj.y + offset,
        left: seatObj.x + offset,
        position: 'absolute'
      }}
    ></img>
  )
}

export default Seat