import React, { useContext } from 'react'
import { ws } from '../apis'
import { GlobalUserContext } from 'context/GlobalState'
// import { userType } from 'interfaces'

const MaxAllowedDropdown = () => {
  const { state } = useContext(GlobalUserContext)
  const { table } = state.loggedIn

  let tableSizeOptions: Array<number> = [3, 4, 5, 6]

  const changeTableSize = (event: any) => {
    ws.msg('TABLE_MAX', {
      table,
      max: event.target.value,
    })
  }

  const showDropdown = tableSizeOptions.length ? true : false
  return (
    <div>
      {showDropdown &&
        <label htmlFor='max_allowed'>Max allowed for my table </label>}
      {showDropdown &&
        <select name='max_allowed'
          id='max_allowed'
          onChange={changeTableSize}
          defaultValue={tableSizeOptions[tableSizeOptions.length - 1]}>
          {tableSizeOptions.map((size) => {
            return <option key={size} value={size}>{size}</option>
          })}
        </select>
      }
    </div>
  )
}

export default MaxAllowedDropdown