# 🛒 Market Application

Uma aplicação completa de e-commerce desenvolvida com **React**, **Node.js**, **Express**, e **MongoDB**, com suporte para autenticação via Google, upload de imagens, gerenciamento de produtos, carrinho de compras e pedidos.

## 📂 Estrutura do Projeto

### Backend

O backend foi desenvolvido com **Node.js** e **Express**, utilizando **MongoDB** como banco de dados. Ele fornece APIs REST para gerenciar usuários, produtos, categorias, carrinho e pedidos.

### Frontend

O frontend foi desenvolvido com **React** e **Vite**, utilizando **Redux** para gerenciamento de estado global. Ele oferece uma interface moderna e responsiva para os usuários.

---

## 🚀 Tecnologias Utilizadas

### Backend

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework para criação de APIs
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM para interagir com o MongoDB
- **Cloudinary**: Serviço de armazenamento de imagens
- **JWT**: Autenticação baseada em tokens
- **Helmet**: Middleware de segurança
- **dotenv**: Gerenciamento de variáveis de ambiente

### Frontend

- **React**: Biblioteca para construção de interfaces
- **Vite**: Ferramenta de build rápida para React
- **Redux**: Gerenciamento de estado global
- **React Router**: Navegação entre páginas
- **Axios**: Comunicação com APIs
- **TailwindCSS**: Estilização moderna e responsiva

---

## 📋 Funcionalidades

### Backend

- **Autenticação**: Login via Google e JWT
- **Gerenciamento de usuários**: Registro, login, atualização de perfil
- **Gerenciamento de produtos**: Adicionar, editar, excluir e listar produtos
- **Carrinho de compras**: Adicionar, remover e atualizar itens
- **Pedidos**: Criar e listar pedidos
- **Upload de imagens**: Upload de imagens para produtos via Cloudinary

### Frontend

- **Página inicial**: Exibição de produtos e categorias
- **Busca**: Pesquisa de produtos por nome ou categoria
- **Carrinho de compras**: Gerenciamento de itens no carrinho
- **Checkout**: Finalização de pedidos
- **Dashboard do administrador**: Gerenciamento de categorias, subcategorias e produtos
- **Autenticação**: Login via Google e email/senha

---

## 📦 Instalação

### Backend

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-repositorio.git
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com suas variáveis de ambiente:
   ```env
   MONGODB_URI=mongodb+srv://seu_usuario:senha@cluster.mongodb.net/market
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:8080
   GOOGLE_CLIENT_ID=seu_google_client_id
   GOOGLE_CLIENT_SECRET=seu_google_client_secret
   CLOUDINARY_CLOUD_NAME=seu_cloudinary_name
   CLOUDINARY_API_KEY=seu_cloudinary_api_key
   CLOUDINARY_API_SECRET=seu_cloudinary_api_secret
   PORT=8080
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```

### Frontend

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-repositorio.git
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com a URL do backend:
   ```env
   REACT_APP_SERVER_DOMAIN=http://localhost:8080
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 🌐 Deploy

### Backend

O backend pode ser implantado no **Vercel** ou **Heroku**. Certifique-se de configurar as variáveis de ambiente no painel de controle da plataforma.

### Frontend

O frontend pode ser implantado no **Vercel** ou **Netlify**. Certifique-se de configurar a variável `REACT_APP_SERVER_DOMAIN` com a URL do backend implantado.

---

## 📂 Estrutura de Diretórios

### Backend

```
backend/
├── api/
│   └── index.js                # Arquivo principal do servidor
├── config/
│   └── connectDB.js            # Configuração da conexão com o banco de dados
├── controllers/
│   ├── user.controller.js      # Controlador de usuários
│   ├── product.controller.js   # Controlador de produtos
│   ├── cart.controller.js      # Controlador de carrinho
│   └── order.controller.js     # Controlador de pedidos
├── middlewares/
│   ├── isAdmin.js              # Middleware para verificar se o usuário é admin
│   └── authMiddleware.js       # Middleware de autenticação
├── routes/
│   ├── user.route.js           # Rotas de usuários
│   ├── product.route.js        # Rotas de produtos
│   ├── cart.route.js           # Rotas de carrinho
│   └── order.route.js          # Rotas de pedidos
└── utils/
    └── uploadImageCloudinary.js # Utilitário para upload de imagens
```

### Frontend

```
frontend/
├── src/
│   ├── components/             # Componentes reutilizáveis
│   ├── pages/                  # Páginas da aplicação
│   ├── routes/                 # Configuração de rotas
│   ├── store/                  # Configuração do Redux
│   ├── utils/                  # Utilitários
│   └── common/                 # Configuração de APIs
└── public/
    └── index.html              # Arquivo HTML principal
```

---

## 🛠️ Contribuição

1. Faça um fork do repositório.
2. Crie uma branch para sua funcionalidade:
   ```bash
   git checkout -b minha-funcionalidade
   ```
3. Faça commit das suas alterações:
   ```bash
   git commit -m "Adicionei minha funcionalidade"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-funcionalidade
   ```
5. Abra um Pull Request.

---