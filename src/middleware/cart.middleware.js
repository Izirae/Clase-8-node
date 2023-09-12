export const verificarPertenenciaCarrito = (req, res, next) => {
    if (req.session.user.cart === req.params.cid) {
        next();
    } else {
        res.send("solo puedes agregar productos a tu caarrito");
    }
};
