import { Router } from "express";
import ManagerCarts from "../DAOs/CartManagerMongo.class.js";
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

router.post("/:cid/products/:pid/quantity/:q", async (req, res) => {
  console.log(req.params.cid, req.params.pid, req.params.q);
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.params.q;

  await managerCarts.addToCart(cartId, productId, quantity);
  res.send({ status: "success" });
});

export default router;
