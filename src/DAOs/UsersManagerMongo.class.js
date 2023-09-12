import mongoose from "mongoose";
import { userModel } from "./models/users.model.js";
import config from "../config/config.js";
import ManagerCarts from "../DAOs/CartManagerMongo.class.js";

const managerCarts = new ManagerCarts();

export default class UsersManager {
    connection = mongoose.connect(config.mongoUrl);

    async getUser(email) {
        const user = await userModel.findOne({
            email: email,
        });
        return user;
    }

    async authUser(email, password) {
        const user = await userModel.findOne({
            email: email,
            password: password,
        });
        if (!user) return false;
        else return user;
    }

    async createUser(data) {
        const exist = await this.getUser(data.email);
        console.log("existe");
        if (exist) {
            return false;
        } else {
            const cartId = await managerCarts.addCart();
            data.rol = "usuario";
            data.cart = cartId._id.valueOf();
            console.log("lo crea");
            const res = await userModel.create(data);
            return true, res;
        }
    }

    async updatePasswordUser(user, password) {
        await userModel.updateOne(
            { _id: user._id },
            { $set: { password: password } }
        );
        return true;
    }

    async getUserById(id) {
        const user = await userModel.findById(id);
        return user;
    }
}
