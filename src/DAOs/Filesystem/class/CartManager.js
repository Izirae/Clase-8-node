import fs from "fs";
import { v4 as uuidV4 } from "uuid";

export default class CartManager {
  constructor() {
    this.path = "src/class/files/Cart.json";
  }

  getCart = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(data);
      return carts;
    } else {
      const folder = this.path.replace('/Cart.json', '');
      if (!fs.existsSync(folder)) {
        await fs.promises.mkdir(folder)
      }
      return [];
    }
  };

  addCart = async () => {
    const carts = await this.getCart();
    carts.push({ id: uuidV4(), products: [] });
    return await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, "\t")
    );
  };

  getCartById = async (id) => {
    const carts = await this.getCart();

    const cart = carts.find((cart) => {
      return cart.id == id;
    });

    return cart ? cart : "El carrito no existe";
  };

  addToCart = async (idCart, idProduct) => {
    const cart = await this.getCartById(idCart);

    const index = cart.products.findIndex((product) => {
      return product.id == idProduct;
    });

    if (index == -1) {
      cart.products.push({ id: idProduct, quantity: 1 });
    } else {
      cart.products[index].quantity++;
    }

    const carts = await this.getCart();
    const cartIndex = carts.findIndex((cartIterator) => {
      return cartIterator.id == cart.id;
    });

    carts[cartIndex] = cart;

    return await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, "\t")
    );
  };
}
