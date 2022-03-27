import axios from 'axios';

const flaskApp = axios.create({
  baseURL: 'http://localhost:5000/'
});

export default flaskApp;
