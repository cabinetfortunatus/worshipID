import axios from 'axios';
export const Axios = () => {

    const Instance = axios.create({
      baseURL: 'http://173.212.195.91:5001/'
      // headers: {
      //   'X-CSRFToken': getCsrfToken(),  
      //},
    });
  
    return Instance ;
  };
  


  