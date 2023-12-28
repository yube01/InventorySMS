
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Inventory from "./Inventory"

import Home from './pages/Home/Home';
import Update from './components/Update';

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
    }
  ]);

  return (
    <>
      
            <RouterProvider router={router} />
          
    </>
  )
}

export default App
