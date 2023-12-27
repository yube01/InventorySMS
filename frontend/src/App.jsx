
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Inventory from "./pages/inventory/Inventory";
import Sales from './pages/sales/Sales';
import Home from './pages/Home/Home';

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Home/>
    },
   
    {
      path: "/sales",
      element: <Sales/>,
    },
    {
      path: "/inventory",
      element: <Inventory/>,
    },
  ]);

  return (
    <>
      
            <RouterProvider router={router} />
          
    </>
  )
}

export default App
