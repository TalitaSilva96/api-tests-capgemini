
/// <reference types="cypress" />
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { userSchema } from "../schemas/userSchema";

const ajv = new Ajv();
addFormats(ajv);

const baseUrl = "http://localhost:3000";
let createdUserId;

describe("Testes da API de Usuários", () => {

  // Criar usuário antes dos testes positivos
  beforeEach(() => {
    const userData = {
      name: `Teste ${Date.now()}`,
      email: `teste${Date.now()}@teste.com`,
      isAdmin: true
    };

    cy.request({
      method: "POST",
      url: `${baseUrl}/users`,
      body: userData,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 201) {
        createdUserId = response.body.id;
      }
    });
  });

  // ----------------- POSITIVOS -----------------
  it("Deve criar um novo usuário com sucesso", () => {
    const userData = {
      name: `Novo ${Date.now()}`,
      email: `novo${Date.now()}@teste.com`,
      isAdmin: false
    };

    cy.request("POST", `${baseUrl}/users`, userData).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("id");
      expect(response.body.name).to.eq(userData.name);

      // Validar schema do usuário
      const validate = ajv.compile(userSchema);
      const valid = validate(response.body);
      expect(valid, JSON.stringify(validate.errors)).to.be.true;
    });
  });

  it("Deve listar todos os usuários", () => {
    cy.request("GET", `${baseUrl}/users`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");

      if (response.body.length > 0) {
        const validate = ajv.compile(userSchema);
        const valid = validate(response.body[0]);
        expect(valid, JSON.stringify(validate.errors)).to.be.true;
      }
    });
  });

  it("Deve buscar um usuário por ID", () => {
    cy.request("GET", `${baseUrl}/users/${createdUserId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id", createdUserId);

      const validate = ajv.compile(userSchema);
      const valid = validate(response.body);
      expect(valid, JSON.stringify(validate.errors)).to.be.true;
    });
  });

  it("Deve atualizar dados de um usuário", () => {
    const novoNome = "Usuário Atualizado";

    cy.request("PUT", `${baseUrl}/users/${createdUserId}`, {
      name: novoNome,
      email: `atualizado${Date.now()}@teste.com`,
      isAdmin: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("message");

      cy.request("GET", `${baseUrl}/users/${createdUserId}`).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.name).to.eq(novoNome);

        const validate = ajv.compile(userSchema);
        const valid = validate(getResponse.body);
        expect(valid, JSON.stringify(validate.errors)).to.be.true;
      });
    });
  });

  it("Deve excluir um usuário", () => {
    cy.request("POST", `${baseUrl}/users`, {
      name: `Delete ${Date.now()}`,
      email: `delete${Date.now()}@teste.com`,
      isAdmin: false
    }).then((res) => {
      const userId = res.body.id;

      cy.request("DELETE", `${baseUrl}/users/${userId}`).then((deleteRes) => {
        expect(deleteRes.status).to.eq(200);
      });
    });
  });

  // ----------------- NEGATIVOS -----------------
  it("Não deve permitir criar usuário duplicado", () => {
    const duplicateData = {
      name: "Usuário Duplicado",
      email: "duplicado@teste.com",
      isAdmin: false
    };

    cy.request({
      method: "POST",
      url: `${baseUrl}/users`,
      body: duplicateData,
      failOnStatusCode: false
    });

    cy.request({
      method: "POST",
      url: `${baseUrl}/users`,
      body: duplicateData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(409);
      expect(response.body.error).to.include("already exists");
    });
  });

  it("Não deve criar usuário sem campo obrigatório", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/users`,
      body: { email: "semnome@teste.com" },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it("Deve retornar 404 ao buscar usuário inexistente", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/users/999999`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("Deve retornar 404 ao atualizar usuário inexistente", () => {
    cy.request({
      method: "PUT",
      url: `${baseUrl}/users/999999`,
      body: {
        name: "Inexistente",
        email: "inexistente@teste.com",
        isAdmin: false
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("Deve retornar 404 ao excluir usuário inexistente", () => {
    cy.request({
      method: "DELETE",
      url: `${baseUrl}/users/999999`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

});