import { reducerActionType, GlobalContextType } from "../interfaces"
import { roomLayout } from "./GlobalState"

export default (state: GlobalContextType, action: reducerActionType) => {
  if (action.type === "SIGN_IN") {
    return {
      ...state,
      loggedIn: {
        displayName: action.payload.displayName,
        photoURL: action.payload.photoURL,
        uid: action.payload.uid,
        email: action.payload.email,
      },
    }
  } else if (action.type === "SIGN_OUT") {
    return {
      loggedIn: {},
      participants: roomLayout
    }
  } else if (action.type === "LOAD_ROOM") {
    return {
      ...state,
      participants: action.payload,
    }
  } else if (action.type === "ADD_USER") {
    const { seat, table, user } = action.payload
    const newParticipants = [...state.participants]
    newParticipants[table][seat] = user
    return {
      ...state,
      participants: newParticipants,
    }
  } else if (action.type === "REMOVE_USER") {
    const newRoom = state.participants.map(tables => {
      return tables.filter((seat) => {
        return seat.uid !== action.payload.uid
      })
    })
    return {
      ...state,
      participants: newRoom,
    }
  } else {
    return state;
  }
}