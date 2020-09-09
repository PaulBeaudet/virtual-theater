import React, { useContext, useEffect } from 'react'
import './Theater.scss'
import MapImage from '../assets/conference-map.svg'
import TableConfig from './tableConfig.json'
import SignOut from 'modules/Logout'
import User from 'modules/User'
import { GlobalUserContext } from 'context/GlobalState'
import Table from './table'
import { ws } from 'apis'
import Firebase from '../services/firebase'
import { useHistory } from 'react-router-dom'
import { personalType } from 'interfaces'

const Theater: React.FC = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(GlobalUserContext)
  useEffect(() => {
    ws.on('new_user', (req: any) => {
      dispatch({
        type: 'ADD_USER',
        payload: req,
      })
    })
    ws.on('load_room', (req: any) => {
      dispatch({
        type: 'LOAD_ROOM',
        payload: req.roomLayout,
      })
    })
    ws.on('room full', () => {
      alert('Room full! Sorry')
    })
    ws.on('table_taken', () => {
      alert('Table taken! Sorry')
    })
    ws.init(() => {
      Firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          const addUserData: personalType = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
          }
          dispatch({
            type: 'SIGN_IN',
            payload: addUserData
          })
          ws.msg(`new-user`, addUserData)
          window.addEventListener('beforeunload', () => {
            ws.msg('unload', {
              uid: user.uid
            })
          })
        } else {
          history.push('/')
        }
      })
    })
  }, [dispatch, history])

  if (state.loggedIn === null) { return null }
  return (
    <div className='remo-theater' style={{
      width: TableConfig.width, height: TableConfig.height
    }}>
      <div className='rt-app-bar'>
        <SignOut />
        <User />
      </div>
      <div className='rt-rooms'>
        {TableConfig.tables.map((tableObj, tableIndex) => {
          return (<Table key={tableObj.id} tableObj={tableObj} tableNumber={tableIndex} />)
        })}
      </div>
      <div className='rt-background'>
        <img src={MapImage} alt='Conference background' />
      </div>
    </div>
  )
};

export default Theater;