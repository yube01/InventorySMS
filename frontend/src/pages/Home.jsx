import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <h1>Home</h1>
        <div className="flex gap-5">
        <Link to="/inventory">
            Inventory
        </Link>
        <Link to="/sales">
            Sales
        </Link>
        </div>
    </div>
  )
}

export default Home