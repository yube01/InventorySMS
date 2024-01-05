import NepaliDatepicker from 'nepali-datepicker-and-dateinput';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Order = () => {

    const pb = new PocketBase('https://draw-wire.pockethost.io');


    const [current,setCurrent] = useState('')
    const [due,setDue] = useState('')
    const[type,setType] = useState('')
    const[order,setOrder] = useState('')
    const[quantity,setQuantity] = useState('')
    const [price,setPrice] = useState('')
    const[value,setValue] = useState([])

    const[pvalue,setPvalue] = useState([])

    const[idMap,setIdMap] = useState([])
    const[customer,setCustomer] = useState([])
    const[cid,setCid] = useState("")

    const[open,setOpen] = useState(false)
   

    // shows current nepali calender date 
    const handleDateChange = (name, dateInMilli, bsDate, adDate) => {
         setCurrent(bsDate)
    }
    const handleDueDate = (name, dateInMilli, bsDate, adDate) => {
        setDue(bsDate)
   }

   // fetch orderItem data 
   const viewData = async()=>{
    pb.autoCancellation(false)
    const records = await pb.collection('orderItem').getFullList({
        sort: '-created',
    });
    setValue(records)


   }





   //fetches product table data 
   const viewProductData = async()=>{
    const momoMapping = {};
    try {
   
     const records = await pb.collection('product').getFullList({
         sort: '-created'})
        

        // stores data in momoMapping as key value pair
        records.forEach(record => {
        const { id, productName } = record;
        momoMapping[id] = productName;
        setIdMap(momoMapping)
    });

         setPvalue(records)
         
       
    } catch (error) {
     console.log(error)
     
    }
     
 }

 // fetches taxableCustomer detail
 const customerDetail = async()=>{
    try {
        const records = await pb.collection('taxableCustomer').getFullList({
            sort: '-created',
        });
        setCustomer(records)
    } catch (error) {
        console.log(error)
    }
 }

  

   useEffect(()=>{
    viewData()
    viewProductData()
    customerDetail()
   },[])

   // called when form tag is submited
    const addOrder = async(e)=>{
        e.preventDefault()
        try {
            const data = {
                "orderCreationDate": current,
                "orderStaffId": "23",
                "customerId": cid,
                "orderDueDate": due,
                "orderStatus": "pending"
            };
            
            // sends data to order table
            const record = await pb.collection('order').create(data);
            setOrder(record.id)
            console.log(record.id)
            if(record){
                setOpen(true)
            }
        } catch (error) {
            console.log(error)
            
        }
    }
    

    // sends data to orderItem table
    const addOderItem = async(e)=>{
        e.preventDefault()
        let total = quantity * price
        console.log(total)
        try {
            const data = {
                "orderId":order,
                "productId":type,
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

  


  return (
    <div className=' bg-cyan-300'>
         <Link to="/" className="bold text-lg border-2 border-black p-0.5 rounded-lg mt-1">
        Home
      </Link>
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
          <label>Select Customer</label>
          <select name="" id="" value={cid} onChange={(e) => {setCid(e.target.value)}}>
            <option value="">Select the customer</option>
            {
                customer.map((v)=>(
                    <option value={v.id} key={v.id}>{v.customerName}</option>
                )) }
          </select>
            
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
        {
            open && (
                <>
                <form onSubmit={addOderItem} className=' flex gap-5 flex-col'>
            
            <h1>Add Product Detail</h1>
            <div className=' flex gap-4'>
            <label>Choose Product</label>
            <select name="" id="" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Select the option</option>
                {
                    pvalue.map((v)=>(
                    <option value={v.id} key={v.id}>{v.productName}</option>
                )) }
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
                                    <th>{idMap[v.productId]}</th>
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
                </>
            )
        }
    </div>
  )
}

export default Order