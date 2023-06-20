import mongoose from "mongoose";
import { cartsModel } from "./models/carts.model.js";
export default class CartManager {
    connection = mongoose.connect(
        "mongodb+srv://lautarobazzola:0zv80h92MWEGQi3Q@cluster0.yoldw0l.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    async getCart() {
        let result = await cartsModel.find();
        console.log(result);
        return result;
    }

    async addCart() {
        let cart = {
            product: [],
        };
        console.log(cart);
        let result = await cartsModel.create(cart);
        console.log(result);
        return result;
    }

    async getCartById(id) {
        console.log(id);
        let result = await cartsModel.findOne({ _id: id });
        return result;
    }

    async addToCart(idCart, idProduct, q) {
        let cart = await this.getCartById(idCart);
        cart.products.push({ id: idProduct, quantity: q });

        let result = await cartsModel.updateOne(
            { _id: idCart },
            { $set: cart }
        );

        console.log(result);
        return result;
    }
}
