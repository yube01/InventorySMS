import PocketBase from 'pocketbase';

const pb = new PocketBase('https://draw-wire.pockethost.io');

export const getProduct = async()=>{
    try {
        const momoMapping = {};
        pb.autoCancellation(false)
        const records = await pb.collection('product').getFullList({
            sort: '-created'})
        
            records.forEach(record => {
                const { id, productName } = record;
                momoMapping[id] = productName;
                
            });
            return {records,momoMapping}
            
        
       } catch (error) {
        console.log(error)
        return {error}
        
       }
}