import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import { intializePassport } from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";

import config from "./config/config.js";

import routerCart from "./routes/cart.router.js";
import routerProduct from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js"
import sessionRouter from "./routes/session.router.js";
import mockingproducts from "./routes/mocking.router.js";

import CartManager from "./DAOs/CartManagerMongo.class.js";
import ProductManager from "./DAOs/ProductManagerMongo.class.js";

import { messagesModel } from "./DAOs/models/messages.model.js";

import routerLogger from './routes/logger.router.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { addLogger } from './config/logger.config.js';

export const prodManager = new ProductManager();
export const CartsManager = new CartManager();

const app = express();
app.use(addLogger)

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(passport.initialize());
intializePassport();

app.engine('handlebars', engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');

app.use(
  session({
    store: new MongoStore({
      mongoUrl: config.mongoUrl,
    }),
    autoRemove: 'native',
    secret: config.mongoSecret,
    resave: true,
    saveUninitialized: false,
  })
);

app.use('/', viewsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/products/", routerProduct);
app.use("/api/cart", routerCart);
app.use("/api/mockingproducts", mockingproducts);
app.use('/logger/', routerLogger)
app.use(errorMiddleware)

const server = app.listen(config.port, () => console.log(`Server running. PORT ${config.port}`));

const socketServer = new Server(server);
const cars = await prodManager.getCars()
console.log(cars)
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