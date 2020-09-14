import React, { useContext } from 'react'
import { ws } from '../apis/WebSocket'
import { GlobalUserContext } from 'context/GlobalState'
import { userType } from 'interfaces'

// Dropdown for giving participant option of limiting others
// from joining their table
const MaxAllowedDropdown = () => {
  const { state } = useContext(GlobalUserContext)
  const { table } = state.loggedIn

  if (table !== null) {
    let tableSizeOptions: Array<number> = [3, 4, 5, 6]
    // event to change max size of allow participants for user's table
    const changeTableSize = (event: any) => {
      ws.msg('TABLE_MAX', {
        table,
        max: event.target.value,
      })
    }
    let defaultLimit = 6
    state.participants[table].forEach((seat: userType) => {
      if (seat.displayName === 'BLOCKED') {
        defaultLimit--
      }
    })
    return (
      <div>
        <label htmlFor='max_allowed'>Max allowed for my table </label>
        <select name='max_allowed'
          id='max_allowed'
          onChange={changeTableSize}
          defaultValue={defaultLimit}>
          {tableSizeOptions.map((size) => {
            return <option key={size} value={size}>{size}</option>
          })}
        </select>
      </div>
    )
  } else {
    // skip render until table resolves
    return null
  }
}

export default MaxAllowedDropdown