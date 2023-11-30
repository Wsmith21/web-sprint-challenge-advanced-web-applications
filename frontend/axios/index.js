import axios from 'axios';

const axiosWithAuth = () => {
  const token = localStorage.getItem('token');

  return axios.create({
    baseURL: 'http://localhost:9000/api', // Replace with your API base URL
    headers: {
      Authorization: token || '', // Sending just the token without 'Bearer'
      'Content-Type': 'application/json',
    },
  });
};

export default axiosWithAuth;