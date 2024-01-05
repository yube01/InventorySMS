import { useState } from "react"
import PocketBase from 'pocketbase';
import { Link } from "react-router-dom";


const Customer = () => {


    const pb = new PocketBase('https://draw-wire.pockethost.io');

    const[cname,setCname] = useState("")
    const[address,setAddress] = useState("")
    const[phone,setPhone] = useState("")
    const[discount,setDiscount] = useState("")
    const[vno,setVno] = useState("")

    // sends data to taxableCustomer table
    const addCustomer = async(e)=>{
        e.preventDefault()

        try {
            const data = {
                "customerName": cname,
                "address": address,
                "phone": phone,
                "discount": discount,
                "vatNo": vno
            };
            
            const record = await pb.collection('taxableCustomer').create(data);
            console.log(record)
            
        } catch (error) {
            console.log(error)
        }

    }

  return (
    <div className=" bg-cyan-200 w-70">
      <Link to="/" className="bold text-lg border-2 border-black p-0.5 rounded-lg mt-1">
        Home
      </Link>
        <h1 className=" mt-3">Add Customer Detail</h1>
        <form onSubmit={addCustomer} className=' flex gap-5 flex-col'>
            <div>
            <label>Customer Name</label>
            <input type="text" value={cname}  onChange={(e) => setCname(e.target.value)} />
            </div>
            <div>
            <label>Address</label>
            <input type="text" value={address}  onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
            <label>Phone</label>
            <input type="number" value={phone}  onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
            <label>Discount</label>
            <input type="number" value={discount}  onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <div>
            <label>Vat No</label>
            <input type="number" value={vno}  onChange={(e) => setVno(e.target.value)} />
            </div>
            


          <input type="submit" className=" cursor-pointer border-black border-2" value="Add"  />
      </form>
    </div>
  )
}

export default Customer