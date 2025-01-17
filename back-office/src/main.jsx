import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {AuthProvider} from 'react-auth-kit'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <AuthProvider  authType={'localstorage'}
    authName={'_auth'}
    refreshTokenName = {'_refresh_token'}
    cookieDomain={window.location.hostname}>
      <App /> 
    </AuthProvider>
  </React.StrictMode>,
)
