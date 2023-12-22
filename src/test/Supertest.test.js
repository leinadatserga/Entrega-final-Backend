import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import config from "../config/config.js";
import logger from "../utils/logger.js";

const expect = chai.expect;
const requester = supertest ( "http://localhost:8080" );
const user = JSON.parse ( config.realUser );
const testUser = JSON.parse ( config.fakeUser );
const product = JSON.parse ( config.fakeProduct );
let token;
await mongoose.connect ( config.mongoURL )
.then (() => {
    logger.http ( `DB connected` );
});
describe ( "Integration test for e-commerce", () => {
    let prodId;
    describe ( "Sessions test", () => {
        it ( "Endpoint test /api/session/login, expect to initiate a session", async function () {
            this.timeout(6000);
            const client = {
                email: user.email,
                password: user.password
            }
            const session = await requester.post ( "/api/session/login" ).send ( client );
            token = session.header [ "set-cookie" ] [ 0 ];
            expect ( token ).to.be.ok;
            expect ( session.status ).to.equal ( 200 );
            expect ( session.body ).to.have.property ( "email" ).to.be.a ( "string" );
            expect ( session.body ).to.have.property ( "_id" ).to.be.a ( "string" );
        });
        it ( "Endpoint test /api/session/current, expect to obtain the current session data", async function () {
            const sessionData = await requester.get ( "/api/session/current" ).set ( "Cookie", token );
            expect ( sessionData.status ).to.equal ( 200 );
            expect ( sessionData.body.user ).to.have.property ( "_id" ).to.be.a ( "string" );
            expect ( sessionData.body ).to.have.property ( "iat" ).to.be.a ( "number" );
        });
        it ( "Endpoint test /api/session/logout, expect to logout of the active session", async function () {
            const terminate = await requester.get ( "/api/session/logout" );
            expect ( terminate.status ).to.equal ( 200 );
            expect ( terminate.body ).to.have.property ( "result" ).to.be.a ( "string" );
        });
    }); 
    describe ( "Products test", () => {
        let prevProp;
        it ( "Endpoint test /api/products, expect to create a product", async function () {
            const newProduct = await requester.post ( "/api/products" ).send ( product ).set ( "Cookie", token );
            expect ( newProduct.status ).to.equal ( 201 );
            expect ( newProduct.body ).to.have.property ( "status" ).to.be.a ( "boolean" );
            expect ( newProduct.body ).to.have.property ( "thumbnails" ).to.be.a ("array");
            prodId = newProduct.body._id;
            prevProp = newProduct.body.title;
        });
        it ( "Endpoint test /api/products/:id, expect to update a product by the Id", async function () {
            const newValues = {
                title: "Bala Inactivo",
                category: "balota"
            }
            const updatedProduct = await requester.put ( `/api/products/${ prodId }` ).send ( newValues ).set ( "Cookie", token );
            expect ( updatedProduct.status ).to.equal ( 200 );
            expect ( updatedProduct.title ).to.not.deep.equal ( prevProp );
            expect ( updatedProduct.body ).to.have.property ( "_id" ).to.be.a ("string");
        });
        it ( "Endpoint test /api/products:id, expect to eliminate the product by the Id", async function () {
            const cleanProduct = await requester.delete ( `/api/products/${ prodId }` ).set ( "Cookie", token );
            expect ( cleanProduct.status ).to.equal ( 200 );
            expect ( cleanProduct.body ).to.have.property ( "thumbnails" ).to.be.a ( "array" );
            expect ( cleanProduct.body ).to.have.property ( "_id" ).to.be.a ("string");
        });
    });
    describe ( "Carts test", () => {
        let cartId = user.cart;
        let prevCart;
        it ( "Endpoint test /api/carts/:cid, expect to get a cart by the Id", async function () {
            const cart = await requester.get ( `/api/carts/${ cartId }` ).set ( "Cookie", token );
            expect ( cart.status ).to.equal ( 200 );
            expect ( cart.body ).to.have.property ( "products" ).to.be.a ( "array" );
            expect ( cart.body ).to.have.property ( "_id" ).to.be.a ("string");
        });
        it ( "Endpoint test /api/carts/:cid/products/:pid, expect to add products to a cart by respective Ids", async function () {
            const addProd = await requester.post ( `/api/carts/${ cartId }/products/651c613036dd8e4e2f64e836` ).send ({ "quantity": 2 }).set ( "Cookie", token );
            prevCart = addProd;
            expect ( addProd.status ).to.equal ( 200 );
            expect ( addProd.body ).to.have.property ( "products" ).to.be.a ( "array" );
            expect ( addProd.body.products [ 0 ] ).to.have.property ( "quantity" ).to.be.a ( "number" );
        });
        it ( "Endpoint test /api/carts/:cid/products/:pid, expect to update products of a cart by respective Ids", async function () {
            const updateProd = await requester.put ( `/api/carts/${ cartId }/products/651c613036dd8e4e2f64e836` ).send ({ "quantity": 10 }).set ( "Cookie", token );
            expect ( updateProd.status ).to.equal ( 200 );
            expect ( updateProd.body ).to.not.deep.equal ( prevCart.body );
        });
        it ( "Endpoint test /api/carts/:cid, expect to empty a cart by Id", async function () {
            const emptyCart = await requester.delete ( `/api/carts/${ cartId }` ).set ( "Cookie", token );
            expect ( emptyCart.status ).to.equal ( 200 );
            expect ( emptyCart.body ).to.have.property ( "products" ).to.be.a ( "array" ).that.is.empty;
        });
    });
    describe ( "User test", () => {
        let userId;
        let userRol;
        it ( "Endpoint test /api/users, expect to create a new user", async function () {
            this.timeout(6000);
            const newUser = await requester.post ( "/api/users" ).send ( testUser );
            userId = newUser.body.user._id;
            userRol = newUser.body.user.rol;
            expect ( newUser.status ).to.equal ( 201 );
            expect ( newUser.body ).to.have.property ( "message" ).to.be.a ( "string" ).to.be.deep.equal ( "User created" );
            expect ( newUser.body.user ).to.have.property ( "rol" ).to.be.a ( "string" );
        });
        it ( "Endpoint test /api/users/premium/:uid, expect to change the current User rol between user and premium by the Id", async function () {
            const changeRol = await requester.post ( `/api/users/premium/${ userId }` ).set ( "Cookie", token );
            expect ( changeRol.status ).to.equal ( 200 );
            expect ( changeRol.body.user ).to.have.property ( "rol" ).to.not.deep.equal ( userRol );
            expect ( changeRol.body ).to.have.property ( "message" ).to.be.a ( "string" ).to.be.deep.equal ( "Rol updated" );
        });
        it ( "Endpoint test /api/users/:uid, expect to delete a user by the Id", async function () {
            const deletedUser = await requester.delete ( `/api/users/${ userId }` ).set ( "Cookie", token );
            expect ( deletedUser.status ).to.equal ( 200 );
            expect ( deletedUser.body ).to.have.property ( "message" ).to.be.a ( "string" ).to.be.deep.equal ( "User deleted" );
        });
    });
});
