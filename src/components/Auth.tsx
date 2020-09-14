// Auth.tsx Copyright 2020 Paul Beaudet
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
import React, { useEffect, useContext } from 'react';
import Firebase, { uiConfig } from '../services/firebase';
import { StyledFirebaseAuth } from 'react-firebaseui'
import { useHistory } from 'react-router-dom';
import { GlobalUserContext } from '../context/GlobalState';

const Auth: React.FC = () => {
  const history = useHistory();
  const { dispatch } = useContext(GlobalUserContext)
  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        history.push('/theater')
      } else {
        history.push('/')
      }
    });
  }, [history, dispatch]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h1> Virtual conference demo </h1>
      <p>Join Room</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={Firebase.auth()} />
    </div>
  );
};

export default Auth;