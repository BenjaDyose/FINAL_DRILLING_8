module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "El Campo del nombre es requerido"
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "El Campo del apellido es requerido"
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "El correo electrónico es requerido"
        },
        isEmail: {
          args: true,
          msg: 'Formato de correo inválido'
        }
      },
      unique: {
        args: true,
        msg: 'El correo electrónico ya está registrado en la base de datos'
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "La contraseña es requerida"
        },
        len: {
          args: [8, Infinity],
          msg: "La contraseña debe tener al menos 8 caracteres"
        }
      }
    }
  });

  return User;
};