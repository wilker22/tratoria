# Contexto Técnico do Projeto Pizzaria

## Visão geral

Este projeto é uma API REST em Node.js + TypeScript para gerenciamento de pizzaria/tratoria. A aplicação usa Express, Prisma ORM com PostgreSQL, JWT para autenticação, Cloudinary para upload de imagens e Zod para validação de schemas.

- Nome do backend: `backend`
- Runtime: Node.js + TypeScript
- Banco: PostgreSQL
- ORM: Prisma 7
- Autenticação: JWT (`jsonwebtoken`)
- Upload de imagens: Cloudinary + Multer em memória
- Validação: Zod
- Prefixo global: nenhum (`/` na raiz)
- Porta padrão: `3333`

## Arquitetura

Fluxo geral de uma requisição:

1. Rota Express
2. Middleware de validação/autenticação/autorização
3. Controller
4. Service
5. Prisma/PostgreSQL ou Cloudinary
6. Resposta HTTP

A lógica principal está distribuída em:

- `src/routes.ts`: registro de todas as rotas
- `src/controllers/`: orquestração HTTP
- `src/services/`: regras de negócio
- `src/midlewares/`: autenticação/autorização/validação
- `src/schemas/`: validação dos payloads via Zod
- `src/config/`: Cloudinary e Multer
- `prisma/schema.prisma`: modelagem do banco

## Funcionalidades implementadas

### Autenticação e usuários

- Cadastro de usuário
- Login com e-mail e senha
- Geração de JWT com expiração de 30 dias
- Consulta do perfil autenticado
- Perfis: `STAFF` e `ADMIN`

### Categorias

- Criação de categoria
- Listagem de categorias
- Listagem de produtos por categoria

### Produtos

- Criação de produto com upload de imagem
- Listagem de produtos por status `disabled`
- Listagem de produtos ativos por categoria
- Exclusão lógica de produto (`disabled: true`)

### Pedidos e itens

- Criação de pedido por mesa
- Listagem de pedidos por status de rascunho (`draft`)
- Inclusão de itens em um pedido
- Remoção de itens do pedido
- Detalhe de um pedido com itens e produtos
- Envio do pedido para cozinha (`draft: false`)
- Finalização do pedido (`status: true`)
- Exclusão de pedido

## Estrutura principal

```text
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   ├── cloudinary.ts
│   │   └── multer.ts
│   ├── controllers/
│   │   ├── category/
│   │   ├── order/
│   │   ├── product/
│   │   └── user/
│   ├── midlewares/
│   │   ├── isAdmin.ts
│   │   ├── isAuthenticated.ts
│   │   └── validateSchema.ts
│   ├── prisma/
│   │   └── index.ts
│   ├── routes.ts
│   ├── schemas/
│   │   ├── createCategorySchema.ts
│   │   ├── createOrderSchema.ts
│   │   ├── productSchema.ts
│   │   └── userSchema.ts
│   ├── services/
│   │   ├── category/
│   │   ├── order/
│   │   ├── product/
│   │   └── user/
│   └── server.ts
└── package.json
```

## Modelos do banco

### `User`

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(STAFF)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Campos:

- `id`: UUID
- `name`: nome do usuário
- `email`: e-mail único
- `password`: hash bcrypt
- `role`: `STAFF | ADMIN`
- `createdAt`: data de criação
- `updatedAt`: atualização automática

### `Category`

```prisma
model Category {
  id        String    @id @default(uuid())
  name      String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  products  Product[]
}
```

### `Product`

```prisma
model Product {
  id          String  @id @default(uuid())
  name        String
  price       Int
  description String
  banner      String
  disabled    Boolean @default(false)
  category_id String
  category    Category @relation(fields: [category_id], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- `price` é armazenado em centavos
- `disabled` indica soft delete / arquivamento
- `banner` salva a URL segura do Cloudinary

### `Order`

```prisma
model Order {
  id        String   @id @default(uuid())
  table     Int
  status    Boolean  @default(false)
  draft     Boolean  @default(true)
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  items     Item[]
}
```

- `status`: `false = pendente`, `true = pronto`
- `draft`: `true = rascunho`, `false = enviado para cozinha`

### `Item`

```prisma
model Item {
  id        String   @id @default(uuid())
  amount    Int
  order_id  String
  order     Order    @relation(fields: [order_id], references: [id], onDelete: Cascade)
  product_id String
  product   Product  @relation(fields: [product_id], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Auth e autorização

### `isAuthenticated`

Valida o cabeçalho:

```http
Authorization: Bearer <token>
```

Fluxo:

- lê `Authorization`
- separa o token
- usa `verify(token, JWT_SECRET)`
- grava `req.user_id` com o `sub` do JWT

### `isAdmin`

Verifica se o usuário autenticado tem `role === "ADMIN"`.

Se não tiver permissão, responde `401` com:

```json
{ "error": "Usuário sem permissão!" }
```

## Schemas Zod

### Usuário

```ts
createUserSchema = {
  body: {
    name: string (mínimo 3),
    email: e-mail válido,
    password: string (mínimo 6)
  }
}
```

### Sessão

```ts
authUserSchema = {
  body: {
    email: e-mail válido,
    password: string (obrigatório)
  }
}
```

### Categoria

```ts
createCategorySchema = {
  body: {
    name: string (mínimo 2)
  }
}
```

### Produto

```ts
createProductSchema = {
  body: {
    name: string,
    price: string,
    description: string,
    category_id: string
  }
}
```

### Pedido

```ts
createOrderSchema = {
  body: {
    table: number inteiro e positivo,
    name?: string
  }
}
```

### Itens e consulta

```ts
addItemSchema = {
  body: {
    order_id: string,
    amount: number inteiro positivo,
    product_id: string
  }
}
```

```ts
removeItemSchema = {
  query: { item_id: string }
}
```

```ts
detailOrderSchema = {
  query: { order_id: string }
}
```

```ts
sendOrderSchema = {
  body: { order_id: string, name: string }
}
```

```ts
finishOrderSchema = {
  body: { order_id: string }
}
```

```ts
deleteOrderSchema = {
  query: { order_id: string }
}
```

## Serviços (`src/services`)

### Usuários

- `CreateUserService`: valida se o e-mail já existe, cria o usuário com hash de senha e retorna dados públicos
- `AuthUserService`: compara senha com bcrypt, gera e retorna JWT
- `DetailUserService`: busca o usuário autenticado pelo `user_id`

### Categorias

- `CreateCategoryService`: cria a categoria
- `ListCatgoryService`: lista categorias ordenadas por `createdAt` descendente

### Produtos

- `CreateProductService`: valida categoria, envia imagem ao Cloudinary, salva `banner` e cria registro do produto
- `ListProductService`: lista produtos filtrando por `disabled`
- `ListProductByCategoryService`: valida a categoria e busca produtos ativos da categoria
- `DeleteProductService`: faz soft delete via `disabled: true`

### Pedidos

- `CreateOrderService`: cria pedido para mesa
- `ListOrdersService`: lista pedidos com filtro de rascunho
- `AddItemOrderService`: valida pedido/produto e cria item no pedido
- `RemoveItemOrderService`: remove item do pedido
- `DetailOrderService`: retorna detalhes do pedido e itens com dados do produto
- `SendOrderService`: define `draft=false` e atualiza nome do cliente
- `FinishOrderService`: define `status=true`
- `DeleteOrderService`: remove o pedido e seus itens via cascade

## Lista completa de endpoints

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `POST` | `/users` | Pública | Cria usuário |
| `POST` | `/session` | Pública | Login |
| `GET` | `/me` | JWT | Dados do usuário logado |
| `POST` | `/category` | JWT + ADMIN | Cria categoria |
| `GET` | `/category` | JWT | Lista categorias |
| `GET` | `/category/product` | JWT | Lista produtos da categoria |
| `POST` | `/product` | JWT + ADMIN | Cria produto com upload |
| `GET` | `/products` | JWT | Lista produtos |
| `DELETE` | `/product` | JWT + ADMIN | Soft delete do produto |
| `POST` | `/order` | JWT | Cria pedido |
| `GET` | `/orders` | JWT | Lista pedidos |
| `POST` | `/order/add` | JWT | Adiciona item ao pedido |
| `DELETE` | `/order/remove` | JWT | Remove item |
| `GET` | `/order/detail` | JWT | Detalha pedido |
| `PUT` | `/order/send` | JWT | Envia pedido para cozinha |
| `PUT` | `/order/finish` | JWT | Marca pedido como pronto |
| `DELETE` | `/order` | JWT | Remove pedido |

## Endpoints detalhados

### 1) `POST /users`

Body:

```json
{
  "name": "Maria da Silva",
  "email": "maria@teste.com",
  "password": "123456"
}
```

Resposta 200:

```json
{
  "id": "4bb6d29a-4ab9-47d6-9e6c-1e4cf88d834e",
  "name": "Maria da Silva",
  "email": "maria@teste.com",
  "role": "STAFF",
  "createdAt": "2026-08-16T19:32:36.000Z"
}
```

### 2) `POST /session`

Body:

```json
{
  "email": "maria@teste.com",
  "password": "123456"
}
```

Resposta 200:

```json
{
  "id": "4bb6d29a-4ab9-47d6-9e6c-1e4cf88d834e",
  "name": "Maria da Silva",
  "email": "maria@teste.com",
  "role": "STAFF",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3) `GET /me`

Headers:

```http
Authorization: Bearer <jwt>
```

Resposta 200:

```json
{
  "id": "4bb6d29a-4ab9-47d6-9e6c-1e4cf88d834e",
  "name": "Maria da Silva",
  "email": "maria@teste.com",
  "role": "STAFF",
  "createdAt": "2026-08-16T19:32:36.000Z"
}
```

### 4) `POST /category`

Headers:

```http
Authorization: Bearer <jwt>
```

Body:

```json
{
  "name": "Pizzas tradicionais"
}
```

Resposta 201:

```json
{
  "id": "d58c8b9a-7d34-44a8-bd7a-4b1d4d5d17ef",
  "name": "Pizzas tradicionais",
  "createdAt": "2026-08-16T19:32:36.000Z"
}
```

### 5) `GET /category`

Headers:

```http
Authorization: Bearer <jwt>
```

Resposta 200:

```json
[
  {
    "id": "d58c8b9a-7d34-44a8-bd7a-4b1d4d5d17ef",
    "name": "Pizzas tradicionais",
    "createdAt": "2026-08-16T19:32:36.000Z"
  }
]
```

### 6) `GET /category/product?category_id=<uuid>`

Headers:

```http
Authorization: Bearer <jwt>
```

Query string:

```text
category_id=8d7b6e1e-2fd8-4f6e-af56-5d7093b7c7e8
```

Resposta 200:

```json
[
  {
    "id": "0d36d4d1-8d88-41b3-945a-11e32922bd09",
    "name": "Pizza Margherita",
    "price": 4500,
    "description": "Molho, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/pizza.jpg",
    "disabled": false,
    "category_id": "8d7b6e1e-2fd8-4f6e-af56-5d7093b7c7e8",
    "createdAt": "2026-08-16T19:32:36.000Z",
    "category": {
      "id": "8d7b6e1e-2fd8-4f6e-af56-5d7093b7c7e8",
      "name": "Pizzas tradicionais"
    }
  }
]
```

### 7) `POST /product`

Headers:

```http
Authorization: Bearer <jwt>
```

Form-data:

```text
name: Pizza Margherita
price: 4500
description: Molho, mussarela e manjericão
category_id: 8d7b6e1e-2fd8-4f6e-af56-5d7093b7c7e8
file: pizza.jpg
```

Resposta 200:

```json
{
  "id": "0d36d4d1-8d88-41b3-945a-11e32922bd09",
  "name": "Pizza Margherita",
  "price": 4500,
  "description": "Molho, mussarela e manjericão",
  "category_id": "8d7b6e1e-2fd8-4f6e-af56-5d7093b7c7e8",
  "banner": "https://res.cloudinary.com/.../products/pizza.jpg",
  "createdAt": "2026-08-16T19:32:36.000Z"
}
```

### 8) `GET /products?disabled=false`

Headers:

```http
Authorization: Bearer <jwt>
```

Query:

```text
disabled=false
```

Resposta 200:

```json
[
  {
    "id": "0d36d4d1-8d88-41b3-945a-11e32922bd09",
    "name": "Pizza Margherita",
    "price": 4500,
    "description": "Molho, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/pizza.jpg",
    "disabled": false,
    "category_id": "8d7b6e1e-2fd8-4f6e-af56-5d7093b7c7e8",
    "createdAt": "2026-08-16T19:32:36.000Z",
    "category": {
      "id": "8d7b6e1e-2fd8-4f6e-af56-5d7093b7c7e8",
      "name": "Pizzas tradicionais"
    }
  }
]
```

### 9) `DELETE /product?product_id=<uuid>`

Headers:

```http
Authorization: Bearer <jwt>
```

Query:

```text
product_id=0d36d4d1-8d88-41b3-945a-11e32922bd09
```

Resposta 200:

```json
{
  "message": "Produto deletado/arquivado com sucesso!"
}
```

### 10) `POST /order`

Headers:

```http
Authorization: Bearer <jwt>
```

Body:

```json
{
  "table": 5,
  "name": "João"
}
```

Resposta 201:

```json
{
  "id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb",
  "table": 5,
  "name": "João",
  "status": false,
  "draft": true,
  "createdAt": "2026-08-16T19:32:36.000Z"
}
```

### 11) `GET /orders?draft=true|false`

Headers:

```http
Authorization: Bearer <jwt>
```

Query:

```text
draft=false
```

Resposta 200:

```json
[
  {
    "id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb",
    "table": 5,
    "name": "João",
    "draft": false,
    "status": false,
    "createdAt": "2026-08-16T19:32:36.000Z",
    "items": [
      {
        "id": "9f5d7269-8d34-48fa-9a7f-3d11f0c3d1ee",
        "amount": 2,
        "product": {
          "id": "0d36d4d1-8d88-41b3-945a-11e32922bd09",
          "name": "Pizza Margherita",
          "price": 4500,
          "description": "Molho, mussarela e manjericão",
          "banner": "https://res.cloudinary.com/.../products/pizza.jpg"
        }
      }
    ]
  }
]
```

### 12) `POST /order/add`

Headers:

```http
Authorization: Bearer <jwt>
```

Body:

```json
{
  "order_id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb",
  "product_id": "0d36d4d1-8d88-41b3-945a-11e32922bd09",
  "amount": 2
}
```

Resposta 201:

```json
{
  "id": "9f5d7269-8d34-48fa-9a7f-3d11f0c3d1ee",
  "amount": 2,
  "order_id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb",
  "product_id": "0d36d4d1-8d88-41b3-945a-11e32922bd09",
  "createdAt": "2026-08-16T19:32:36.000Z",
  "product": {
    "id": "0d36d4d1-8d88-41b3-945a-11e32922bd09",
    "name": "Pizza Margherita",
    "price": 4500,
    "description": "Molho, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/pizza.jpg"
  }
}
```

### 13) `DELETE /order/remove?item_id=<uuid>`

Headers:

```http
Authorization: Bearer <jwt>
```

Query:

```text
item_id=9f5d7269-8d34-48fa-9a7f-3d11f0c3d1ee
```

Resposta 200:

```json
{
  "message": "item removido com sucesso"
}
```

### 14) `GET /order/detail?order_id=<uuid>`

Headers:

```http
Authorization: Bearer <jwt>
```

Query:

```text
order_id=f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb
```

Resposta 200:

```json
{
  "id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb",
  "table": 5,
  "name": "João",
  "draft": true,
  "status": false,
  "createdAt": "2026-08-16T19:32:36.000Z",
  "updatedAt": "2026-08-16T19:32:36.000Z",
  "items": [
    {
      "id": "9f5d7269-8d34-48fa-9a7f-3d11f0c3d1ee",
      "amount": 2,
      "createdAt": "2026-08-16T19:32:36.000Z",
      "product": {
        "id": "0d36d4d1-8d88-41b3-945a-11e32922bd09",
        "name": "Pizza Margherita",
        "price": 4500,
        "description": "Molho, mussarela e manjericão",
        "banner": "https://res.cloudinary.com/.../products/pizza.jpg"
      }
    }
  ]
}
```

### 15) `PUT /order/send`

Headers:

```http
Authorization: Bearer <jwt>
```

Body:

```json
{
  "order_id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb",
  "name": "João"
}
```

Resposta 200:

```json
{
  "id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb",
  "name": "João",
  "table": 5,
  "draft": false,
  "status": false,
  "createdAt": "2026-08-16T19:32:36.000Z"
}
```

### 16) `PUT /order/finish`

Headers:

```http
Authorization: Bearer <jwt>
```

Body:

```json
{
  "order_id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb"
}
```

Resposta 200:

```json
{
  "id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb",
  "name": "João",
  "table": 5,
  "draft": false,
  "status": true,
  "createdAt": "2026-08-16T19:32:36.000Z"
}
```

### 17) `DELETE /order?order_id=<uuid>`

Headers:

```http
Authorization: Bearer <jwt>
```

Query:

```text
order_id=f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb
```

Resposta 200:

```json
{
  "message": "Order excluída com sucesso!"
}
```

## Respostas padrão de erro

### Erro de validação Zod

```json
{
  "error": "Erro validação",
  "details": [
    { "message": "O nome precisa ter no mínimo 3 caracteres" }
  ]
}
```

### Erro de autenticação

```json
{
  "error": "Token inválido"
}
```

### Erro de autorização

```json
{
  "error": "Usuário sem permissão!"
}
```

### Erro genérico de service/controller

```json
{
  "error": "Categoria não encontrada!"
}
```

## Observações finais

- Todos os endpoints são montados diretamente na raiz da API.
- As rotas de usuário e login são públicas.
- A maioria das operações de gestão exige autenticação JWT.
- Criação de produto exige upload em `multipart/form-data` com campo `file`.
- Produto é considerado removido logicamente por `disabled=true`, não por remoção física.
- Pedido segue um fluxo de criação -> adição de itens -> envio -> conclusão.

A API está em desenvolvimento e já cobre os fluxos essenciais de operação da pizzaria: autenticação, categorias, produtos, pedidos e itens.
