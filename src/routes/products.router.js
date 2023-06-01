import { Router } from "express";
import ProductManager from "../class/ProductManager.js";
import socketServer from "../App.js";

const router = Router();
const ProductsManager = new ProductManager();

router.get("/", async (req, res) => {
  const cars = await ProductsManager.getCars(req.query.limit);
  res.send(cars);
});

router.post("/", async (req, res) => {
  const car = await ProductsManager.addCar(req.body);
  socketServer.emit('addCar', car);
  res.send(car);
});


router.get("/:id", async (req, res) => {
  const car = await ProductsManager.getCarById(
    parseInt(req.params.id)
  );

  res.send(car);
});

router.put("/:id", async (req, res) => {
  const car = await ProductsManager.updateCarById(
    parseInt(req.params.id),
    req.body
  );
  socketServer.emit('updateCar', car);
  res.send(car);
});

router.delete("/:id", async (req, res) => {
  const car = await ProductsManager.deleteCar(parseInt(req.params.id));
  socketServer.emit('deleteCar', parseInt(req.params.id));
  res.send(car);
});

export default router;