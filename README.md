# Dentify - Backend API 🦷🚀

**Dentify** é uma API para um sistema de **perícia odontológica**, permitindo o cadastro e gerenciamento de **casos de perícia**, além de realizar **autenticação e controle de permissões**. O sistema é ideal para profissionais de odontologia legal que precisam gerenciar casos, evidências, laudos e usuários com diferentes níveis de acesso.

## Funcionalidades ⚙️

- **Cadastro de Usuários**: Crie, edite e remova usuários com diferentes perfis de acesso (admin, perito, assistente).
- **Autenticação**: Login seguro utilizando **JWT** (JSON Web Token).
- **Cadastro de Casos de Perícia**: Adicione e edite casos odontológicos com evidências.
- **Controle de Permissões**: Diferentes níveis de acesso para usuários (admin, perito, assistente).
- **Evidências**: Armazenamento de evidências, como imagens e textos, associadas aos casos.
- **Laudos**: Geração e exportação de laudos baseados nas evidências coletadas.
- **Download de Casos**: Permite o download dos casos de perícia cadastrados.

## Tecnologias Utilizadas 🧑‍💻

- **Node.js** com **Express** 🚀
- **MongoDB** (usando **Mongoose** para modelagem de dados) 📚
- **JWT (JSON Web Token)** para autenticação 🔒
- **bcryptjs** para segurança na senha 🔑
- **CORS** para permitir chamadas cross-origin 🌐

## Documentação Swagger 📚

A documentação da API está disponível através do Swagger, o que facilita a visualização e interação com os endpoints da API.

- **Swagger UI**: Acesse a documentação interativa da API em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs) (localmente).
- **Documentação**: A API é descrita utilizando o formato OpenAPI (Swagger 3.0), incluindo detalhes sobre autenticação, parâmetros e respostas de cada endpoint.

## Link da API 🌍

A API está hospedada no [Render](https://dentify-backend-dct4.onrender.com){:target="_blank"}. Para testar, basta fazer requisições HTTP para este link.

## Como Rodar Localmente 🏠

### Pré-requisitos

Antes de rodar o projeto, você precisa ter o **Node.js** e o **MongoDB** instalados.

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/dentify-backend.git
Navegue até a pasta do projeto:

bash
Copiar
Editar
cd src
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

Executando Testes
Se você deseja rodar testes, execute:

bash
Copiar
Editar
npm test
Isso executará todos os testes definidos no projeto e garantirá que as funcionalidades não quebrem nada ao serem alteradas.

Licença 📜
Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.