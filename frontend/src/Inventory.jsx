import React, { useEffect, useState } from 'react'
import PocketBase from 'pocketbase';
import { Link, json } from 'react-router-dom';
import NepaliDatepicker from 'nepali-datepicker-and-dateinput';


const Inventory = () => {

    const pb = new PocketBase('https://draw-wire.pockethost.io');

    const [piece,setPiece] = useState('');
    const [type,setType] = useState("h3jn9e18t918jjw");
    // const [size,setSize] = useState("Big")
    const [quantity,setQuantity] = useState('')
    const [value,setValue] = useState([])
    const [up,setUp] = useState(false)
    const [date,setDate] = useState('')
    const [prev,setPrev] = useState(0)

    const handleDateChange = (name, dateInMilli, bsDate, adDate) => {
        console.log(name); // Prints the field name of date input
        console.log(dateInMilli); // Prints the equivalent date millisecond
        setDate(bsDate); // Prints the bsDate
        console.log(adDate); // Prints the equivalent adDate
      }


    const getData = async()=>{
        const record = await pb.collection('product').getOne(type, {
            expand: 'relField1,relField2.subRelField'})
        // setValue(record)
        setPrev(record.availablePieces)
    }

    useEffect(()=>{
        
       
        getData()

    },[])
    
    const handleDelete = async(id)=>{
      
        await pb.collection('inventory').delete(id);
        getData()
        

    }
    let total = 0

    const handleAdd = async(e)=>{
        e.preventDefault();

        

        try {
            const data = {
                "productionDate": date,
                "productId": type,
                "quantity": quantity,
                "productionStaffId": "23"
               
            };
            
            const record = await pb.collection('production').create(data);
            console.log(record)
            if(record){
                
                total = Number(quantity) + Number(prev)
                console.log(total)
                const data = {
                    
                    "availablePieces": total
                };
                const records = await pb.collection('product').update(type, data);
                console.log(records)
            }
           
            
        } catch (error) {
            console.log(error)
            
        }
    }
    const handleOpen = ()=>{
        setUp(true)
    }
    

  return (
    <div className='flex gap-10 relative'>
       <div>
       <h1 className=' mb-4'>Inventory Input</h1>
        <form onSubmit={handleAdd} className=' flex gap-5 flex-col'>
            <div>
            <label>Momo Input (per piece)</label>
            <div className=' w-32 cursor-pointer'>
       <NepaliDatepicker
    
                onChange={handleDateChange}
                label=""
                showDefaultDate
                defaultFormat
                locale="en"
  />
       </div>
            </div>

            <div className=' flex gap-4'>
            <label>Type</label>
            <select name="" id="" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="h3jn9e18t918jjw">Chi Momo</option>
                <option value="Veg">Veg Momo</option>
                <option value="Pork">Pork Momo</option>
                <option value="Buff">Buff Momo</option>
            </select>
           
            </div>

            <div>
            <label>Quantity</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <input type="submit" value="Add"  />
        </form>
       </div>
       <div>
            <h1>Available Product</h1>
            <div>
                <table border={1}>
                    <thead>
                    <tr className=' p-5'>
                      
                        <th>Momo perPiece</th>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th className=' p-5'>Date</th>
                        <th>Update</th>
                        <th>Delete</th>

                    </tr>
                    </thead>
                    <tbody className=' p-5'>
                        {
                            value.map((v)=>(
                                <tr className=' p-5' key={v.id}>
                               
                                                             <th>{v.Momo_perPiece}</th>
                                                             <th>{v.Type}</th>
                                                             <th>{v.Size}</th>
                                                             <th>{v.Quantity}</th>
                                                             <th>{v.created}</th>
                                                             <th className=' cursor-pointer'>
                                                                <Link to={`/update/${v.id}`}>
                                                                    Update
                                                                </Link>
                                                             </th>
                                                             <th className=' cursor-pointer' onClick={()=>handleDelete(v.id)}>Delete</th>
                                </tr>
                            ))

                        }

                    </tbody>

                </table>
            </div>
       </div>
       {
        up && (
            <form onSubmit={()=>{}} className=' flex gap-10 h-max flex-col
             absolute left-[30%] w-[30rem]
              bg-cyan-950 p-5'>
                <h1>Update</h1>
            <div className='flex flex-col'>
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

            <div className='flex flex-col'>
            <label>Quantity</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <input type="submit" value="Add"  />
        </form>
        )
       }
    </div>
  )
}

export default Inventory