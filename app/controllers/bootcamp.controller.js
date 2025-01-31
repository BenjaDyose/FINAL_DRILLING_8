const db = require('../models')
const Bootcamp = db.bootcamps
const User = db.users

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = async (req, res) => {
  try {
    const { title, cue, description } = req.body;

    const bootcamp = await Bootcamp.create({ title, cue, description });
    res.status(201).send({ message: "Bootcamp creado con éxito.", bootcamp });

  } catch (error) {
    console.error("Error al crear el bootcamp:", error);
    res.status(500).send({ message: "Error interno al crear el bootcamp." });
  }
};
// Agregar un Usuario al Bootcamp
exports.addUser = async (req, res) => {
  try {
    const { bootcampId, userId } = req.body;

    // Verificar si el Bootcamp existe
    const bootcamp = await Bootcamp.findByPk(bootcampId);
    if (!bootcamp) {
      return res.status(404).send({ message: "Bootcamp no encontrado." });
    }

    // Verificar si el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    // Agregar el usuario al Bootcamp
    await bootcamp.addUser(user);
    res.status(200).send({
      message: `Usuario con id=${user.id} agregado al Bootcamp con id=${bootcamp.id}.`,
    });
  } catch (error) {
    console.error("Error al agregar el usuario al bootcamp:", error);
    res.status(500).send({ message: "Error interno al agregar el usuario al bootcamp." });
  }
};


// obtener los bootcamp por id 
exports.findById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el Bootcamp por ID
    const bootcamp = await Bootcamp.findByPk(id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName"],
          through: { attributes: [] },
        },
      ],
    });

    if (!bootcamp) {
      return res.status(404).send({ message: "Bootcamp no encontrado." });
    }

    res.status(200).send(bootcamp);
  } catch (error) {
    console.error("Error al obtener el bootcamp:", error);
    res.status(500).send({ message: "Error interno al obtener el bootcamp." });
  }
};
// obtener todos los Usuarios incluyendo los Bootcamp
exports.findAll = async (req, res) => {
  try {
    // Buscar todos los Bootcamps
    const bootcamps = await Bootcamp.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).send(bootcamps);
  } catch (error) {
    console.error("Error al obtener los bootcamps:", error);
    res.status(500).send({ message: "Error interno al obtener los bootcamps." });
  }
};