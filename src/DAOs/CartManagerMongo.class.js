import mongoose from "mongoose";
import { cartsModel } from "./models/carts.model.js";
import { prodManager } from "../App.js";
import config from "../config/config.js";
import CustomError from "../services/Error/CustomError.class.js";
import { ErrorEnum } from "../services/enum/error.enum.js";

export default class CartManager {
    connection = mongoose.connect(config.mongoUrl);

    async getCart() {
        let result = await cartsModel.find();
        // console.log(result);
        return result;
    }

    async addCart() {
        let cart = {
            product: [],
        };
        // console.log(cart);
        let result = await cartsModel.create(cart);
        // console.log(result);
        return result;
    }

    async getCartById(id) {
        if (!id) {
            CustomError.createError({
                name: "error al obtener el carrito",
                cause: "El carrito no se encuentra en nuestra base de datos",
                code: ErrorEnum.DATABASE_ERROR,
            });
        }

        let result = await cartsModel
            .findOne({ _id: id })
            .populate("products.product");
        return result;
    }

    async addToCart(idCart, idProduct, q) {
        if (!idCart || !idProduct || !q || idCart.includes(" ") || idProduct.includes(" ")) {
            CustomError.createError({
                name: "error al agregar al carrito",
                cause: "Debe ingresar una id del carrito y del producto a agregar",
                code: ErrorEnum.PARAM_ERROR,
            });
        }

        let product = await prodManager.getCarById(idProduct);
        let cart = await this.getCartById(idCart);
        cart.products.push({ product: product, quantity: q });

        await cart.save();

        return;
    }

    async deleteProductFromCart(idCart, idProduct) {
        if (!idCart || !idProduct || idCart.includes(" ") || idProduct.includes(" ")) {
            CustomError.createError({
                name: "error al agregar al carrito",
                cause: "Debe ingresar una id del carrito y del producto a agregar",
                code: ErrorEnum.PARAM_ERROR,
            });
        }

        const cart = await this.getCartById(idCart);
        cart.products.pull(idProduct);
        await cart.save();
        return;
    }

    async deleteAllProductsFromCart(idCart) {
        if (!idCart || idCart.includes(" ")) {
            CustomError.createError({
                name: "error al agregar al carrito",
                cause: "Debe ingresar una id del carrito y del producto a agregar",
                code: ErrorEnum.PARAM_ERROR,
            });
        }

        const cart = await this.getCartById(idCart);
        cart.products = [];
        await cart.save();
        return;
    }

    async updateCartQuantity(idCart, idProduct, q) {
        if (!idCart || !idProduct || !q || idCart.includes(" ") || idProduct.includes(" ")) {
            CustomError.createError({
                name: "error al agregar al carrito",
                cause: "Debe ingresar una id del carrito y del producto a agregar",
                code: ErrorEnum.PARAM_ERROR,
            });
        }

        let cart = await this.getCartById(idCart);
        let productos = cart.products;
        let este = productos.find(
            (prod) => prod.product.valueOf() === idProduct
        );
        este.quantity = q;

        await cart.save();
        return;
    }

    async updateCartProducts(idCart, data) {
        if (!idCart || !data || idCart.includes(" ")) {
            CustomError.createError({
                name: "error al agregar al carrito",
                cause: "Debe ingresar una id del carrito y del producto a agregar",
                code: ErrorEnum.PARAM_ERROR,
            });
        }

        await this.deleteAllProductsFromCart(idCart);
        let cart = await this.getCartById(idCart);
        data.data.forEach((e) => {
            cart.products.push(e);
        });

        await cart.save();

        return;
    }
}
