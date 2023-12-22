import { Schema, model } from "mongoose";

const ticketSchema = new Schema ({
    code: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    purchase_datetime: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});
const ticketModel = model ( "tickets", ticketSchema );
export default ticketModel;