import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <h1>Home</h1>
        <Link to="/inventory">
            Inventory
        </Link>
    </div>
  )
}

export default Home