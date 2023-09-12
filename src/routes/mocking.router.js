import { Router } from "express";
import { generateProductsMock } from "../mocks/products.mock.js";

const router = Router();

router.get("/", async (req, res) => {
    const product = await generateProductsMock(100);
    console.log(product);
    res.send(product);
});

export default router;
