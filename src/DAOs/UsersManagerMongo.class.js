import mongoose from "mongoose";
import { userModel } from "./models/users.model.js";
import config from "../config/config.js";

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
        console.log(user);
        if (!user) return false;
        else return user;
    }
    async createUser(data) {
        const exist = await this.getUser(data.email);
        console.log("existe");
        if (exist) {
            return false;
        } else {
            data.rol = "usuario";
            console.log("lo crea");
            const res = await userModel.create(data);
            return true, res;
        }
    }
}
