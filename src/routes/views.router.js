import { Router } from "express";
import { prodManager } from "../App.js";
const router = Router();

router.get('/', async (req, res) => {
    await prodManager.getCarsInStock()
        .then((raw) => {
            let products = JSON.parse(JSON.stringify(raw))
            res.render('home', { title: "Productos", products })
        });
});

router.get('/realtimeproducts', async (req, res) => {
    await prodManager.getCars()
        .then(() => {
            res.render('realTimeProducts', { title: "Productos en tiempo real" })

        });
});

router.get("/chat", (req, res) => {
    res.render("chat", { title: "Chat" });
});

export default router;