import { Schema, model } from "mongoose";
import cartModel from "./carts.models.js";

const userSchema = new Schema ({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts"
    },
    rol: {
        type: String,
        default: "user"
    },
    owner: {
        type: String,
        default: "admin"
    },
    documents: {
        type: [{
            name: {
                type: String,
                required: true
            },
            reference: {
                type: String,
                required: true
            }
        }],
        default: function () {
            return []
        }
    },
    last_connection: {
        type: Date,
        default: null
    }
});
userSchema.pre ( "save", async function ( next ) {
    if ( this.rol !== "admin" && !this.cart ) {
        try {
            const newCart = await cartModel.create ({});
            this.cart = newCart._id;
        } catch (error) {
            next ( error )
        }
    }
    next ();
});
userSchema.methods.updateLastConnection = function () {
    this.last_connection = new Date();
    return this.save();
};

const userModel = model ( "users", userSchema );
export default userModel;