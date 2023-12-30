
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Inventory from "./Inventory"

import Home from './pages/Home';
import Update from './components/Update';
import Sales from './pages/Sales';
import Order from './pages/Order';

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
    }
  ]);

  return (
    <>
      
            <RouterProvider router={router} />
          
    </>
  )
}

export default App
