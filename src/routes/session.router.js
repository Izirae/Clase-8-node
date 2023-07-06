import { Router } from "express";
import UsersManager from "../DAOs/UsersManagerMongo.class.js";
const UsersManagers = new UsersManager();
const router = Router();

router.post("/register", async (req, res) => {
    const data = req.body;
    let response = await UsersManagers.createUser(data);
    if (response === false) {
        return res
            .status(400)
            .send({ status: "error", message: "El usuario ya existe" });
    } else {
        res.send({ status: "success", message: "usuario  registrado" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UsersManagers.authUser(email, password);
    if (user === false)
        return res.status(400).send("Usuario y Contraseña incorrecto");
    req.session.user = {
        name: user.first_name + " " + user.last_name,
        email: user.email,
        age: user.age,
        rol: user.rol,
    };
    res.send({ status: "success", message: req.session.user });
});

export default router;
