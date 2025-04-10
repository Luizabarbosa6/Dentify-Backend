# Dentify - Backend API

**Dentify** é uma API para um sistema de **perícia odontológica**, permitindo o cadastro e gerenciamento de **casos de perícia**, além de realizar **autenticação e controle de permissões**. Com ela, você pode gerenciar usuários, casos, e realizar autenticação segura com **JWT** e **bcryptjs**.

## Funcionalidades

- **Cadastro de Usuários:** Crie, edite e remova usuários com diferentes perfis de acesso (admin, assistente).
- **Autenticação:** Login seguro usando JWT.
- **Cadastro de Casos de Perícia:** Adicione e edite casos odontológicos.
- **Controle de Permissões:** Diferentes níveis de acesso para usuários e assistentes.
- **Download de Casos:** Permite o download dos casos de perícia cadastrados.

## Tecnologias Utilizadas

- **Node.js** com **Express**
- **MongoDB** (usando **Mongoose** para modelagem de dados)
- **JWT (JSON Web Token)** para autenticação
- **bcryptjs** para segurança na senha
- **CORS** para permitir chamadas cross-origin

## Link da API

A API está hospedada no [Render](https://dentify-backend-dct4.onrender.com). Para testar, basta fazer requisições HTTP para este link.

## Como Rodar Localmente

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/dentify-backend.git
Navegue até a pasta do projeto:

bash
Copiar
Editar
cd dentify-backend
Instale as dependências:

bash
Copiar
Editar
npm install
Inicie o servidor:

bash
Copiar
Editar
node server.js
O servidor estará rodando em http://localhost:3000 por padrão.

Endpoints Principais
POST /users/register: Cria um novo usuário.

POST /users/login: Realiza o login e retorna um token JWT.

GET /users: Lista todos os usuários.

GET /users/:id: Obtém um usuário específico.

PUT /users/:id: Atualiza os dados do usuário.

DELETE /users/:id: Exclui um usuário.

POST /cases: Cria um novo caso de perícia.

GET /cases: Lista todos os casos de perícia.

GET /cases/:id: Obtém um caso específico.

PUT /cases/:id: Atualiza um caso de perícia.

DELETE /cases/:id: Exclui um caso de perícia.

GET /cases/download/:id: Baixa um caso de perícia.