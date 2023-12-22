import chai from "chai";
import mongoose from "mongoose";
import cartModel from "../../models/carts.models.js";
import config from "../../config/config.js";
import logger from "../../utils/logger.js";

const expect = chai.expect;

describe ( "Carts Testing with Chai", () => {
    let result;
    const user = JSON.parse(config.realUser);
    before ( async () => {
        await mongoose.connect ( config.mongoURL );
        logger.http ( `DB connected` );
    });
    after ( async () => {
        await mongoose.disconnect ();
        logger.http ( `DB disconnected` );
    });
    beforeEach ( function () {
        this.timeout ( 4000 );
    });
    afterEach ( async () => {
        logger.http ( `${ result }` );
    });
    it ( "Get a cart by Id", async function () {
        const cart = await cartModel.findById ( user.cart );
        expect ( cart.products ).to.be.an ( "array" );
        result = cart;
    });
    it ( "Update the cart gotten by Id", async function () {
        const product = { id_prod: "657095894b99c9597d9975f7", quantity: 5 };
        await cartModel.findByIdAndUpdate ( user.cart, { products: [ product ]});
        const updatedCart = await cartModel.findById ( user.cart );
        expect ( updatedCart.products ).to.not.deep.equal ( result.products );
        result = updatedCart;
    });
    it ( "Empty the updated cart by Id", async function () {
        const cart = await cartModel.findById ( user.cart );
        cart.products.splice ( 0 );
        await cart.save ();
        const deletedCart = await cartModel.findById ( user.cart );
        expect ( deletedCart.products ).to.have.lengthOf ( 0 );
        result = deletedCart;
    });
});
