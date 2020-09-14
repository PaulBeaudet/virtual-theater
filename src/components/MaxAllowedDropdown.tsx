// MaxAllowedDropdowns.tsx Copyright 2020 Paul Beaudet
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