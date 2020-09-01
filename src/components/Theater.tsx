import React, { useContext } from 'react';
import './Theater.scss';
import MapImage from '../assets/conference-map.svg';
import TableConfig from './tableConfig.json';
import SignOut from 'modules/Logout';
import User from 'modules/User';
import { GlobalUserContext } from 'context/GlobalState';
import { useHistory } from 'react-router-dom';

const Theater: React.FC = () => {
  const { state } = useContext(GlobalUserContext);
  const history = useHistory();
  const firstTable = TableConfig.tables[0];
  if (!state.loggedIn) {
    history.push('/');
    return null;
  }
  return (
    <div className='remo-theater' style={{ width: TableConfig.width, height: TableConfig.height }}>
      <div className='rt-app-bar'>
        <SignOut />
        <User />
      </div>
      <div className='rt-rooms'>
        {/**
          * Create rooms here as in the requirement and make sure it is aligned with background
          */}
        <div className='rt-room' style={{
          width: firstTable.width,
          height: firstTable.height,
          top: firstTable.y,
          left: firstTable.x
        }}>
          <div className='rt-room-name'>
            {firstTable.id}
          </div>
        </div>
      </div>
      <div className='rt-background'>
        <img src={MapImage} alt='Conference background' />
      </div>
    </div>
  );
};

export default Theater;