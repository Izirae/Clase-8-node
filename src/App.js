import express from "express";
import routerCart from "./routes/cart.router.js";
import routerProduct from "./routes/products.router.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products/", routerProduct);
app.use("/api/cart", routerCart);

app.listen(8080, () => console.log("Server running. PORT 8080"));