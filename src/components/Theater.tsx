import React, { useContext, useEffect } from 'react';
import './Theater.scss';
import MapImage from '../assets/conference-map.svg';
import TableConfig from './tableConfig.json';
import SignOut from 'modules/Logout';
import User from 'modules/User';
import { GlobalUserContext } from 'context/GlobalState';
import { useHistory } from 'react-router-dom';
import Firebase from '../services/firebase'
import { userType } from '../interfaces'
import Table from './table';

const Theater: React.FC = () => {
  const { state, dispatch } = useContext(GlobalUserContext);
  const history = useHistory();
  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const addUserData: userType = {
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          email: user.email,
        }
        dispatch({
          type: 'SIGN_IN',
          payload: addUserData
        })
      } else {
        history.push('/');
      }
    })
  }, [history, dispatch])
  if (state.loggedIn === null) { return null; }
  return (
    <div className='remo-theater' style={{ width: TableConfig.width, height: TableConfig.height }}>
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