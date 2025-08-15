# api-tests-capgemini
Testes automatizados em Cypress para API de Usuários e Tickets

# 🧪 Testes Automatizados da API

![Cypress](https://img.shields.io/badge/Framework-Cypress-4BC0C0)
![Node.js](https://img.shields.io/badge/Node.js-16.x-green)
![Status](https://img.shields.io/badge/Status-In%20Progress-orange)

## 🔹 Descrição
Testes automatizados em **Cypress** para a API de **Usuários** e **Tickets**, cobrindo:  
- Cenários positivos e negativos  
- Validação de **schemas** com AJV  
- Cobertura completa de endpoints  

## ⚙️ Como executar
1. Clone o repositório:
```bash
git clone https://github.com/TalitaSilva96/api-tests-capgemini.git
cd api-tests-capgemini
Instale dependências:

bash
Copiar
Editar
npm install
Execute os testes:

Modo interativo:

bash
Copiar
Editar
npx cypress open
Modo headless (terminal):

bash
Copiar
Editar
npx cypress run
📂 Estrutura do projeto
pgsql
Copiar
Editar
cypress/
│
├─ e2e/
│   ├─ users.cy.js       → testes de usuários
│   └─ tickets.cy.js     → testes de tickets
│
├─ schemas/
│   ├─ userSchema.js     → schema AJV para usuários
│   └─ ticketSchema.js   → schema AJV para tickets
│
└─ support/
    └─ index.js          → configurações gerais do Cypress
🐞 Bugs encontrados
Usuários: isAdmin não retornado em alguns endpoints

Tickets: title não retornado em alguns endpoints

Testes de schema falham nestes casos, já reportados

💡 Sugestões de melhorias
Garantir consistência de campos obrigatórios e estrutura JSON

Padronizar mensagens de erro

Validar duplicidade de registros no backend

Consistência nos status codes

Implementar autenticação e controle de acesso

📌 Contato
Talita Silva

GitHub: https://github.com/TalitaSilva96
