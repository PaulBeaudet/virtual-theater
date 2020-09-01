import React from 'react'
import { tableProps } from '../interfaces'

const Table: React.FC<tableProps> = ({ tableObj }) => {
  return (
    <div className='rt-room' style={{
      width: tableObj.width,
      height: tableObj.height,
      top: tableObj.y,
      left: tableObj.x,
    }}>
      <div className='rt-room-name'>{tableObj.id}</div>
    </div>
  )
}

export default Table
