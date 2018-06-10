// User reducer
// Initial state
const initialState = {
	user: {
		_id: null,
		name: null,
		email: null
	}
}
// const initialState = {
// 	user: {
// 		_id: "5a219786538013868dba895b",
// 		name: "Carlo Jacobs",
// 		email: "carlojacobs91@gmail.com"
// 	}
// }

const userReducer = (state=initialState, action) => {
	switch (action.type) {
		case "UPDATE_USER": {
			return {
				...state,
				user: action.payload.user,
			}
		}
		case "REMOVE_USER": {
			return {
				...state,
				user: initialState.user
			}
		}
		default:
			return state;
	}
}

export default userReducer;
