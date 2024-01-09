import PocketBase from 'pocketbase';

const pb = new PocketBase('https://draw-wire.pockethost.io');


export const getOneProduct = async(type)=>{
    try {
        pb.autoCancellation(false)
        const record = await pb.collection('product').getOne(type, {
            expand: 'relField1,relField2.subRelField'})
        if(record){
                let availablePieces = record.availablePieces
                return{availablePieces}
        }

        
       
    } catch (error) {
        console.log(error)
        return {error}
    }
    
}