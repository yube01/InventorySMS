import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios"
import PocketBase from 'pocketbase';

const Update = () => {


    const pb = new PocketBase('https://draw-wire.pockethost.io');
    let userId = useParams()
    console.log(userId.id)
    const getData = async()=>{
        const records = await axios.get("https://draw-wire.pockethost.io"+`/api/collections/inventory/records/${userId.id}`)
        setPiece(records.data.Momo_perPiece)
        setSize(records.data.Size)
        setQuantity(records.data.Quantity)
        setType(records.data.Type)
        
    }

    useEffect(()=>{
        
       
        getData()

    },[])

    const [piece,setPiece] = useState();
    const [type,setType] = useState();
    const [size,setSize] = useState()
    const [quantity,setQuantity] = useState()


    const navigate = useNavigate()
  

    const handleUpdate = async(e)=>{
        e.preventDefault();

        

        try {
            const data = {
                "Momo_perPiece": piece,
                "Type": type,
                "Size": size,
                "Quantity": quantity
            };
            
            const record = await pb.collection('inventory').update(userId.id, data);
            navigate("/inventory")
            
           
            
        } catch (error) {
            console.log(error)
            
        }
    }

  return (
    <div>
        <form onSubmit={handleUpdate} className=' flex gap-5 flex-col'>
            <div>
            <label>Momo Input (per piece)</label>
            <input type="number" value={piece} onChange={(e) => setPiece(e.target.value)}/>
            </div>

            <div className=' flex gap-4'>
            <label>Type</label>
            <select name="" id="" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Chicken">Chi Momo</option>
                <option value="Veg">Veg Momo</option>
                <option value="Pork">Pork Momo</option>
                <option value="Buff">Buff Momo</option>
            </select>
            <select name="" id="" value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="Big">Big</option>
            <option value="Small">Small</option>
            </select>
            </div>

            <div>
            <label>Quantity</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <input type="submit" value="Update"  />
        </form>
    </div>
  )
}

export default Update