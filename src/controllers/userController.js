const userModel = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const saltKey = bcrypt.genSaltSync(8);

class userController {
  // Registrar User
  static async createUser(req, res) {
    const emailExist = await userModel.findOne({ email: req.body.email });

    if (emailExist)
      return res.status(400).send({
        message:
          "Não foi possível cadastrar esse e-mail, pois ele já foi cadastrado!",
      });

    const cryptPassword = bcrypt.hashSync(req.body.password, saltKey);

    const userRegister = new userModel({
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      password: cryptPassword,
    });

    try {
      const userCadastrado = await userRegister.save();
      res.status(201).send({
        message: "Usuário cadastrado com sucesso!",
        userId: userCadastrado.id,
      });
    } catch (err) {
      res
        .status(500)
        .send({ message: `Erro ao cadastrar usuário`, error: err });
    }
  }

  // Logar User
  static async loginUser(req, res) {
    const userSelected = await userModel.findOne({ email: req.body.email });

    if (!userSelected)
      return res.status(400).send({ message: "Email or password incorrect" });
    const passwordMatch = bcrypt.compareSync(
      req.body.password,
      userSelected.password
    );

    if (!passwordMatch)
      return res.status(400).send({ message: "E-mail or password incorrect" });

    const token = jwt.sign(
      { _id: userSelected._id },
      process.env.SECRET_TOKEN,
      {
        expiresIn: "12h",
      }
    );
    res.status(202).send(token);
  }

  // Editar dados do usuário
  static async editUserData(req, res) {
    try {
      const authorization = jwt.verify(
        req.headers.token,
        process.env.SECRET_TOKEN
      );

      const userSelected = await userModel.findOne({
        email: req.headers.email,
      });
      if (!userSelected)
        return res
          .status(400)
          .send({ message: "Não foi possível encontrar o usuário!" });

      if (!authorization)
        return res
          .status(403)
          .send({ message: "Você não tem permissão para editar esses dados!" });

      await userModel.updateOne(
        { email: req.headers.email },
        {
          $set: {
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
          },
        }
      );
      res
        .status(200)
        .send({ message: "Dados do usuário editados com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Não foi possível editar os dados!", error: error });
    }
  }

  // Pegar dados do usuário

  static async userData(req, res) {
    try {
      const userSelected = await userModel.findOne({
        email: req.headers.email,
      });

      const authorization = jwt.verify(
        req.headers.token,
        process.env.SECRET_TOKEN
      );

      if (!userSelected)
        return res
          .status(404)
          .send({ message: "Não foi possível encontrar o usuário!" });

      if (authorization._id.toString() !== userSelected._id.toString())
        return res.status(403).send({
          message: "Você não tem permissão para acessar esses dados!",
        });

      const userData = {
        _id: userSelected._id,
        name: userSelected.name,
        age: userSelected.age,
        email: userSelected.email,
        admin: userSelected.admin,
        createdDate: userSelected.createdDate,
      };
      res.status(200).send(userData);
    } catch (error) {
      res
        .status(500)
        .send("Não foi possível pegar os dados do usuário! " + error);
    }
  }

  // Deletar conta
  static async deleteUsers(req, res) {
    try {
      const token = req.headers.token;
      const authorization = jwt.verify(token, process.env.SECRET_TOKEN);
      const authorFind = await userModel.findOne({ email: req.headers.email });
      if (!authorFind)
        return res
          .status(404)
          .send({ message: "Não foi possível executar está função!" });

      if (
        !authorization ||
        authorization._id.toString() !== authorFind._id.toString()
      )
        return res
          .status(403)
          .send({ message: "Não foi possível deletar do usuário!" });
      await userModel.findOneAndDelete({ email: req.headers.email });
      res.status(200).send({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).send({ message: "Token inválido" });
      }
      res.status(500).send(error.message);
    }
  }
}

module.exports = userController;
