import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Learn from './pages/Learn';
import { Toaster } from 'react-hot-toast';
import DailyChallenge from './pages/DailyChallenge';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: '/learn',
    element: <Learn />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: 'dailyChallenge',
    element: <DailyChallenge />,
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
