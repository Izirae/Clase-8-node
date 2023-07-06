import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";

import routerCart from "./routes/cart.router.js";
import routerProduct from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js"
import sessionRouter from "./routes/session.router.js";

import CartManager from "./DAOs/CartManagerMongo.class.js";
import ProductManager from "./DAOs/ProductManagerMongo.class.js";

import { messagesModel } from "./DAOs/models/messages.model.js";

export const prodManager = new ProductManager();
export const CartsManager = new CartManager();

const app = express();

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');

app.use(
  session({
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://lautarobazzola:0zv80h92MWEGQi3Q@cluster0.yoldw0l.mongodb.net/ecommerce?retryWrites=true&w=majority",
    }),
    secret: "mongoSecret",
    resave: true,
    saveUninitialized: false,
  })
);

app.use("/api/sessions", sessionRouter);
app.use("/api/products/", routerProduct);
app.use("/api/cart", routerCart);
app.use('/', viewsRouter);

const server = app.listen(8080, () => console.log("Server running. PORT 8080"));

const socketServer = new Server(server);
const cars = await prodManager.getCars()
let mensajes = await messagesModel.find()

socketServer.on("connection", socket => {
  socketServer.emit('initCars', cars);
  socketServer.emit('imprimir', mensajes);

  socket.on("message", (data) => {
    console.log("esto son los mensajes", data);
    mensajes.push(data);
    socketServer.emit("imprimir", mensajes);
    messagesModel.create(data);
  });

  socket.on("authenticatedUser", (data) => {
    socket.broadcast.emit("newUserAlert", data);
  });
});

export default socketServer;