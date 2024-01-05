import { useEffect, useState } from "react"
import PocketBase from 'pocketbase';
import { Link } from "react-router-dom";
import "./tableBorder.css"


const Sales = () => {


    const pb = new PocketBase('https://draw-wire.pockethost.io');

    //set state for data from api

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

    const[customer,setCustomer] = useState([])


    //sales update message
    const[msg,setMsg] = useState("")



  
    

    //stores order table data from api and set it into setValue
    const viewData = async()=>{
        pb.autoCancellation(false)
        const records = await pb.collection('order').getFullList({
            sort: '-created',
        });
        
        setValue(records)
    
       }

     // fetches taxableCustomer detail
    const customerDetail = async()=>{
        const customerNames = {}
    try {
        const records = await pb.collection('taxableCustomer').getFullList();
        records.forEach(record => {
            const { id, customerName } = record;
            customerNames[id] = customerName;
            setCustomer(customerNames)
        });
       
    } catch (error) {
        console.log(error)
    }
 }

       // fetch data from product table and data are sorted in descending order based on it's id 
       const getProductData = async()=>{
        const momoMapping = {};
        try {
            const records = await pb.collection('product').getFullList({
                sort: '-id',
            });

            // stores data of product table in momoMapping as a key value pair 
            records.forEach(record => {
                const { id, productName } = record;
                momoMapping[id] = productName;
                setPvalue(momoMapping)
            });
            if(records){
               
                // checks data set from above records with data orderItems which is set on function selectedOrder
                

                //id of both data are compared based on their id's and sorted for maintaining each of their occurance order
                const newPieceStates = records.map(record => {
                        const matchingUpdate = orderItems.find(updateRecord => updateRecord.pId === record.id);
                
                        if (matchingUpdate) {
                            return {
                                pId: matchingUpdate.pId,
                                availablePieces: record.availablePieces
                            };
                            
                        } 
                        // filter helps to remove undefined value which is obtained after checking their matchingUpdate 
                    }).filter(Boolean);
                    console.log(newPieceStates.sort((a, b) => a.pId.localeCompare(b.pId)))
                    setAvai(newPieceStates)
                    

            }
            

         

        } catch (error) {
            console.log(error)
        }
      }

      // when page is reloaded then it first calls viewData function
       useEffect(()=>{
        viewData()
        customerDetail()
       },[])



       // id is send from viewDetail onclick event 
        const selectedOrder = async(id)=>{

        setOid(id)
       
       try {
        
        // data fetched from orderItem table based on their their orderId and sorted in ascending order based on thier id
        const resultList = await pb.collection('orderItem').getList(1, 50, {
            filter: `orderId='${id}'`,sort: '-id',
        });
      
       
        // update stores each of those data in this format
        // {pId:23298,quan:23}
        const update = resultList.items.map(record => ({
            pId: record.productId,
            quan: record.quantity
        }));
        update.sort((a, b) => a.pId.localeCompare(b.pId));
        setOrderItem(update)
        console.log(update)
        // calls getProductdata function
        getProductData()
       
        // extract total amount from the variable resultList
        const totalAmount = resultList.items.reduce((acc, item) => acc + item.amount, 0);

        setTotal(totalAmount)
        setValueItem(resultList.items)
       
       } catch (error) {
        console.log(error)
       }
    }



     



    // runs when handleSales fucntion is called from form tag
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
            
            // stores data into sales table
            const record = await pb.collection('sales').create(data);
            getProductData()
            adjustProduct(orderItems)
        } catch (error) {
            console.log(error)
        }
      }

      // this function adjust the recent change in data 
      const adjustProduct = async (orderItems) => {
        try {
            
            for (let i = 0; i < orderItems.length; i++) {
                const orderI = orderItems[i];
                const { pId, quan } = orderI;
               
            
                let initialQuantity;
            
                console.log(pId,avai[i]?.pId)
              
                // compares pid from orderI with adjusted id from setAvai  
                if (pId === avai[i]?.pId) {
                    initialQuantity = avai[i]?.availablePieces;
                }
               
              
            
                // it updates the value on product table by subtracting prev - cuurent quantity
                if (initialQuantity !== undefined) {
                    let total = initialQuantity - quan;
            
                    const data = {
                        "availablePieces": total
                    };
            
                    const records = await pb.collection('product').update(pId, data);
                    setMsg((`${pvalue[pId]} data updated on inventory by ${quan}`))
                    console.log(`${pvalue[pId]} data adjusted`);
                    console.log(records);
                    viewData();
                }
                
                // it updates orderstatus to complete if above condition is true
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
         <Link to="/" className="bold text-lg border-2 border-black p-0.5 rounded-lg mt-1">
        Home
      </Link>
        <h1>Sales Page</h1>
        <div className=" flex gap-3">
            
            
                <div>
                <h1>Order History</h1>
                <table border={3} className=" border-black border-2">
                    <thead>
                    <tr className=' p-5 border-2 border-black'>
                      
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
                                <tr className=' p-5 border-2 border-black ' key={v.id}>
                                    <th >{v.orderCreationDate}</th>
                                    <th>{customer[v.customerId]}</th>
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
                {
                    msg && (
                        <span>{msg}</span>
                    )
                }
                
        
    </div>
  )
}

export default Sales