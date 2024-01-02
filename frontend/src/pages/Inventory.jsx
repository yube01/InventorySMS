import React, { useEffect, useState } from 'react'
import PocketBase from 'pocketbase';

import NepaliDatepicker from 'nepali-datepicker-and-dateinput';



const Inventory = () => {

    const pb = new PocketBase('https://draw-wire.pockethost.io');


    const [type,setType] = useState('');
   
    const [quantity,setQuantity] = useState('')
    const [value,setValue] = useState([])

    const [date,setDate] = useState('')
    const [prev,setPrev] = useState(0)
    

    const[prod,setProd] =useState([])
    const[pvalue,setPvalue] = useState([])
    const viewData = async()=>{
        const momoMapping = {};
       try {
        pb.autoCancellation(false)
        const records = await pb.collection('product').getFullList({
            sort: '-created'})
        
            records.forEach(record => {
                const { id, productName } = record;
                momoMapping[id] = productName;
                setPvalue(momoMapping)
            });
        
                 
            setValue(records)
        
       } catch (error) {
        console.log(error)
        
       }
        
    }


    const viewProduction = async()=>{
        try {
            const records = await pb.collection('production').getFullList({
                sort: '-created',
            });
            setProd(records)

        } catch (error) {
            console.log(error)
        }
    }

   

    useEffect(()=>{
        
       
        viewData()
        viewProduction()

    },[])

    const getData = async(type)=>{
        
        
        try {
            const record = await pb.collection('product').getOne(type, {
                expand: 'relField1,relField2.subRelField'})
            
               
                if(record){
                    setPrev(record.availablePieces)
                    
                }

            
           
        } catch (error) {
            console.log(error)
        }
        

        
    }

   
    

    const handleDateChange = (name, dateInMilli, bsDate, adDate) => {
       
        
        setDate(bsDate); 
        
 }
   
    

  


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
           
            
           
            
     
            if(record){
              
                let total = Number(quantity) + Number(prev)
                
                const data = {
                    
                    "availablePieces": total
                };
                const records = await pb.collection('product').update(type, data);
                console.log(records)
                viewData()
                viewProduction()
            }
        
           
            
        } catch (error) {
            console.log(error)
            
        }
    }




  return (
    <div className='flex gap-10 flex-col relative bg-cyan-300'>
       <div className=' flex gap-x-10'>
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
            <select name="" id="" value={type} onChange={(e) => {setType(e.target.value);getData(e.target.value)}}>
                <option value="">Select the option</option>
                {
                    value.map((v)=>(
                    <option value={v.id} key={v.id}>{v.productName}</option>
                )) }
               
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
                      
                        <th>Product Name</th>
                        <th>Available Pieces</th>
                        <th className=' p-5'>Date</th>
                        

                    </tr>
                    </thead>
                    <tbody className=' p-5'>
                        {
                            value.map((v)=>(
                                <tr className=' p-5' key={v.id}>
                               
                                                             <th>{v.productName}</th>
                                                             <th>{v.availablePieces}</th>
                                                             
                                                             <th>{v.created}</th>
                                                            
                                </tr>
                            ))

                        }

                    </tbody>

                </table>
            </div>
       </div>
       </div>

       <div>
            <h1>Production Log</h1>
            <div>
                <table border={1}>
                    <thead>
                    <tr className=' p-5'>
                      
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th className=' p-5'>Production Date</th>
                        

                    </tr>
                    </thead>
                    <tbody className=' p-5'>
                        {
                            prod.map((m)=>(
                                <tr className=' p-5' key={m.id}>
                               
                                                             <th>{pvalue[m.productId]}</th>
                                                             <th>{m.quantity}</th>
                                                             
                                                             <th>{m.productionDate}</th>
                                                            
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

export default Inventory