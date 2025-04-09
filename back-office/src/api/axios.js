import axios from 'axios';
export const Axios = () => {

    const Instance = axios.create({
      baseURL: 'http://localhost:5001/'
      // headers: {
      //   'X-CSRFToken': getCsrfToken(),  
      //},
    });
  
    return Instance ;
  };
  


  