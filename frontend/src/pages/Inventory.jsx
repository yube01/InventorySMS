import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import NepaliDatepicker from 'nepali-datepicker-and-dateinput';


import { getProduct } from '../middleware/Product/getProduct';
import { getProduction } from '../middleware/Production/getProduction';
import { getOneProduct } from '../middleware/Product/getOneProduct';
import { createProduction } from '../middleware/Production/createProduction';
import { updateProduct } from '../middleware/Product/updateProduct';



const Inventory = () => {




    const [type,setType] = useState('');
   
    const [quantity,setQuantity] = useState('')
    const [value,setValue] = useState([])

    const [date,setDate] = useState('')
    const [prev,setPrev] = useState(0)
    

    const[prod,setProd] =useState([])
    const[pvalue,setPvalue] = useState([])

    // fetches data from product
    const viewData = async()=>{

        const{records,momoMapping,error} = await getProduct()

        if(!error){
            setValue(records)
            setPvalue(momoMapping)
         }else{
            console.log(error)
        }
        
    }


    // gets data from production table
    const viewProduction = async()=>{

        const {records,error} = await getProduction()
        if(!error){
            setProd(records)
         }else{
            console.log(error)
        }
    }

   

    useEffect(()=>{
        viewData()
        viewProduction()
    },[])

    // gets data from product table
    const getData = async(type)=>{
        
        const {availablePieces,error} = await getOneProduct(type)
        if(!error){
            setPrev(availablePieces)
         }else{
            console.log(error)
        }
     }

   
    

    const handleDateChange = (name, dateInMilli, bsDate, adDate) => {
       setDate(bsDate); 
    }
   
    
    // called when handleAdd is called from form tag
    const handleAdd = async(e)=>{
      
    e.preventDefault();
        try {
            const{record,error} = await createProduction(date,type,quantity,23)
            
            if(record){

                await updateProduct(quantity,prev,type)
                viewData()
                viewProduction()
            }else{
                console.log(error)
            }

        } catch (error) {
            console.log(error)
            
            
        }
    }




  return (
    <div className='flex gap-10 flex-col relative bg-cyan-300'>
      <Link to="/" className="bold text-lg border-2 border-black p-0.5 rounded-lg mt-1">
        Home
      </Link>
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