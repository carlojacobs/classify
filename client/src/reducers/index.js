// Combine reducer
// Imports
import { combineReducers } from 'redux';

// Reducers
import user from './userReducer';
import notes from './notesReducer';
import classes from './classesReducer';

// Combine reducers
const reducers = combineReducers({
	user,
	classes,
	notes
});

export default reducers;
