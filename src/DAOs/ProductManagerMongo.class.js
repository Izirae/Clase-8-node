import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";
import config from "../config/config.js";
import CustomError from "../services/Error/CustomError.class.js";
import { emptyFieldGenerateCause } from "../services/Error/emptyField.CustomError.js";
import { invalidTypesGenerateCause } from "../services/Error/invalidTypes.CustomError.js";
import { ErrorEnum } from "../services/enum/error.enum.js";

export default class ProductManager {
    connection = mongoose.connect(config.mongoUrl);

    async addCar(car) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            CustomError.createError({
                name: "product creation error",
                cause: emptyFieldGenerateCause(["title", "description", "price", "category", "status", "code", "stock"]),
                code: ErrorEnum.EMPTY_FIELD_ERROR,
            });
        }
        if (!product) {
            CustomError.createError({
                name: "product creation error",
                cause: invalidTypesGenerateCause({ title: "string", description: "string" }),
                code: ErrorEnum.INVALID_TYPES_ERROR,
            });
        }
        if (!typeof product.title == String || !typeof product.description == String || !typeof product.price == Number || !typeof product.thumbnail == String || !typeof product.code == String || !typeof product.stock == Number) {
            CustomError.createError({
                name: "product creation error",
                cause: "Los campos para ser correctos deben ser: title=string, description=string, price=number, category=string, status=bolean, code=string, stock=number",
                message: "error trying to add a product",
                code: ErrorEnum.INVALID_TYPES_ERROR,
            });
        }

        try {
            let result = await productsModel.create(car);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getCars(
        limit = 10,
        page = 1,
        sort = 0,
        filtro = null,
        filtroVal = null
    ) {
        let whereOptions = {};

        if (filtro != null && filtroVal != null) {
            whereOptions = {
                [filtro]: new RegExp(filtroVal, "i"),
            };
        }

        let result = await productsModel.paginate({}, {
            limit: limit,
            page: page,
            sort: { price: sort },
            lean: true,
        });

        console.log(result, "aaaaaaaaa")

        return result;
    }

    async getCarById(id) {
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