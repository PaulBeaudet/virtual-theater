import { reducerActionType, userContextType } from "../interfaces"



export default (state: userContextType, action: reducerActionType) => {
  const reduceObj = {
    UPDATE_USER: {
      ...state,
      display_name: action.payload.display_name,
      photoUrl: action.payload.photoUrl,
    }
  }
  return reduceObj[action.type] ? reduceObj[action.type] : state
  // turnery for default return case, because switches are long winded and error prone
}