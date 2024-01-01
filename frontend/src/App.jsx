
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Inventory from "./Inventory"

import Home from './pages/Home';
import Update from './components/Update';
import Sales from './pages/Sales';
import Order from './pages/Order';
import Customer from './pages/Customer';

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Home/>
    },
    {
      path: "/inventory",
      element: <Inventory/>,
    },
    {
      path:"/update/:id",
      element:<Update/>
    },{
      path:"/sales",
      element:<Sales/>
    },{
      path:"/order",
      element:<Order/>
    },{
      path:"/customer",
      element:<Customer/>
    }
  ]);

  return (
    <>
      
            <RouterProvider router={router} />
          
    </>
  )
}

export default App
