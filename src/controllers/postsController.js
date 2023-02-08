const postModel = require("../model/Posts.js");
const userModel = require("../model/User.js");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

class PostController {
  // Listar todos os posts

  static async listarPosts(req, res) {
    try {
      const postsAll = await postModel
        .find()
        .populate({ path: "autor", select: "name _id email admin" })
        .exec();
      if (!postsAll)
        return res
          .status(400)
          .send({ message: "Não foi possível encontrar os posts!" });
      res.status(200).send(postsAll);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Não foi possível listar os posts!", error: error });
    }
  }
  // Listar um post pelo ID

  static async listarUmPost(req, res) {
    const id = req.params.id;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("O ID fornecido é inválido");
      }
      const post = await postModel
        .findById(id)
        .populate({ path: "autor", select: "name _id email admin" })
        .exec();
      if (post == null) {
        return res
          .status(404)
          .send("Não foi encontrado um post com o ID fornecido");
      }
      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      res.status(500).send("Ocorreu um erro ao buscar o post");
    }
  }

  // Criar um post
  static async cadastrarPost(req, res) {
    const token = req.headers.token;

    try {
      const findAutor = await userModel.findOne({ email: req.headers.email });

      const authorization = jwt.verify(token, process.env.SECRET_TOKEN);

      let post = new postModel({
        title: req.body.title,
        autor: findAutor._id,
      });

      if (!findAutor)
        return res
          .status(400)
          .send({ message: "Não foi possível encontrar o usuário" });

      if (authorization._id != findAutor._id)
        return res
          .status(403)
          .send({ message: "Não foi possível criar esse documento" });

      const posted = await post.save();

      res.status(201).send({
        message: "Post criado com sucesso",
        postId: posted.id,
      });
    } catch (err) {
      res
        .status(500)
        .send({ message: "Não foi possível criar o post", error: err });
    }
  }

  // Editar Post por ID
  static async editarPost(req, res) {
    const id = req.params.id;

    try {
      const findUser = await userModel.findOne({ email: req.headers.email });
      const findPost = await postModel.findOne({ _id: id });

      const authorization = jwt.verify(
        req.headers.token,
        process.env.SECRET_TOKEN
      );

      if (findUser._id.toString() != findPost.autor.toString())
        return res
          .status(403)
          .send({ message: "Não foi possível editar esse post" });
      if (authorization._id != findPost.autor._id)
        return res
          .status(403)
          .send({ message: "Não foi possível editar esse post" });

      const postEditado = await postModel.findByIdAndUpdate(id, {
        $set: {
          title: req.body.title,
        },
      });

      res.status(200).send({
        message: "Post editado com sucesso",
        postId: postEditado.id,
      });
    } catch (err) {
      res
        .status(500)
        .send({ message: "Não foi possível editar esse post", error: err });
    }
  }

  // Deletar Post por ID
  static async deletePost(req, res) {
    const id = req.params.id;

    try {
      const findUser = await userModel.findOne({ email: req.headers.email });
      const findPost = await postModel.findOne({ _id: id });

      const authorization = jwt.verify(
        req.headers.token,
        process.env.SECRET_TOKEN
      );
      if (findUser._id.toString() != findPost.autor.toString())
        return res
          .status(403)
          .send({ message: "Não foi possível deletar esse documento" });

      if (authorization._id != findPost.autor._id)
        return res
          .status(403)
          .send({ message: "Não foi possível deletar esse documento" });

      const request = await postModel.findByIdAndRemove(id);

      if (!request)
        return res.status(404).send({ message: "Post não encontrado" });

      res.status(200).send({ message: "Post deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: `Não foi possível deletar o post`, error: error });
    }
  }
}

module.exports = PostController;
