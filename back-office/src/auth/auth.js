import { useNavigate } from 'react-router-dom';
import {useSignIn, useSignOut} from 'react-auth-kit';
import {Axios} from '../api/axios';
import { useState } from 'react';


export const Authentication =() => {
    const axios = Axios();
    const Login = useSignIn();
    const Logout = useSignOut()
    const Navigate =  useNavigate()
    const [error_msg, setError_msg]   = useState('');
    const DoLogin  = async  (username, password) => {
        try {
            console.log({username,password})
            const response = await axios.post('Admin/Login', {"Username":username, "Password":password})
            const {access_token, refresh_token, Permission, Image, Id} = response.data
            Login({
                token: access_token, 
                expiresIn:300,
                tokenType: 'Bearer',
                authState: {username, Image, Id},
                refreshToken: refresh_token,
                // refreshTokenExpireIn:86400
            });
            setError_msg('');
            Navigate('/home')     
    
        }
        catch(error){
            console.log(error);
            setError_msg('Votre login est invalide! Veuillez réesayer à nouveau');
            Navigate('/')
        }
   };
    const DoLogOut = ()=> {
        Logout();
        Navigate('/')
    
    }

    return {DoLogin, DoLogOut, error_msg }

}

