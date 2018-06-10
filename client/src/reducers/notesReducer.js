// Notes reducer
// Initial state
const initialState = {
  notes: [],
  stars: []
}

const notesReducer = (state=initialState, action) => {
	switch (action.type) {
    case "UPDATE_NOTES":
      return {
        ...state,
        notes: action.payload.notes
      }
    case "UPDATE_STARS":
      return {
        ...state,
        stars: action.payload.stars
      }
		default:
			return state;
	}
}

export default notesReducer;
