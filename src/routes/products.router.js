import { Router } from "express";
import ProductManager from "../class/ProductManager.js";

const router = Router();
const ProductsManager = new ProductManager();

router.get("/", async (req, res) => {
  const product = await ProductsManager.getCars(req.query.limit);
  res.send(product);
});

router.get("/:id", async (req, res) => {
  const product = await ProductsManager.getCarById(
    parseInt(req.params.id)
  );

  res.send(product);
});

router.post("/", async (req, res) => {
  const product = await ProductsManager.addCar(req.body);

  res.send(product);
});
router.put("/:id", async (req, res) => {
  const product = await ProductsManager.updateCarById(
    parseInt(req.params.id),
    req.body
  );

  res.send(product);
});

export default router;