import { useState } from 'react'
import './App.css'
import Login from './pages/login'
import Home from './pages/home'
import Dashboard from './pages/dashboard'
import Event from './pages/event'
import Users from './pages/users'
import Attendance from './pages/attendance'
import Menu from './pages/menu'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'

function App() {

  const router =  createBrowserRouter([
    {
      path:'/',
      element: <Login />
    },
    {
      path:'/home',
      element: <Home />,
      children:[
        {
          path:'',
          element:<Menu />,
        },
        {
          path:'dashboard',
          element:<Dashboard />,
        },
        {
          path:'event',
          element:<Event /> ,
        },
        {
          path:'attendance',
          element:<Attendance />,
        },
        {
          path:'user',
          element:<Users />,
        },

      ]
    }
  ])
  return (
    <>        
      <RouterProvider router={router}  />
    </>
  )
}

export default App
