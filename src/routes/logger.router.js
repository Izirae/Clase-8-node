import { Router } from "express";
import fs from "fs";

const router = Router();


router.get('/loggerTest', (req, res) => {
    fs.readFile('./errors.log', 'utf-8', (err, logs) => {
    if (err) req.logger.error("No se pudo acceder al logger")
    res.send(logs)
    })
})

export default router;