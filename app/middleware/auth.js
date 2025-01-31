const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    if (!token) {
        return res.status(403).send({ message: "Acceso restringido: No se pudo generar un token" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "No autorizado." });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = { verifyToken };