const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../models');
const config = require("../config/auth.config");

const User = db.users;
const Bootcamp = db.bootcamps;

// Registrar usuario nuevo
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).send({ message: "El correo ya está en uso." });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 8)
    });

    res.status(201).send({ message: "Usuario registrado con éxito.", user });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).send({ message: "Error interno al registrar el usuario." });
  }
};

// Iniciar Sesión

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ message: "Email no corresponde a una cuenta existente." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: "1h" }); // 24 horas

    res.status(200).send({
      message: "Inicio de sesión exitoso.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).send({ message: "Error interno al iniciar sesión." });
  }
};


// obtener los bootcamp de un usuario por ID
exports.findUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Bootcamp,
          as: "bootcamps",
          attributes: ["id", "title"],
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).send({ message: "Error interno al obtener el usuario." });
  }
};

// obtener todos los Usuarios incluyendo los bootcamp
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Bootcamp,
          as: "bootcamps",
          attributes: ["id", "title"],
          through: { attributes: [] }
        }
      ]
    });

    res.status(200).send(users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).send({ message: "Error interno al obtener los usuarios." });
  }
};

// Actualizar usuarios
exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName } = req.body;

    const [updated] = await User.update(
      { firstName, lastName },
      { where: { id: userId } }
    );

    if (!updated) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const updatedUser = await User.findByPk(userId);
    res.status(200).send({ message: "Usuario actualizado con éxito.", updatedUser });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send({ message: "Error interno al actualizar el usuario." });
  }
};

// Eliminar usuarios
exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const deleted = await User.destroy({ where: { id: userId } });

    if (!deleted) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    res.status(200).send({ message: "Usuario eliminado con éxito." });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).send({ message: "Error interno al eliminar el usuario." });
  }
};