import PocketBase from 'pocketbase';

const pb = new PocketBase('https://draw-wire.pockethost.io');

export const createProduction = async(date,type,quantity,staffId)=>{
    try {
        pb.autoCancellation(false)
        const data = {
            "productionDate": date,
            "productId": type,
            "quantity": quantity,
            "productionStaffId": staffId
           
        };
        const record = await pb.collection('production').create(data);
        return {record}

        
       
    } catch (error) {
        console.log(error)
        return {error}
    }
}