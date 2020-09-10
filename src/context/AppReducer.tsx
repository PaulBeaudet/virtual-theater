import { reducerActionType, GlobalContextType } from "../interfaces"
import { roomLayout, defaultUser } from "./GlobalState"

export default (state: GlobalContextType, action: reducerActionType) => {
  if (action.type === 'SIGN_IN') {
    return {
      ...state,
      loggedIn: {
        ...action.payload
      },
    }
  } else if (action.type === 'SIGN_OUT') {
    return {
      loggedIn: {},
      participants: roomLayout
    }
  } else if (action.type === 'LOAD_ROOM') {
    return {
      ...state,
      participants: action.payload,
    }
  } else if (action.type === 'ADD_USER') {
    const { seat, table, user } = action.payload
    const newParticipants = [...state.participants]
    newParticipants[table][seat] = user
    return {
      ...state,
      participants: newParticipants,
    }
  } else if (action.type === 'ADD_SELF') {
    const { seat, table, user } = action.payload
    const newParticipants = [...state.participants]
    newParticipants[table][seat] = user
    const updatedSelf = {
      ...state.loggedIn,
      seat,
      table,
    }
    return {
      ...state,
      loggedIn: updatedSelf,
      participants: newParticipants,
    }
  } else if (action.type === 'UPDATE_SELF') {
    const { table, seat } = action.payload
    const participants = [...state.participants]
    const loggedIn = { ...state.loggedIn }
    if (loggedIn.table !== null && loggedIn.seat !== null) {
      // relocate to new seat
      participants[table][seat] = state.participants[loggedIn.table][loggedIn.seat]
      // vacate past seat
      participants[loggedIn.table][loggedIn.seat] = { ...defaultUser }
      // update loggedIn object
      loggedIn.table = table
      loggedIn.seat = seat
    }
    return {
      ...state,
      participants,
      loggedIn,
    }
  } else if (action.type === 'HIGHLIGHT') {
    return {
      ...state,
      loggedIn: {
        ...state.loggedIn,
        highlight: action.payload.highlight
      }
    }
  } else {
    return state;
  }
}