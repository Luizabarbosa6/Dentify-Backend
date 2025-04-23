# 🦷 Dentify - API Backend para Gestão de Laudos Odonto-Legais 🚀

**Dentify** é uma poderosa API REST para gerenciamento de **casos periciais odontológicos**, com suporte a múltiplos perfis de usuários, evidências, laudos digitais, relatórios e geração de dashboards com dados dinâmicos. Ideal para profissionais de odontologia legal, peritos, assistentes e gestores da área forense.  

🔗 **API pública**: [https://dentify-backend-dct4.onrender.com](https://dentify-backend-dct4.onrender.com)

---

## ⚙️ Funcionalidades Principais

✅ **Autenticação e Autorização via JWT**  
✅ **Perfis de Acesso**: Admin, Perito, Assistente  
✅ **Gerenciamento de Casos Periciais**  
✅ **Armazenamento e Upload de Evidências (Cloudinary)**  
✅ **Geração e Assinatura de PDFs (Laudos e Relatórios)**  
✅ **Dashboard com indicadores e gráficos**  
✅ **Documentação via Swagger (OpenAPI)**  
✅ **Controle de status (Em andamento, Finalizado, Arquivado)**  
✅ **Buscas por tipo de caso (Vítima, Desaparecido, Outro)**  

---

## 🧱 Estrutura do Projeto

```
src/
├── config/                # Configurações (Cloudinary, etc)
├── controllers/           # Lógica dos endpoints
├── documents/             # Swagger / OpenAPI
├── keys/                  # Chaves públicas e privadas (JWT, assinatura)
├── middlewares/           # Autenticação e controle de acesso
├── models/                # Modelos do MongoDB (Mongoose)
├── routes/                # Definição das rotas da API
├── utils/                 # Utilitários (geração de PDF, assinatura, upload)
└── server.js              # Ponto de entrada da aplicação
```

---

## 📊 Dashboard

- **Resumo de Casos** por status (`Em andamento`, `Finalizado`, `Arquivado`)
- **Distribuição de Casos** por tipo (`Vítima`, `Desaparecido`, `Outro`)
- **Gráficos para cruzamento de dados** (ex: vítimas x desaparecidos)

> Rota: `GET /dashboard/resumo`  
> Dados já prontos para uso em gráficos no frontend!

---

## 🛠️ Tecnologias Utilizadas

| Stack        | Tecnologia                         |
|--------------|-------------------------------------|
| Backend      | Node.js + Express                   |
| Banco de Dados | MongoDB com Mongoose               |
| Segurança    | JWT, Bcrypt, Helmet                 |
| Upload       | Multer + Cloudinary                 |
| PDF          | PDFKit, pdf-lib, node-signpdf       |
| Documentação | Swagger (swagger-jsdoc + UI)        |

---

## 📄 Documentação Swagger

- **Local**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)  
- **Render**: Adicione `/api-docs` ao final da URL pública do Render.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js v18+
- MongoDB (local ou Atlas)
- `.env` com suas variáveis (como `MONGO_URI`, `CLOUDINARY`, etc.)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dentify-backend.git

# Acesse o projeto
cd dentify-backend

# Instale as dependências
npm install

# Inicie o servidor
node server.js
```

Servidor ativo em: `http://localhost:3000`

---

## 🔐 Variáveis de Ambiente `.env` (exemplo)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/dentify
JWT_SECRET=supertoken123
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## 📦 Dependências do Projeto

```json
"dependencies": {
  "bcrypt": "^5.1.1",
  "bcryptjs": "^3.0.2",
  "cloudinary": "^2.6.0",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^5.1.0",
  "helmet": "^8.1.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.13.2",
  "multer": "^1.4.5-lts.2",
  "multer-storage-cloudinary": "^4.0.0",
  "node-forge": "^1.3.1",
  "node-signpdf": "^3.0.0",
  "pdf-lib": "^1.17.1",
  "pdfkit": "^0.16.0",
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.1"
}
```

---

## 🦚 Testes

```bash
npm test
```

---

## 📜 Licença

Este projeto está licenciado sob a **Licença MIT** – consulte o arquivo `LICENSE` para mais detalhes.

