import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

export default class ProductManager {
    connection = mongoose.connect(
        "mongodb+srv://lautarobazzola:0zv80h92MWEGQi3Q@cluster0.yoldw0l.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );

    async addCar(car) {
        let result = await productsModel.create(car);
        return result;
    }

    async getCars() {
        let result = await productsModel.find();
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
