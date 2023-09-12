import mongoose from "mongoose";
import { purchaseModel } from "./models/purchase.model.js";
import ProductManager from "./ProductManagerMongo.class.js";
import ManagerCarts from "./CartManagerMongo.class.js";
import config from "../config/config.js";
import { v4 as uuidV4 } from "uuid";

export default class PurchaseManager {
    connection = mongoose.connect(config.mongoUrl);
    productManager = new ProductManager();
    managerCarts = new ManagerCarts();
    async stockControl(cid) {
        let total = 0;
        let cart = await this.managerCarts.getCartById(cid);
        if (cart.products.length > 0) {
            for (const e of cart.products) {
                if (e.product.stock > 0) {
                    total = total + e.product.price;
                    e.product.stock = e.product.stock - e.quantity;
                    await this.productManager.updateCarById(
                        e.product._id,
                        e.product
                    );
                    await this.managerCarts.deleteProductFromCart(
                        cid,
                        e._id.valueOf()
                    );
                } else {
                    let sinStock = [];
                    sinStock.push(e.product._id.valueOf());
                    console.log(
                        "TENGO EL STOCK EN 0 DE LOS SIGUIENTES ACTICULOS ",
                        sinStock
                    );
                }
            }

            return total;
        } else {
            let a = "El Carrito esta Vacio";
            return a;
        }
    }

    async addPurchase(id) {
        try {
            let resStock = await this.stockControl(id.cart);

            let purchase = new Object();
            let date = new Date();

            purchase.purchase_datetime = date;
            purchase.code = uuidV4();
            purchase.amount = resStock;
            purchase.purchaser = id.email;

            if (purchase.amount > 0) {
                let result = await purchaseModel.create(purchase);
                console.log(result);
                return result;
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
