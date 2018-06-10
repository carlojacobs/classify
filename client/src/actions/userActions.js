// User actions
export function updateUser(user) {
	return {
		type: "UPDATE_USER",
		payload: {
			user
		} 
 	}
}

export function removeUser() {
	return {
		type: "REMOVE_USER"
	}
}
