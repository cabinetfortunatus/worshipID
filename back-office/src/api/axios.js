import axios from 'axios';
export const Axios = () => {

    const Instance = axios.create({
      baseURL: 'http://192.168.1.191:5000/'
      // headers: {
      //   'X-CSRFToken': getCsrfToken(),  
      //},
    });
  
    return Instance ;
  };
  


  