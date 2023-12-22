import mongoose from "mongoose";
import cartModel from "../../models/carts.models.js";
import Assert from "assert";
import config from "../../config/config.js";
import logger from "../../utils/logger.js";

const assert = Assert.strict;

describe ( "Carts Testing", () => {
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
        assert.strictEqual ( typeof cart , "object", "Cart may be a valid object format" );
        result = cart;
    });
    it ( "Update the cart gotten by Id", async function () {
        const product = { id_prod: "657095894b99c9597d9975f7", quantity: 5 };
        await cartModel.findByIdAndUpdate ( user.cart, { products: [ product ]});
        const updatedCart = await cartModel.findById ( user.cart );
        assert.ok ( updatedCart.products != result.products, "Previous cart must be different from the current one" );
        result = updatedCart;
    });
    it ( "Empty the updated cart by Id", async function () {
        const cartClean = await cartModel.findById ( user.cart );
        cartClean.products.splice ( 0 );
        await cartClean.save ();
        const deletedCart = await cartModel.findById ( user.cart );
        assert.strictEqual(deletedCart.products.length, 0, "Products array is expected to be empty after deletion" );
        result = deletedCart;
    });
});