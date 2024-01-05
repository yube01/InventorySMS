
import { Link } from 'react-router-dom'




const Home = () => {
 
  return (
    <div className=' w-full'>
        <h1>Home</h1>
       
        <div className="flex gap-5 justify-center bg-cyan-200 text-xl font-semibold mt-3">
        <Link to="/inventory">
            Inventory
        </Link>
        <Link to="/sales">
            Sales
        </Link>
        <Link to="/order">
            Place an order
        </Link>
        <Link to="/customer">
            Add Customer
        </Link>
        </div>
    </div>
  )
}

export default Home