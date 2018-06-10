// Classes reducer
// Initial state
const initialState = {
	classes: []
}

const classesReducer = (state=initialState, action) => {
	switch (action.type) {
    case "UPDATE_CLASSES": 
      return {
        ...state,
        classes: action.payload.classes
      }
		default:
			return state;
	}
}

export default classesReducer;
