import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";
import config from "../config/config.js";

export default class ProductManager {
    connection = mongoose.connect(config.mongoUrl);

    async addCar(car) {
        try {
            let result = await productsModel.create(car);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getCars(limit = 10,
        page = 1,
        sort = 0,
        filtro = null,
        filtroVal = null) {
        let whereOptions = {};

        if (filtro != null && filtroVal != null) {
            whereOptions = {
                [filtro]: new RegExp(filtroVal, "i"),
            };
        }

        let result = await productsModel.paginate(whereOptions, {
            limit: limit,
            page: page,
            sort: { price: sort },
            lean: true,
        });

        return result;
    }

    async getCarById(id) {
        console.log("esto llega", id);
        let result = await productsModel.findOne({ _id: id });
        return result;
    }

    async updateCarById(id, updatedProduct) {
        let result = await productsModel.updateOne(
            { _id: id },
            { $set: updatedProduct }
        );
        return result;
    }

    async deleteCar(id) {
        let result = await productsModel.deleteOne({ _id: id });
        return result;
    }
    async getCarsInStock() {
        const products = await productsModel.find();
        const inStock = [];

        inStock.push(...products.filter((product) => product.stock > 0));
        return inStock;
    }
}
