import axios from 'axios';
export const Axios = () => {
    const url = 'http://173.212.195.91:5001/'
    const Instance = axios.create({
      baseURL: url
      // headers: {
      //   'X-CSRFToken': getCsrfToken(),  
      //},
    });
  
    return Instance ;
  };
  


  