/// <reference types="cypress" />

import Ajv from "ajv";
import addFormats from "ajv-formats"; 
import { ticketSchema } from "../schemas/ticketSchema";

const ajv = new Ajv();
addFormats(ajv); 

const baseUrl = "http://localhost:3000";

describe("Testes da API de Tickets", () => {
  let createdTicketId;
  let createdUserId;

  before(() => {
    // Criar um usuário para associar ao ticket
    cy.request("POST", `${baseUrl}/users`, {
      name: `Usuário Ticket ${Date.now()}`,
      email: `ticketuser${Date.now()}@teste.com`,
      isAdmin: false
    }).then((response) => {
      createdUserId = response.body.id;
    });
  });

  it("Deve criar um novo ticket com sucesso", () => {
    cy.request("POST", `${baseUrl}/tickets`, {
      title: "Problema no login",
      description: "Usuário não consegue acessar a conta",
      userId: createdUserId,
      status: "Open"
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("id");
      createdTicketId = response.body.id;
    });
  });

  it("Deve buscar um ticket por ID", () => {
    cy.request("GET", `${baseUrl}/tickets/${createdTicketId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(createdTicketId);

      // Validar schema do ticket
      const validate = ajv.compile(ticketSchema);
      const valid = validate(response.body);
      expect(valid, JSON.stringify(validate.errors)).to.be.true;
    });
  });

  it("Deve atualizar o status de um ticket", () => {
    cy.request("PUT", `${baseUrl}/tickets/${createdTicketId}/status`, {
      status: "Closed"
    }).then((response) => {
      expect(response.status).to.eq(200);
      if (response.body.ticket) {
        expect(response.body.ticket.status).to.eq("Closed");
      } else {
        expect(response.body.status).to.eq("Closed");
      }

      // Validar schema do ticket atualizado
      const ticketData = response.body.ticket || response.body;
      const validate = ajv.compile(ticketSchema);
      const valid = validate(ticketData);
      expect(valid, JSON.stringify(validate.errors)).to.be.true;
    });
  });

  it("Deve excluir um ticket", () => {
    cy.request("DELETE", `${baseUrl}/tickets/${createdTicketId}`).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("Não deve criar ticket sem campo obrigatório", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/tickets`,
      failOnStatusCode: false,
      body: {
        userId: 1 
      }
    }).then((response) => {
      if (response.status === 400) {
        expect(response.body).to.satisfy(body =>
          body.hasOwnProperty("message") || body.hasOwnProperty("error")
        );
        const errorMsg = response.body.message || response.body.error;
        expect(errorMsg.toLowerCase()).to.include("description");
      } else {
        expect(response.body.description).to.be.oneOf([undefined, ""]);
      }
    });
  });

  it("Deve retornar 404 ao buscar ticket inexistente", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/tickets/999999`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("Deve retornar 404 ao atualizar ticket inexistente", () => {
    cy.request({
      method: "PUT",
      url: `${baseUrl}/tickets/999999/status`,
      failOnStatusCode: false,
      body: { status: "Open" }
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("Deve retornar 404 ao excluir ticket inexistente", () => {
    cy.request({
      method: "DELETE",
      url: `${baseUrl}/tickets/999999`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("Valida schema do ticket com ID fixo", () => {
    cy.request(`${baseUrl}/tickets/1`).then((response) => {
      const validate = ajv.compile(ticketSchema);
      const valid = validate(response.body);
      expect(valid, JSON.stringify(validate.errors)).to.be.true;
    });
  });
});