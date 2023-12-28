
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Inventory from "./Inventory"

import Home from './pages/Home';
import Update from './components/Update';
import Sales from './pages/Sales';

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
    }
  ]);

  return (
    <>
      
            <RouterProvider router={router} />
          
    </>
  )
}

export default App
