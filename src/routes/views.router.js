import { Router } from "express";
import { prodManager } from "../App.js";
const router = Router();

router.get('/', async (req, res) => {
    await prodManager.getCars()
        .then((products) => {
            res.render('home', { title: "Productos", products })
        });
});

router.get('/realtimeproducts', async (req, res) => {
    await prodManager.getCars()
        .then(() => {
            res.render('realTimeProducts', { title: "Productos" })

        });
});

export default router;