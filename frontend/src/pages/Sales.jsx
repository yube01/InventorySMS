import { useEffect, useState } from "react"
import PocketBase from 'pocketbase';


const Sales = () => {


    const pb = new PocketBase('https://draw-wire.pockethost.io');


    const[oid,setOid] = useState("")
    const[value,setValue] = useState([])
    const[valueItem,setValueItem] = useState([])
    const[open,setOpen] = useState(false)
    const[ptype,setPtype] = useState("")
    const[received,setReceived] = useState("")
    const[total,setTotal] =useState(0)


    //available product detail

    const[pav,setPav] = useState(0)
    const[vav,setVav] = useState(0)
    const[bava,setBav] = useState(0)
    const[cav,setCav] = useState(0)

    const [ pvalue,setPvalue] = useState([])

    //order item state
    const[orderItem,setOrderItem] = useState([])

  
    

    const viewData = async()=>{
        pb.autoCancellation(false)
        const records = await pb.collection('order').getFullList({
            sort: '-created',
        });
        
        setValue(records)
    
       }

       const getProductData = async()=>{
        const momoMapping = {};
        try {
            const records = await pb.collection('product').getFullList({
                sort: '-created',
            });
            records.forEach(record => {
                const { id, productName } = record;
                momoMapping[id] = productName;
                setPvalue(momoMapping)
            });
        
          

            if(records){
            setPav(records[0].availablePieces)
            setVav(records[1].availablePieces)
            setBav(records[2].availablePieces)
            setCav(records[3].availablePieces)
            }

         

        } catch (error) {
            console.log(error)
        }
      }

       useEffect(()=>{
        viewData()
        getProductData()
       },[])



    const selectedOrder = async(id)=>{
        setOid(id)
       
       try {
        
        const resultList = await pb.collection('orderItem').getList(1, 50, {
            filter: `orderId='${id}'`,
        });
      
       
        const update = resultList.items.map(record => ({
            pId: record.productId,
            quan: record.quantity
        }));
        setOrderItem(update)
       
        const totalAmount = resultList.items.reduce((acc, item) => acc + item.amount, 0);

        setTotal(totalAmount)
        setValueItem(resultList.items)
       } catch (error) {
        console.log(error)
       }
    }



     



      const handleSales = async(e)=>{
        e.preventDefault()

        try {
            const data = {
                "paymentType": ptype,
                "deliveryStaffId": "23",
                "totalAmount": total,
                "discount": 10,
                "tax": 13,
                "payableAmount": 2500,
                "cashRecieved": received,
                "orderId": oid
            };
            
            const record = await pb.collection('sales').create(data);
            getProductData()
            adjustProduct(orderItem)
            console.log(record)
           
            
            
        } catch (error) {
            console.log(error)
        }
      }
      const adjustProduct = async (orderItems) => {
      
        try {
            
            for (const orderI of orderItems) {
                const { pId, quan } = orderI;
    
                let initialQuantity; 
                
                if (pId === "zf8j99zl4ft79lf") {
                    initialQuantity = pav;
                } else if (pId === "roivwboyvm2pfje") {
                    initialQuantity = vav;
                } else if (pId === "h3jn9e18t918jjw") {
                    initialQuantity = cav;
                } else if (pId === "305fxlc0m9o76p1") {
                    initialQuantity = bava;
                }
    
                if (initialQuantity !== undefined) {
                    let total = initialQuantity - quan;
    
                    const data = {
                        "availablePieces": total
                    };
    
                    const records = await pb.collection('product').update(pId, data);
                    console.log(`${pvalue[pId]} data adjusted`);
                    console.log(records);
                    viewData();
                } else {
                    console.log(`Invalid product ID: ${pId}`);
                }
            }
            const data = {
                "orderStatus": "Complete"
            };

            const records = await pb.collection('order').update(oid, data);
            if(records){
                console.log("Pending changed");
                viewData()
            }
            
        } catch (error) {
            console.log(error);
        }
    };
    

      

  return (
    <div>
        <h1>Sales Page</h1>
        <div className=" flex gap-3">
            
            
                <div>
                <h1>Order History</h1>
                <table border={1}>
                    <thead>
                    <tr className=' p-5'>
                      
                        <th>Order Created Date</th>
                        <th>Customer Id</th>
                        <th>Order Due Date</th>
                        <th>Order Status</th>
                        <th>Detail</th>
                    </tr>
                    </thead>
                    <tbody className=' p-5'>
                        {
                            value.map((v)=>(
                                <tr className=' p-5' key={v.id}>
                                    <th>{v.orderCreationDate}</th>
                                    <th>{v.customerId}</th>
                                    <th>{v.orderDueDate}</th>
                                    <th>{v.orderStatus}</th>
                                    <th><button onClick={()=>selectedOrder(v.id)}>View Detail</button></th>
                                </tr>
                            ))

                        }

                    </tbody>

                </table>
                </div>
                <div className=" border-l-4 border-black px-2">
                    <h1>Selected Detail</h1>
                    <div>
                <table border={1}>
                    <thead>
                    <tr className=' p-5'>
                      
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Sales</th>
                    </tr>
                    </thead>
                    <tbody className=' p-5'>
                        {
                            valueItem.map((m)=>(
                                <tr className=' p-5' key={m.id}>
                                    <th>{pvalue[m.productId]}</th>
                                    <th>{m.quantity}</th>
                                    <th>{m.price}</th>
                                    <th>{m.amount}</th>
                                    
                                </tr>
                            ))

                        }

                    </tbody>

                </table>
               <button onClick={()=>setOpen(!open)}>Add Sales Detail</button>
                    </div>
                </div>
                
            </div>
            {
                    open && (
                        <div className=" bg-cyan-300">
                        <h1>Sales Form</h1>
                        <form onSubmit={handleSales} className=' flex gap-5 flex-col'>
                        
                        <div className=' flex gap-4'>
                        <label>Payment Type</label>
                        <select name="" id="" value={ptype} onChange={(e) => setPtype(e.target.value)}>
                            <option value="">Select the option</option>
                            <option value="Cash">Cash</option>
                            <option value="Onlinepay">Online Payment</option>
                           
                        </select>
                        
                        </div>
                        <div className=' flex gap-4'>
                        <label>Payment Received</label>
                        <select name="" id="" value={received} onChange={(e) => setReceived(e.target.value)}>
                            <option value="">Select the option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                           
                        </select>
                       
                        </div>
                        
                        
                        <input type="submit" className=" cursor-pointer border-black border-2 " value="Add"  />
                    </form>
                        </div>
                    )
                }
                
        
    </div>
  )
}

export default Sales