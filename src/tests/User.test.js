const userModel = require("../model/User");
const request = require("supertest");
const app = require("../../app");

describe("Testes nos métodos do UserController", () => {
  describe("Registrar usuário", () => {
    it("Criando usuário 1", async () => {
      const req = await request(app).post("/api/users/register").send({
        name: "Erick Lucas",
        age: 21,
        email: "erkei0909@gmail.com",
        password: "senha123",
      });

      const userSelected = await userModel.findOne({
        email: "erkei0909@gmail.com",
      });

      expect(req.status).toEqual(201);
      expect(userSelected).toBeTruthy();
      expect(userSelected.name).toBe("Erick Lucas");
      expect(userSelected.age).toBe(21);
    }, 8000);

    it("Criando usuário 2", async () => {
      const req = await request(app).post("/api/users/register").send({
        name: "Guilherme Almeida",
        age: 31,
        email: "elcn1234@gmail.com",
        password: "senha123",
      });

      const userSelected = await userModel.findOne({
        email: "elcn1234@gmail.com",
      });

      expect(userSelected).toBeTruthy();
      expect(req.status).toEqual(201);
      expect(userSelected.name).toBe("Guilherme Almeida");
      expect(userSelected.age).toBe(31);
    }, 7000);

    it("Criando usuário Inválido", async () => {
      const req = await request(app).post("/api/users/register").send({
        name: "Erick Lucas",
        age: 21,
        email: "erkei0909@gmail.com",
        password: "senha123",
      });
      expect(req.status).toEqual(400);
    }, 5000);
  });

  describe("Login de usuários", () => {
    it("Login User 1", async () => {
      const requestLogin = await request(app).post("/api/users/login").send({
        email: "erkei0909@gmail.com",
        password: "senha123",
      });

      expect(requestLogin.status).toEqual(202);
    }, 10000);

    it("Login User 2", async () => {
      const requestLogin = await request(app).post("/api/users/login").send({
        email: "elcn1234@gmail.com",
        password: "senha123",
      });
      expect(requestLogin.status).toEqual(202);
    }, 10000);
  });

  describe("Pegar dados do usuário", () => {
    it("Pegar dados do usuário 1", async () => {
      const requestLogin = await request(app).post("/api/users/login").send({
        email: "erkei0909@gmail.com",
        password: "senha123",
      });

      const req = await request(app).get("/api/users/users-data").set({
        email: "erkei0909@gmail.com",
        token: requestLogin.text,
      });

      expect(req.status).toEqual(200);
    });
  });

  describe("Editar Dados", () => {
    it("Editando dados do usuário  1", async () => {
      const requestLogin = await request(app).post("/api/users/login").send({
        email: "elcn1234@gmail.com",
        password: "senha123",
      });

      const req = await request(app)
        .put(`/api/users/edit-account`)
        .set("email", "elcn1234@gmail.com")
        .set("token", requestLogin.text)
        .send({
          name: "Guilherme Almeida",
          age: 31,
        });

      const userSelected = await userModel.findOne({
        email: "elcn1234@gmail.com",
      });

      expect(req.status).toEqual(200);
      expect(userSelected).toBeTruthy();
      expect(userSelected.name).toBe("Guilherme Almeida");
      expect(userSelected.age).toBe(31);
    });

    it("Editando dados do usuário 2", async () => {
      const requestLogin = await request(app).post("/api/users/login").send({
        email: "erkei0909@gmail.com",
        password: "senha123",
      });

      const req = await request(app)
        .put(`/api/users/edit-account`)
        .set("email", "erkei0909@gmail.com")
        .set("token", requestLogin.text)
        .send({
          name: "Lucas Nascimento",
          age: 91,
        });

      const userSelected = await userModel.findOne({
        email: "erkei0909@gmail.com",
      });

      expect(req.status).toEqual(200);
      expect(userSelected).toBeTruthy();
      expect(userSelected.name).toBe("Lucas Nascimento");
      expect(userSelected.age).toBe(91);
    });
  });

  describe("Deletando usuários", () => {
    it("Deletando usuário 1", async () => {
      const requestLogin = await request(app).post("/api/users/login").send({
        email: "erkei0909@gmail.com",
        password: "senha123",
      });

      const req = await request(app)
        .delete(`/api/users/remove`)
        .set("email", "erkei0909@gmail.com")
        .set("token", requestLogin.text);

      const userSelected2 = await userModel.findOne({
        email: "erkei0909@gmail.com",
      });
      expect(req.status).toEqual(200);
      expect(userSelected2).toBeFalsy();
    }, 5000);

    it("Deletando usuário 2", async () => {
      const requestLogin = await request(app).post("/api/users/login").send({
        email: "elcn1234@gmail.com",
        password: "senha123",
      });

      const req = await request(app)
        .delete(`/api/users/remove`)
        .set("email", "elcn1234@gmail.com")
        .set("token", requestLogin.text);
      const userSelected2 = await userModel.findOne({
        email: "elcn1234@gmail.com",
      });
      expect(req.status).toEqual(200);
      expect(userSelected2).toBeFalsy();
    }, 5000);
  });
});
