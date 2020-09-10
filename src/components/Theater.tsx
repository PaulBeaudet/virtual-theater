import React, { useContext, useEffect } from 'react'
import './Theater.scss'
import MapImage from '../assets/conference-map.svg'
import TableConfig from './tableConfig.json'
import SignOut from 'modules/Logout'
import { GlobalUserContext, personalUser } from 'context/GlobalState'
import Table from './table'
import { ws } from 'apis'
import Firebase from '../services/firebase'
import { useHistory } from 'react-router-dom'
import { personalType } from 'interfaces'

const Theater: React.FC = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(GlobalUserContext)
  useEffect(() => {
    // signal server sends to update one user
    ws.on('ADD_USER', (payload: any) => {
      dispatch({
        type: 'ADD_USER',
        payload,
      })
    })
    // Signal server sends to completely refresh meeple positions
    ws.on('LOAD_ROOM', (req: any) => {
      dispatch({
        type: 'LOAD_ROOM',
        payload: req.roomLayout,
      })
    })
    // Signal server sends for user to have self awareness
    // Load yourself as a new user at the same it like ADD_USER
    ws.on('ADD_SELF', (payload: any) => {
      dispatch({
        type: 'ADD_SELF',
        payload,
      })
    })
    ws.on('UPDATE_SELF', (payload: any) => {
      dispatch({
        type: 'UPDATE_SELF',
        payload,
      })
    })
    // Signal server sends when all spots are taken
    ws.on('ROOM_FULL', () => {
      alert('Room full! Sorry')
    })
    // signal server sends when a table is taken
    ws.on('TABLE_TAKEN', () => {
      alert('Table taken! Sorry')
    })
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const addUserData: personalType = {
          ...personalUser,
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        }
        // Populate local user logged in info
        dispatch({
          type: 'SIGN_IN',
          payload: addUserData
        })
        // make connection to WebSocket server
        ws.init(() => {
          delete addUserData.seat
          delete addUserData.highlight
          ws.msg(`new-user`, addUserData)
        })
        // Provide a signal for server to know when user disconnects
        window.addEventListener('beforeunload', () => {
          ws.msg('unload', {
            uid: user.uid
          })
        })
      } else { // given no user show auth route
        history.push('/')
      }
    })
  }, [dispatch, history])

  // only show this component if logged in
  if (state.loggedIn === null) { return null }
  return (
    <div className='remo-theater' style={{
      width: TableConfig.width, height: TableConfig.height
    }}>
      <div className='rt-app-bar'>
        <SignOut />
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