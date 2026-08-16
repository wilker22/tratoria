# ENDPOINTS.md

Este documento reúne todos os endpoints da API REST do projeto Pizzaria, com propriedades esperadas, autenticação, exemplos de payload e exemplos de resposta.

## Informações gerais

- Base URL: `http://localhost:3333`
- Prefixo global: nenhum
- Autenticação: JWT via `Authorization: Bearer <token>`
- Upload: `multipart/form-data` para criação de produto
- Status padrão para sucesso: `200` ou `201`

## Sumário de rotas

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| `POST` | `/users` | Pública | Cria usuário |
| `POST` | `/session` | Pública | Faz login |
| `GET` | `/me` | JWT | Retorna dados do usuário autenticado |
| `POST` | `/category` | JWT + ADMIN | Cria categoria |
| `GET` | `/category` | JWT | Lista categorias |
| `GET` | `/category/product` | JWT | Lista produtos por categoria |
| `POST` | `/product` | JWT + ADMIN | Cria produto com imagem |
| `GET` | `/products` | JWT | Lista produtos |
| `DELETE` | `/product` | JWT + ADMIN | Soft delete do produto |
| `POST` | `/order` | JWT | Cria pedido |
| `GET` | `/orders` | JWT | Lista pedidos |
| `POST` | `/order/add` | JWT | Adiciona item ao pedido |
| `DELETE` | `/order/remove` | JWT | Remove item do pedido |
| `GET` | `/order/detail` | JWT | Detalha pedido |
| `PUT` | `/order/send` | JWT | Envia pedido para cozinha |
| `PUT` | `/order/finish` | JWT | Marca pedido como pronto |
| `DELETE` | `/order` | JWT | Remove pedido |

## 1) POST /users

Cria um novo usuário.

### Body

```json
{
  "name": "Maria da Silva",
  "email": "maria@teste.com",
  "password": "123456"
}
```

### Validações

- `name`: string, mínimo 3 caracteres
- `email`: e-mail válido
- `password`: string, mínimo 6 caracteres

### Exemplo de resposta

```json
{
  "id": "4bb6d29a-4ab9-47d6-9e6c-1e4cf88d834e",
  "name": "Maria da Silva",
  "email": "maria@teste.com",
  "role": "STAFF",
  "createdAt": "2026-08-16T19:32:36.000Z"
}
```

### Observações

- A senha é armazenada como hash com `bcryptjs`
- O usuário criado fica com `role: "STAFF"` por padrão

## 2) POST /session

Autentica o usuário e retorna um JWT.

### Body

```json
{
  "email": "maria@teste.com",
  "password": "123456"
}
```

### Exemplo de resposta

```json
{
  "id": "4bb6d29a-4ab9-47d6-9e6c-1e4cf88d834e",
  "name": "Maria da Silva",
  "email": "maria@teste.com",
  "role": "STAFF",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Observações

- O token expira em 30 dias
- O `sub` do token é o `id` do usuário

## 3) GET /me

Retorna os dados do usuário autenticado.

### Headers

```http
Authorization: Bearer <token>
```

### Exemplo de resposta

```json
{
  "id": "4bb6d29a-4ab9-47d6-9e6c-1e4cf88d834e",
  "name": "Maria da Silva",
  "email": "maria@teste.com",
  "role": "STAFF",
  "createdAt": "2026-08-16T19:32:36.000Z"
}
```

## 4) POST /category

Cria uma nova categoria.

### Headers

```http
Authorization: Bearer <token>
```

### Body

```json
{
  "name": "Pizzas tradicionais"
}
```

### Regras

- Usuário autenticado
- Usuário precisa ter `role === "ADMIN"`
- `name` mínimo de 2 caracteres

### Exemplo de resposta

```json
{
  "id": "d58c8b9a-7d34-44a8-bd7a-4b1d4d5d17ef",
  "name": "Pizzas tradicionais",
  "createdAt": "2026-08-16T19:32:36.000Z"
}
```

## 5) GET /category

Lista todas as categorias.

### Headers

```http
Authorization: Bearer <token>
```

### Exemplo de resposta

```json
[
  {
    "id": "d58c8b9a-7d34-44a8-bd7a-4b1d4d5d17ef",
    "name": "Pizzas tradicionais",
    "createdAt": "2026-08-16T19:32:36.000Z"
  },
  {
    "id": "a4c4b5d1-6f75-4d3d-9f4b-60c933db0dcc",
    "name": "Bebidas",
    "createdAt": "2026-08-15T10:30:00.000Z"
  }
]
```

## 6) GET /category/product

Lista produtos ativos de uma categoria específica.

### Headers

```http
Authorization: Bearer <token>
```

### Query params

```text
category_id=<uuid-da-categoria>
```

### Exemplo de request

```http
GET /category/product?category_id=8d7b6e1e-2fd8-4f6e-af56-5d7093b7c7e8
Authorization: Bearer <token>
```

### Exemplo de resposta

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

## 7) POST /product

Cria um produto com upload de imagem.

### Headers

```http
Authorization: Bearer <token>
```

### Form-data

```text
name: Pizza Margherita
price: 4500
description: Molho, mussarela e manjericão
category_id: 8d7b6e1e-2fd8-4f6e-af56-5d7093b7c7e8
file: pizza.jpg
```

### Propriedades esperadas

- `name`: string
- `price`: string com valor numérico (convertido para `int`)
- `description`: string
- `category_id`: UUID da categoria existente
- `file`: imagem JPG/JPEG/PNG, até 4MB

### Exemplo de resposta

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

## 8) GET /products

Lista produtos com filtro por status `disabled`.

### Headers

```http
Authorization: Bearer <token>
```

### Query params

```text
disabled=true
```

ou

```text
disabled=false
```

### Exemplo de resposta

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

## 9) DELETE /product

Exclui logicamente um produto (`disabled: true`).

### Headers

```http
Authorization: Bearer <token>
```

### Query params

```text
product_id=<uuid-do-produto>
```

### Exemplo de resposta

```json
{
  "message": "Produto deletado/arquivado com sucesso!"
}
```

## 10) POST /order

Cria um pedido para uma mesa.

### Headers

```http
Authorization: Bearer <token>
```

### Body

```json
{
  "table": 5,
  "name": "João"
}
```

### Propriedades

- `table`: número inteiro positivo
- `name`: string opcional

### Exemplo de resposta

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

## 11) GET /orders

Lista pedidos, com filtro opcional de rascunho.

### Headers

```http
Authorization: Bearer <token>
```

### Query params

```text
draft=true
```

ou

```text
draft=false
```

### Exemplo de resposta

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

## 12) POST /order/add

Adiciona um item ao pedido.

### Headers

```http
Authorization: Bearer <token>
```

### Body

```json
{
  "order_id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb",
  "product_id": "0d36d4d1-8d88-41b3-945a-11e32922bd09",
  "amount": 2
}
```

### Propriedades

- `order_id`: UUID do pedido
- `product_id`: UUID do produto
- `amount`: inteiro positivo

### Exemplo de resposta

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

## 13) DELETE /order/remove

Remove um item do pedido.

### Headers

```http
Authorization: Bearer <token>
```

### Query params

```text
item_id=<uuid-do-item>
```

### Exemplo de resposta

```json
{
  "message": "item removido com sucesso"
}
```

## 14) GET /order/detail

Retorna os detalhes do pedido incluindo itens e produtos.

### Headers

```http
Authorization: Bearer <token>
```

### Query params

```text
order_id=<uuid-do-pedido>
```

### Exemplo de resposta

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

## 15) PUT /order/send

Envia o pedido para cozinha, definindo `draft: false`.

### Headers

```http
Authorization: Bearer <token>
```

### Body

```json
{
  "order_id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb",
  "name": "João"
}
```

### Exemplo de resposta

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

## 16) PUT /order/finish

Marca o pedido como pronto.

### Headers

```http
Authorization: Bearer <token>
```

### Body

```json
{
  "order_id": "f6b5ef44-8a0a-48e0-8d52-8a266d0a9dcb"
}
```

### Exemplo de resposta

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

## 17) DELETE /order

Exclui um pedido.

### Headers

```http
Authorization: Bearer <token>
```

### Query params

```text
order_id=<uuid-do-pedido>
```

### Exemplo de resposta

```json
{
  "message": "Order excluída com sucesso!"
}
```

## Códigos de erro comuns

### 400 - validação ou regra de negócio falhou

```json
{
  "error": "Categoria não encontrada!"
}
```

### 401 - token ausente ou inválido

```json
{
  "error": "Token inválido"
}
```

### 401 - usuário sem permissão administrativa

```json
{
  "error": "Usuário sem permissão!"
}
```

## Observações finais

- O código usa o padrão `async/await` junto ao Prisma Client
- A criação de produto depende de upload de imagem em `multipart/form-data`
- O produto é arquivado com `disabled: true` em vez de ser removido do banco
- O pedido passa por `draft` (rascunho) e `status` (pronto) ao longo do ciclo de operação
