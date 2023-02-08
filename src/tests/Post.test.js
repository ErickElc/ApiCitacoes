const request = require("supertest");
const app = require("../../app.js");

describe("Teste na rota de Posts", () => {
  var postId1;
  var postId2;
  var postTemplate1;
  var postTemplate2;

  beforeAll(async () => {
    let email1 = "lucas821@gmail.com";
    let email2 = "lucas0909@gmail.com";

    const requestLogin1 = await request(app).post("/api/users/login").send({
      email: email1,
      password: "senha123",
    });

    postTemplate1 = await request(app)
      .post("/api/posts/new")
      .send({
        title: "Texto que vai ser editado",
      })
      .set("token", requestLogin1.text)
      .set("email", email1);

    /////////////////////////////////

    const requestLogin2 = await request(app).post("/api/users/login").send({
      email: email2,
      password: "senha123",
    });

    postTemplate2 = await request(app)
      .post("/api/posts/new")
      .send({
        title: "Texto que vai ser editado",
      })
      .set("token", requestLogin2.text)
      .set("email", email2);
  });

  describe("Pegar posts", () => {
    it("Exibir Todos os posts", async () => {
      const res = await request(app)
        .get("/api/posts/all")
        .expect("Content-Type", /json/);
      expect(res.statusCode).toEqual(200);
    }, 20000);

    it("Exibir um único post", async () => {
      const res = await request(app)
        .get("/api/posts/" + postTemplate2.body.postId)
        .expect("Content-Type", /json/);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe("Criação de posts", () => {
    it("Criando post 01", async () => {
      const requestLogin = await request(app).post("/api/users/login").send({
        email: "lucas821@gmail.com",
        password: "senha123",
      });

      postId1 = await request(app)
        .post("/api/posts/new")
        .send({
          title: "Programador Back-End",
        })
        .set("token", requestLogin.text)
        .set("email", "lucas821@gmail.com");

      const postSelect = await request(app).get(
        `/api/posts/${postId1.body.postId}`
      );

      expect(postId1.statusCode).toEqual(201);
      expect(postSelect.body.title).toEqual("Programador Back-End");
      expect(postSelect.body.autor._id).toEqual("63e2dbba53fa34d4489af26f");
    });

    it("Criando post 02", async () => {
      const requestLogin = await request(app).post("/api/users/login").send({
        email: "lucas0909@gmail.com",
        password: "senha123",
      });

      postId2 = await request(app)
        .post("/api/posts/new")
        .send({
          title: "Programador front-end",
        })

        .set("token", requestLogin.text)
        .set("email", "lucas0909@gmail.com");

      const postSelect = await request(app).get(
        `/api/posts/${postId2.body.postId}`
      );

      expect(postId2.statusCode).toEqual(201);
      expect(postSelect.body.title).toEqual("Programador front-end");
      expect(postSelect.body.autor._id).toEqual("63e2e968c48c4fb07c56a6a4");
    });
  });

  describe("Editar posts", () => {
    it("Editando post 01", async () => {
      let email = "lucas821@gmail.com";

      const requestLogin = await request(app).post("/api/users/login").send({
        email: email,
        password: "senha123",
      });

      const res = await request(app)
        .put(`/api/posts/edit/${postTemplate1.body.postId}`)
        .send({
          title: "Desenvolvimento de sites e servidores",
        })
        .set("token", requestLogin.text)
        .set("email", email);

      const postSelect = await request(app).get(
        `/api/posts/${postTemplate1.body.postId}`
      );

      expect(res.statusCode).toEqual(200);
      expect(postSelect.body.title).toEqual(
        "Desenvolvimento de sites e servidores"
      );
      expect(postSelect.body.autor._id).toEqual("63e2dbba53fa34d4489af26f");
    });

    it("Editando post 02", async () => {
      let email = "lucas0909@gmail.com";

      const requestLogin = await request(app).post("/api/users/login").send({
        email: email,
        password: "senha123",
      });

      const res = await request(app)
        .put(`/api/posts/edit/${postTemplate2.body.postId}`)
        .send({
          title: "Desenvolvimento de sites e servidores 2",
        })
        .set("token", requestLogin.text)
        .set("email", email);

      const postSelect = await request(app).get(
        `/api/posts/${postTemplate2.body.postId}`
      );

      expect(res.statusCode).toEqual(200);
      expect(postSelect.body.title).toEqual(
        "Desenvolvimento de sites e servidores 2"
      );
      expect(postSelect.body.autor._id).toEqual("63e2e968c48c4fb07c56a6a4");
    });
  });

  describe("Deletar posts", () => {
    it("Deletando post 01", async () => {
      let email = "lucas821@gmail.com";
      const requestLogin = await request(app).post("/api/users/login").send({
        email: email,
        password: "senha123",
      });

      const res = await request(app)
        .delete(`/api/posts/remove/${postTemplate1.body.postId}`)
        .set("token", requestLogin.text)
        .set("email", email);
      const postSelect = await request(app).get(
        `/api/posts/${postTemplate1.body.postId}`
      );
      expect(res.statusCode).toEqual(200);
      expect(postSelect.status).toEqual(404);
      expect(postSelect.body).toEqual({});
    });

    it("Deletando post 02", async () => {
      let email = "lucas821@gmail.com";
      const requestLogin = await request(app).post("/api/users/login").send({
        email: email,
        password: "senha123",
      });

      const res = await request(app)
        .delete(`/api/posts/remove/${postId1.body.postId}`)
        .set("token", requestLogin.text)
        .set("email", email);
      const postSelect = await request(app).get(
        `/api/posts/${postId1.body.postId}`
      );
      expect(res.statusCode).toEqual(200);
      expect(postSelect.body).toEqual({});
      expect(postSelect.status).toEqual(404);
    });

    it("Deletando post 03", async () => {
      let email = "lucas0909@gmail.com";

      const requestLogin = await request(app).post("/api/users/login").send({
        email: email,
        password: "senha123",
      });

      const res = await request(app)
        .delete(`/api/posts/remove/${postId2.body.postId}`)
        .set("token", requestLogin.text)
        .set("email", email);
      const postSelect = await request(app).get(
        `/api/posts/${postId2.body.postId}`
      );
      expect(res.statusCode).toEqual(200);
      expect(postSelect.body).toEqual({});
      expect(postSelect.status).toEqual(404);
    });

    it("Deletando post 04", async () => {
      let email = "lucas0909@gmail.com";
      const requestLogin = await request(app).post("/api/users/login").send({
        email: email,
        password: "senha123",
      });

      const res = await request(app)
        .delete(`/api/posts/remove/${postTemplate2.body.postId}`)
        .set("token", requestLogin.text)
        .set("email", email);
      const postSelect = await request(app).get(
        `/api/posts/${postTemplate2.body.postId}`
      );
      expect(res.statusCode).toEqual(200);
      expect(postSelect.body).toEqual({});
      expect(postSelect.status).toEqual(404);
    });

    it("Tentando Deletar post que não é do usuário", async () => {
      let email = "lucas0909@gmail.com";

      const requestLogin = await request(app).post("/api/users/login").send({
        email: email,
        password: "senha123",
      });

      const res = await request(app)
        .delete(`/api/posts/remove/63e3e33024bbae9fd73457dc`)

        .set("token", requestLogin.text)
        .set("email", email);

      const postSelect = await request(app).get(
        `/api/posts/63e3e33024bbae9fd73457dc`
      );
      expect(res.statusCode).toEqual(403);
      expect(res.body).toEqual({
        message: "Não foi possível deletar esse documento",
      });
      expect(postSelect.body).toEqual(expect.any(Object));
    });
  });
});
