import { useState } from "react"
import PocketBase from 'pocketbase';


const Sales = () => {


    const pb = new PocketBase('https://draw-wire.pockethost.io');

    const [name,setName] = useState('')
    const [address,setAddress] = useState('')
    const [phone,setPhone] = useState('')
    const [discount,setDiscount] = useState('')
    const [type,setType] = useState("Chicken");
    const [size,setSize] = useState("Big")



    const addUser = async(e)=>{
        e.preventDefault();

        

        try {
            const data = {
                "customerName": name,
                "PhoneNo": phone,
                "Address": address,
                "CType": "non-tax"
            };
            
            const record = await pb.collection('customer').create(data);
            console.log(record)
            console.log("Customer Added")
          
           
            
        } catch (error) {
            console.log(error)
            
        }
    }

  return (
    <div>
        <h1>Non Taxable Sale</h1>
        <form onSubmit={addUser} className=' flex gap-5 flex-col'>
            <div>
            <label>Customer Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div>
            <label>Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}/>
            </div>
            <div>
            <label>Phone Number</label>
            <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)}/>
            </div>

            <div className=' flex gap-4'>
            <label>Product</label>
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
            <label>Discount</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <input type="submit" className=" cursor-pointer border-sky-100 border-2" value="Add"  />
        </form>
    </div>
  )
}

export default Sales