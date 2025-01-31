const db = require("../models");
const User = db.users;

verifySignUp = (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            res.status(400).send({ message: "Ingrese otro correo válido, este ya está en uso" });
            return;
        }
        next();
    });
};

module.exports = { verifySignUp };