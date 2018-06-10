// data actions
import axios from 'axios';

export function getData(user, callback) {
  // const url = "http://localhost:8000/all/" + user._id;
  const url = "/all/" + user._id;
  axios.get(url).then((res) => {
    callback(null, res.data);
  }).catch((err) => {
    callback(err, null);
  });
}