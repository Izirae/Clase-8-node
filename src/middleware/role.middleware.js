export const rolesMiddlewareAdmin = (req, res, next) => {
    if (req.session.user.rol === "admin") {
        next();
    } else {
        res.send({ error: `you don't have access` });
    }
};
export const rolesMiddlewareUser = (req, res, next) => {
    if (req.session.user.rol === "usuario") {
        next();
    } else {
        res.send({ error: `you don't have access` });
    }
};
