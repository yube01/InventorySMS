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


    const [ pvalue,setPvalue] = useState([])

    //order item state
    const[orderItems,setOrderItem] = useState([])

    const[avai,setAvai] = useState([])



  
    

    const viewData = async()=>{
        pb.autoCancellation(false)
        const records = await pb.collection('order').getFullList({
            sort: '-id',
        });
        
        setValue(records)
    
       }

       const getProductData = async()=>{
        const momoMapping = {};
        try {
            const records = await pb.collection('product').getFullList({
                sort: '-id',
            });
            records.forEach(record => {
                const { id, productName } = record;
                momoMapping[id] = productName;
                setPvalue(momoMapping)
            });
            if(records){
               
                const newPieceStates = records.map(record => {
                        const matchingUpdate = orderItems.find(updateRecord => updateRecord.pId === record.id);
                
                        if (matchingUpdate) {
                            return {
                                pId: matchingUpdate.pId,
                                availablePieces: record.availablePieces
                            };
                            
                        } 
                    }).filter(Boolean);
                    console.log(newPieceStates.sort())
                    setAvai(newPieceStates)
                    

            }
            

         

        } catch (error) {
            console.log(error)
        }
      }

       useEffect(()=>{
        viewData()
       },[])



    const selectedOrder = async(id)=>{
        setOid(id)
       
       try {
        
        const resultList = await pb.collection('orderItem').getList(1, 50, {
            filter: `orderId='${id}'`,sort: '+id',
        });
      
       
        const update = resultList.items.map(record => ({
            pId: record.productId,
            quan: record.quantity
        }));
        setOrderItem(update)
        console.log(update)
        getProductData()
       
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
            adjustProduct(orderItems)
        } catch (error) {
            console.log(error)
        }
      }
      const adjustProduct = async (orderItems) => {
     
      
     
        try {
            
            for (let i = 0; i < orderItems.length; i++) {
                const orderI = orderItems[i];
                const { pId, quan } = orderI;
               
            
                let initialQuantity;
            
                console.log(pId,avai[i]?.pId)
              

                if (pId === avai[i]?.pId) {
                    initialQuantity = avai[i]?.availablePieces;
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
                }
                // else {
                //     console.log(`Invalid product ID: ${pId}`);
                // }

                const data = {
                    "orderStatus": "Complete"
                };
    
                const records = await pb.collection('order').update(oid, data);
                if(records){
                    console.log("Pending changed");
                    viewData()
                }
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
               <button onClick={()=>{setOpen(!open),getProductData()}}>Add Sales Detail</button>
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