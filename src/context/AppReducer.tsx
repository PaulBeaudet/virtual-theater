import { reducerActionType, GlobalContextType } from "../interfaces"
import { roomLayout, defaultUser } from "./GlobalState"

export default (state: GlobalContextType, action: reducerActionType) => {
  if (action.type === 'SIGN_IN') {
    // add user data when logged in
    return {
      ...state,
      loggedIn: {
        ...action.payload
      },
    }
  } else if (action.type === 'SIGN_OUT') {
    // remove user data when logged
    return {
      loggedIn: {},
      participants: roomLayout
    }
  } else if (action.type === 'LOAD_ROOM') {
    // full inplace 2d array update. Lazy expensive way to mutate
    return {
      ...state,
      participants: action.payload,
    }
  } else if (action.type === 'ADD_USER') {
    // As time goes by additions of joining participants
    const { seat, table, user } = action.payload
    const newParticipants = [...state.participants]
    newParticipants[table][seat] = user
    return {
      ...state,
      participants: newParticipants,
    }
  } else if (action.type === 'ADD_SELF') {
    // Used when initially joining table
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
    // Switches seat without loading the whole 2d array
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
    // For animating user's meeple
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