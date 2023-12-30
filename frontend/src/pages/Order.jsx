import NepaliDatepicker from 'nepali-datepicker-and-dateinput';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';

const Order = () => {

    const pb = new PocketBase('https://draw-wire.pockethost.io');


    const [current,setCurrent] = useState('')
    const [due,setDue] = useState('')
    const[type,setType] = useState('')
    const[order,setOrder] = useState('')
    const[quantity,setQuantity] = useState('')
    const [price,setPrice] = useState('')
    const[value,setValue] = useState([])
   

    const handleDateChange = (name, dateInMilli, bsDate, adDate) => {
         setCurrent(bsDate)
    }
    const handleDueDate = (name, dateInMilli, bsDate, adDate) => {
        setDue(bsDate)
   }

   const viewData = async()=>{
    pb.autoCancellation(false)
    const records = await pb.collection('orderItem').getFullList({
        sort: '-created',
    });
    setValue(records)

   }
   useEffect(()=>{
    viewData()
   },[])

    const addOrder = async(e)=>{
        e.preventDefault()
        try {
            const data = {
                "orderCreationDate": current,
                "orderStaffId": "23",
                "customerId": "23",
                "orderDueDate": due,
                "orderStatus": "pending"
            };
            
            const record = await pb.collection('order').create(data);
            setOrder(record.id)
            console.log(record.id)
        } catch (error) {
            console.log(error)
            
        }
    }
    

    const addOderItem = async(e)=>{
        e.preventDefault()
        let total = quantity * price
        console.log(total)
        try {
            const data = {
                "orderId": [
                    order
                ],
                "productId": [
                    type
                ],
                "quantity": quantity,
                "price": price,
                "amount": total
            };
            
            const record = await pb.collection('orderItem').create(data);
            console.log(record)
            viewData()
        } catch (error) {
            console.log(error)
            
        }
    }

    const realName = {
        "h3jn9e18t918jjw": "Chi Momo",
        "roivwboyvm2pfje": "Veg Momo",
        "zf8j99zl4ft79lf": "Pork Momo",
        "305fxlc0m9o76p1": "Buff Momo"
      };


  return (
    <div className=' bg-cyan-300'>
        <h1>Insert Order</h1>
        <form onSubmit={addOrder} className=' flex gap-5 flex-col'>
          
            <div className=' w-32 cursor-pointer'>
            <NepaliDatepicker
                onChange={handleDateChange}
                label=""
                showDefaultDate
                defaultFormat
                locale="en"/>
            </div>
          
            
            <div>
            <label>Order Delivery Date</label>
            <div className=' w-32 cursor-pointer'>
            <NepaliDatepicker
    
                onChange={handleDueDate}
                label=""
                showDefaultDate
                defaultFormat
                locale="en"/>
            </div>
            </div>

            <input type="submit" className=" cursor-pointer border-black border-2" value="Add"  />
        </form>
        <form onSubmit={addOderItem} className=' flex gap-5 flex-col'>
            
            <h1>Add Product Detail</h1>
            <div className=' flex gap-4'>
            <label>Choose Product</label>
            <select name="" id="" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Select the option</option>
                <option value="h3jn9e18t918jjw">Chi Momo</option>
                <option value="roivwboyvm2pfje">Veg Momo</option>
                <option value="zf8j99zl4ft79lf">Pork Momo</option>
                <option value="305fxlc0m9o76p1">Buff Momo</option>
            </select>
           
            </div>
            <div>
            <label>Quantity</label>
            <input type="number" value={quantity}  onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div>
            <label>Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <input type="submit" className=" cursor-pointer border-black border-2 " value="Add"  />
        </form>
        <div>
            <h1>Order History</h1>
            <div>
                <table border={1}>
                    <thead>
                    <tr className=' p-5'>
                      
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Amount</th>
                    </tr>
                    </thead>
                    <tbody className=' p-5'>
                        {
                            value.map((v)=>(
                                <tr className=' p-5' key={v.id}>
                                    <th>{realName[v.productId]}</th>
                                    <th>{v.quantity}</th>
                                    <th>{v.price}</th>
                                    <th>{v.amount}</th>
                                </tr>
                            ))

                        }

                    </tbody>

                </table>
            </div>
       </div>
    </div>
  )
}

export default Order