import PocketBase from 'pocketbase';

const pb = new PocketBase('https://draw-wire.pockethost.io');

export const getProduction = async()=>{
    try {
        pb.autoCancellation(false)
        const records = await pb.collection('production').getFullList({
            sort: '-created',
        });
        return {records}
        

    } catch (error) {
        console.log(error)
        return {error}
    }
}