import mongoose from "mongoose";

const collection = "purchase";

const PurchaseSchema = new mongoose.Schema(
    {
        purchase_datetime: {
            type: Date,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        purchaser: {
            type: String,
            require: true,
        },
    },
    { versionKey: false }
);

export const purchaseModel = mongoose.model(collection, PurchaseSchema);
