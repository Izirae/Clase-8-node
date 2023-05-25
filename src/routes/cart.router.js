import { Router } from "express";
import ManagerCarts from "../class/CartManager.js";
const router = Router();
const managerCarts = new ManagerCarts();

router.get("/", async (req, res) => {
  const carts = await managerCarts.getCart();
  res.send(carts);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const cart = await managerCarts.getCartById(id);
  res.send(cart);
});

router.post("/", async (req, res) => {
  await managerCarts.addCart();
  res.send({ status: "success" });
});

router.post("/:cid/add/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  await managerCarts.addToCart(cartId, productId);
  res.send({ status: "success" });
});

export default router;