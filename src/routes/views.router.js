import { Router } from "express";
import { prodManager, CartsManager } from "../App.js";
const router = Router();

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/", (req, res) => {
    res.render("login");
});
router.get("/profile", (req, res) => {
    console.log(req.session);
    res.render("profile", {
        user: req.session.user,
        isAdmin: req.session.user.rol === 'admin'
    });
});

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).send("Unable to log out");
            } else {
                if (req.cookies["tokenCookie"]) {
                    res.clearCookie("tokenCookie").status(200).redirect("/");
                }
            }
        });
    } else {
        res.redirect("/");
    }
});

router.get('/home', async (req, res) => {
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    let sort = parseInt(req.query.sort);
    let filtro = req.query.filtro;
    let filtroVal = req.query.filtroVal;
    if (!limit) {
        limit = 10;
    }
    if (!page) {
        page = 1;
    }

    await prodManager.getCars(limit, page, sort, filtro, filtroVal)
        .then((raw) => {
            let product = raw
            console.log(product)
            product.prevLink = product.hasPrevPage
                ? `http://localhost:8080/?page=${product.prevPage}`
                : "";
            product.nextLink = product.hasNextPage
                ? `http://localhost:8080/?page=${product.nextPage}`
                : "";
            product.isValid = !(page <= 0 || page > product.totalPages);
            res.render('home', { title: "Productos", product })
        });
});

router.get('/realtimeproducts', async (req, res) => {
    await prodManager.getCars()
        .then(() => {
            res.render('realTimeProducts', { title: "Productos en tiempo real" })

        });
});

router.get("/chat", (req, res) => {
    res.render("chat", { title: "Chat" });
});

router.get("/cart", async (req, res) => {
    let cartId = "64a357765be758012cc5dbeb";
    await CartsManager.getCartById(cartId).then((product) => {
        let products = JSON.stringify(product.products);
        products = JSON.parse(products);
        res.render("cart", {
            title: "Carrito",
            products,
        });
    });
});

export default router;