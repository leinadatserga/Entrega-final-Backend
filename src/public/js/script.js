import prodModel from "../../models/products.models.js";

let data;
const productsDB = async () => {
    try {
        const datos = await prodModel.find ().lean ();
        return datos;
    } catch (error) {
        throw error;
    }
    
}
export default productsDB;