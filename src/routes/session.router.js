import { Router } from "express";
import UsersManager from "../DAOs/UsersManagerMongo.class.js";
import passport from "passport";
import { createHash } from "../utils.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import CurrentUserDTO from "../DTO/user.dto.js";

const UsersManagers = new UsersManager();
const router = Router();

router.post("/register", async (req, res) => {
    const data = req.body;
    const newHashedPassword = createHash(data.password);

    data.password = newHashedPassword;

    let response = await UsersManagers.createUser(data);
    if (response === false) {
        return res
            .status(400)
            .send({ status: "error", message: "El usuario ya existe" });
    } else {
        res.send({ status: "success", message: "usuario  registrado" });
    }
});

router.post(
    "/login",
    passport.authenticate("login", {
        session: false,
        failureRedirect: "/faillogin",
    }),
    async (req, res) => {
        if (!req.user)
            return res
                .status(400)
                .send({ status: "error", message: "Invalid credentials" });
        req.session.user = {
            name: req.user.first_name + " " + req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            rol: req.user.rol,
            cart: req.user.cart,
        };
        let token = jwt.sign(
            { email: req.user.email, first_name: req.user.first_name },
            config.jwtKey,
            {
                expiresIn: "24h",
            }
        );
        return res.cookie("coderCookie", token, { httpOnly: true }).send({
            status: "success",
            payload: req.user,
        });
    }
);

router.get("/faillogin", (req, res) => {
    res.send({ error: "Failed to login" });
});

router.post("/restartPassword", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res
            .status(400)
            .send({ status: "error", message: "Complete los campos" });
    const user = await UsersManagers.getUser(email);

    if (!user)
        return res
            .status(400)
            .send({ status: "error", message: "Usuario no encontrado" });
    const newHashedPassword = createHash(password);
    const pass = await UsersManagers.updatePasswordUser(
        user,
        newHashedPassword
    );
    console.log("esto es pass", pass);
    if (pass === true) {
        return res.status(200).send({
            status: "success",
            message: "Contraseña restaurada",
        });
    } else {
        return res.status(400).send({
            status: "error",
            message:
                "Problemas al cambiar la contraseña, intente nuevamente",
        });
    }
});

router.get(
    "/github",
    passport.authenticate("github", { scope: "user:email", session: false }),
    (req, res) => { }
);

router.get(
    "/githubcallback",
    passport.authenticate("github", { session: false, failureRedirect: "/" }),
    async (req, res) => {
        try {
            console.log("hola, llegue")
            req.session.user = req.user;
            const token = jwt.sign(
                { email: req.user.email, first_name: req.user.first_name },
                config.jwtKey,
                { expiresIn: "24h" }
            );
            res.cookie("coderCookie", token, { httpOnly: true }).redirect(
                "/home"
            );
        } catch (error) {
            return next(error);
        }
    }
);

router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.send(req.user);
    }
);

export default router;