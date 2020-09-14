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