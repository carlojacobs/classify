export function updateNotes(notes) {
  return {
		type: "UPDATE_NOTES",
		payload: {
			notes
		} 
 	}
}

export function updateStars(stars) {
	return {
		type: "UPDATE_STARS",
		payload: {
			stars
		} 
 	}
}