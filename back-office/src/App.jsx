import './App.css'
import Login from './pages/login'
import Home from './pages/home'
import Dashboard from './pages/dashboard'
import Event from './pages/event'
import Users from './pages/users'
import Attendance from './pages/attendance'
import Menu from './pages/menu'
import Group from './pages/groups'
import Member from './pages/members'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import { RequireAuth } from 'react-auth-kit'


function App() {


  const router =  createBrowserRouter([
    {
      path:'/',
      element: <Login />
    },
    {
      path:'/home',
      element: <RequireAuth loginPath='/'> <Home /> </RequireAuth>,
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
          path:'group',
          element:<Group /> ,
        },
        {
          path:'member',
          element:<Member /> ,
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
