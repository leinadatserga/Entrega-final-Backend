export const generateUserErrorInfo = ( user ) => {
    return `One or more properties of the User were incomplete or not valid.
    List of required properties:
    * first_name : needs to be a String, received ${ user.first_name }
    * last_name : needs to be a String, received ${ user.last_name }
    * email : needs to be a String, received ${ user.email }
    * age : needs to be a Number (int) > 17, received ${ user.age }`
};
export const generateProductErrorInfo = ( product ) => {
    return `One or more properties of the Product were incomplete or not valid.
    List of required properties:
    * title : needs to be a String and the field cannot be empty, received ${ product.title }
    * price : needs to be a Number and the field cannot be empty, received ${ product.price }
    * stock : needs to be a Number and the field cannot be empty, received ${ product.stock }
    * category : needs to be a String and the field cannot be empty, received ${ product.category }`
};