import { Router } from "express";
import ManagerCarts from "../DAOs/CartManagerMongo.class.js";
import ManagerPurchase from "../DAOs/PurchaseManagerMongo.class.js";
import passport from "passport";
import { verificarPertenenciaCarrito } from "../middleware/cart.middleware.js";

const router = Router();
const managerCarts = new ManagerCarts();
const managerPurchase = new ManagerPurchase();

router.get("/", async (req, res) => {
  const carts = await managerCarts.getCart();
  res.send(carts);
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cart = await managerCarts.getCartById(id);
    req.logger.debug(cart)
    res.send(cart);
  } catch (error) {
    return next(error)
  }

});

router.post("/", async (req, res) => {
  await managerCarts.addCart();
  res.send({ status: "success" });
});

router.put("/:cid", async (req, res) => {
  try {

    let cartId = req.params.cid;
    let data = req.body;
    await managerCarts.updateCartProducts(cartId, data);
    res.send({ status: "success" });

  } catch (error) {

    req.logger.error(error)
    return next(error)

  }
});

router.delete("/:cid", async (req, res) => {
  try {

    let cartId = req.params.cid;
    await managerCarts.deleteAllProductsFromCart(cartId);
    res.send({ status: "success" });

  } catch (error) {

    req.logger.error(error)
    return next(error)

  }
});

router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  verificarPertenenciaCarrito,
  async (req, res) => {
    await managerPurchase.addPurchase(req.session.user);
    res.send({ status: "success" });
  }
);

router.post(
  "/:cid/products/:pid/quantity/:q",
  passport.authenticate("jwt", { session: false }),
  verificarPertenenciaCarrito,
  async (req, res, next) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const quantity = req.params.q;

      await managerCarts.addToCart(cartId, productId, quantity);
      res.send({ status: "success" });

    } catch (error) {
      return next(error)
    }
  }
);

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    await managerCarts.deleteProductFromCart(cartId, productId);
    res.send({ status: "success" });

  } catch (error) {

    req.logger.error(error)
    return next(error)
  }
});

router.put(
  "/:cid/products/:pid/quantity/:q",
  passport.authenticate("jwt", { session: false }),
  verificarPertenenciaCarrito,
  async (req, res, next) => {
    try {

      let cartId = req.params.cid;
      let prodcutId = req.params.pid;
      let quantity = req.params.q;
      await managerCarts.updateCartQuantity(cartId, prodcutId, quantity);
      res.send({ status: "success" });

    } catch (error) {

      req.logger.error(error)
      return next(error)

    }
  }
);

export default router;
