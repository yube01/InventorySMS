import PocketBase from 'pocketbase';

const pb = new PocketBase('https://draw-wire.pockethost.io');


export const updateProduct = async(quantity,prev,type)=>{
    try {
        pb.autoCancellation(false)
        let total = Number(quantity) + Number(prev)
        
        const data = {
            "availablePieces": total
        };
        await pb.collection('product').update(type, data);
                
        
    } catch (error) {
        console.log(error)
    }
}