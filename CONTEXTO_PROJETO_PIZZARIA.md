# Contexto Técnico do Projeto Pizzaria

## 1. Identificação do projeto

- **Nome declarado no backend:** `backend`
- **Versão do backend:** `1.0.0`
- **Nome apresentado no README:** `PROJETO TRATORIA`
- **Tipo:** API REST para gerenciamento de uma pizzaria/tratoria
- **Estado atual:** backend em desenvolvimento, com usuários, autenticação, categorias (criação e listagem) e produtos (criação com upload de imagem, listagem geral, listagem por categoria e exclusão lógica) implementados
- **Linguagem:** TypeScript
- **Runtime:** Node.js
- **Banco de dados:** PostgreSQL
- **ORM:** Prisma ORM 7 com driver adapter `@prisma/adapter-pg`
- **Armazenamento de imagens:** Cloudinary (upload via Multer em memória)

O ZIP analisado não contém uma aplicação frontend funcional. Na raiz existe apenas um `package.json` com `bcryptjs`; a implementação efetiva está em `backend/`.

## 2. Arquitetura

O projeto utiliza uma arquitetura em camadas, organizada por responsabilidade:

```mermaid
flowchart TD
    A[Cliente HTTP] --> B[Rotas Express]
    B --> C[Middlewares]
    C --> D[Controllers]
    D --> E[Services]
    E --> F[Prisma Client]
    F --> G[(PostgreSQL)]
    E --> H[Cloudinary]
    H --> E
    E --> D
    D --> A
```

### Fluxo de uma requisição

1. **Rotas:** recebem a requisição e definem quais middlewares e controller serão executados.
2. **Middlewares:** validam o schema, autenticam o token, verificam perfil administrativo e, quando necessário, processam upload de arquivo via Multer.
3. **Controllers:** extraem dados de `body`, `query`, `params` ou `file` do objeto `Request`, chamam o service correspondente e definem a resposta HTTP.
4. **Services:** concentram a regra de negócio, consultam ou alteram o banco pelo Prisma, integram com serviços externos (Cloudinary) e devolvem o resultado ao controller.
5. **Prisma/PostgreSQL:** realizam a persistência e a recuperação dos dados.
6. **Tratamento global de erros:** erros lançados pelas camadas seguintes chegam ao middleware final de erro em `server.ts`.

### Exemplo real: criação de categoria

`POST /category` → `isAuthenticated` → `isAdmin` → `validateSchema(createCategorySchema)` → `CreateCategoryController` → `CreateCategoryService` → `prismaClient.category.create()` → PostgreSQL.

### Exemplo real: criação de produto com imagem

`POST /product` → `isAuthenticated` → `isAdmin` → `upload.single('file')` → `validateSchema(createProductSchema)` → `CreateProductController` → `CreateProductService` → upload para Cloudinary (pasta `products`) → `prismaClient.product.create()` → PostgreSQL.

O campo `banner` do produto armazena a URL segura (`secure_url`) retornada pelo Cloudinary, e não o arquivo em si.

### Exemplo real: listar produtos por categoria

`GET /category/product` → `isAuthenticated` → `validateSchema(listProductByCategorySchema)` → `ListProductByCategoryController` → `ListProductByCategoryService` → verifica existência da categoria → `prismaClient.product.findMany()` (apenas `disabled: false`) → PostgreSQL.

## 3. Tecnologias e versões

As versões abaixo são as versões exatas resolvidas no `backend/package-lock.json`, e não apenas os intervalos declarados no `package.json`.

### Dependências de execução

| Biblioteca | Versão | Finalidade |
|---|---:|---|
| `@prisma/adapter-pg` | 7.9.1 | Adaptador PostgreSQL utilizado pelo Prisma 7 |
| `@prisma/client` | 7.9.1 | Cliente ORM gerado para acesso ao banco |
| `bcryptjs` | 3.0.3 | Hash e comparação de senhas |
| `cloudinary` | 2.10.0 | Upload e hospedagem de imagens de produtos |
| `cors` | 2.8.6 | Liberação de requisições entre origens |
| `dotenv` | 17.4.2 | Carregamento de variáveis do arquivo `.env` |
| `express` | 5.2.1 | Framework HTTP e roteamento |
| `jsonwebtoken` | 9.0.3 | Geração e validação de tokens JWT |
| `multer` | 2.2.0 | Recepção de arquivos multipart/form-data |
| `pg` | 8.22.0 | Driver PostgreSQL |
| `tsx` | 4.23.1 | Execução e recarga de TypeScript em desenvolvimento |
| `zod` | 4.4.3 | Validação dos dados das requisições |

### Dependências de desenvolvimento

| Biblioteca | Versão |
|---|---:|
| `prisma` | 7.9.1 |
| `typescript` | 7.0.2 |
| `@types/cors` | 2.8.19 |
| `@types/express` | 5.0.6 |
| `@types/jsonwebtoken` | 9.0.10 |
| `@types/multer` | 2.2.0 |
| `@types/node` | 26.1.2 |
| `@types/pg` | 8.20.3 |

### Configuração TypeScript

- Target: `ES2020`
- Módulos: `CommonJS`
- Resolução: `node`
- Código-fonte: `src/`
- Saída prevista: `dist/`
- Modo estrito: ativado
- Source maps: ativados
- Testes `*.spec.ts` e `*.test.ts`: excluídos da compilação

O projeto não fixa uma versão do Node.js por `engines`, `.nvmrc` ou `.node-version`. Portanto, não é possível declarar uma versão oficial do runtime apenas pelo repositório.

## 4. Organização das pastas

```text
pizzaria/
├── README.md
├── package.json
├── CONTEXTO_PROJETO_PIZZARIA.md
└── backend/
    ├── package.json
    ├── package-lock.json
    ├── prisma.config.ts
    ├── tsconfig.json
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    │       └── 20260802172104_create_tables/
    │           └── migration.sql
    └── src/
        ├── @types/express/index.d.ts
        ├── config/
        │   ├── cloudinary.ts
        │   └── multer.ts
        ├── controllers/
        │   ├── category/
        │   │   ├── CreateCategoryController.ts
        │   │   └── ListCategoryController.ts
        │   ├── product/
        │   │   ├── CreateProductController.ts
        │   │   ├── DeleteProductController.ts
        │   │   ├── ListProductByCategoryController.ts
        │   │   └── ListProductsController.ts
        │   └── user/
        │       ├── AuthUserController.ts
        │       ├── CreateUserController.ts
        │       └── DetailUserController.ts
        ├── generated/prisma/
        ├── midlewares/
        │   ├── isAdmin.ts
        │   ├── isAuthenticated.ts
        │   └── validateSchema.ts
        ├── prisma/index.ts
        ├── schemas/
        │   ├── createCategorySchema.ts
        │   ├── productSchema.ts
        │   └── userSchema.ts
        ├── services/
        │   ├── category/
        │   │   ├── CreateCategoryService.ts
        │   │   └── ListCatgoryService.ts
        │   ├── product/
        │   │   ├── CreateProductService.ts
        │   │   ├── DeleteProductService.ts
        │   │   ├── ListProductByCategoryServvice.ts
        │   │   └── LIstProductService.ts
        │   └── user/
        │       ├── AuthUserService.ts
        │       ├── CreateUserService.ts
        │       └── DetailUserService.ts
        ├── routes.ts
        └── server.ts
```

### Responsabilidades

| Pasta/arquivo | Responsabilidade |
|---|---|
| `src/server.ts` | Inicialização do Express, JSON, CORS, rotas, tratamento de erros e porta HTTP |
| `src/routes.ts` | Registro central dos endpoints, Multer e cadeia de middlewares |
| `src/config/cloudinary.ts` | Configuração do SDK Cloudinary com variáveis de ambiente |
| `src/config/multer.ts` | Configuração de upload em memória, limite de 4 MB e filtro de MIME types |
| `src/controllers/` | Adaptação entre HTTP e os casos de uso |
| `src/services/` | Regras de negócio, operações pelo Prisma e integração com Cloudinary |
| `src/midlewares/` | Validação, autenticação e autorização |
| `src/schemas/` | Schemas Zod das requisições |
| `src/prisma/index.ts` | Inicialização do Prisma Client com `PrismaPg` |
| `src/generated/prisma/` | Código gerado automaticamente pelo Prisma; não deve ser editado manualmente |
| `prisma/schema.prisma` | Modelagem declarativa do banco |
| `prisma/migrations/` | Histórico SQL da estrutura do banco |
| `src/@types/express/` | Extensão do tipo `Express.Request` com `user_id` |

Observação: a pasta está escrita como `midlewares`; a grafia convencional seria `middlewares`. Há typos em nomes de arquivos: `ListCatgoryService.ts` (`Catgory`), `LIstProductService.ts` (`LIst`) e `ListProductByCategoryServvice.ts` (`Servvice`).

## 5. Inicialização e configuração HTTP

O arquivo `src/server.ts` executa a seguinte configuração:

- carrega variáveis de ambiente com `dotenv/config`;
- cria a aplicação Express;
- habilita parsing de JSON com `express.json()`;
- habilita CORS sem restrição explícita de origem;
- registra o router central;
- registra o middleware global de erros;
- inicia o servidor na variável `PORT` ou, na ausência dela, na porta `3333`.

Não existe prefixo global como `/api` ou `/v1`. Assim, os caminhos documentados abaixo são registrados diretamente na raiz.

## 6. Endpoints implementados

| Método | Endpoint | Acesso | Validação / Upload | Controller | Resposta de sucesso |
|---|---|---|---|---|---|
| `POST` | `/users` | Público | `createUserSchema` | `CreateUserController` | Usuário criado, sem senha; HTTP `200` |
| `POST` | `/session` | Público | `authUserSchema` | `AuthUserController` | Dados do usuário e token JWT; HTTP `200` |
| `GET` | `/me` | JWT | Não possui schema | `DetailUserController` | Dados do usuário autenticado; HTTP `200` |
| `POST` | `/category` | JWT + perfil `ADMIN` | `createCategorySchema` | `CreateCategoryController` | Categoria criada; HTTP `201` |
| `GET` | `/category` | JWT | Não possui schema | `ListCategoryController` | Lista de categorias; HTTP `200` |
| `GET` | `/category/product` | JWT | `listProductByCategorySchema` (query) | `ListProductByCategoryController` | Produtos ativos de uma categoria; HTTP `200` |
| `POST` | `/product` | JWT + perfil `ADMIN` | Multer (`file`) + `createProductSchema` | `CreateProductController` | Produto criado com URL do banner; HTTP `200` |
| `GET` | `/products` | JWT | `listProductSchema` (query) | `ListProductsController` | Lista de produtos; HTTP `200` |
| `DELETE` | `/product` | JWT + perfil `ADMIN` | Não possui schema | `DeleteProductController` | Produto arquivado (soft delete); HTTP `200` |

### 6.1. Criar usuário

**Requisição**

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Nome do usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Regras**

- `name`: texto com no mínimo 3 caracteres;
- `email`: endereço de e-mail válido e único no banco;
- `password`: texto com no mínimo 6 caracteres;
- a senha é armazenada como hash bcrypt, com custo `8`;
- novos usuários recebem o perfil `STAFF` por padrão.

**Resposta**

```json
{
  "id": "uuid",
  "name": "Nome do usuário",
  "email": "usuario@exemplo.com",
  "role": "STAFF",
  "createdAt": "data-hora"
}
```

### 6.2. Autenticar usuário

**Requisição**

```http
POST /session
Content-Type: application/json
```

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

O service busca o usuário pelo e-mail, compara a senha com bcrypt e gera um JWT assinado com `JWT_SECRET`. O token contém `name` e `email`, utiliza o ID do usuário como `subject` (`sub`) e expira em `30d`.

**Resposta**

```json
{
  "id": "uuid",
  "name": "Nome do usuário",
  "email": "usuario@exemplo.com",
  "role": "STAFF",
  "token": "jwt"
}
```

### 6.3. Consultar usuário autenticado

```http
GET /me
Authorization: Bearer TOKEN_JWT
```

O middleware valida o JWT, extrai o `sub` e grava o valor em `req.user_id`. O service consulta o usuário por esse ID.

### 6.4. Criar categoria

```http
POST /category
Authorization: Bearer TOKEN_JWT
Content-Type: application/json
```

```json
{
  "name": "Pizzas tradicionais"
}
```

**Regras**

- usuário autenticado;
- usuário existente no banco;
- perfil obrigatoriamente `ADMIN`;
- `name` deve ser texto com no mínimo 2 caracteres.

**Resposta HTTP 201**

```json
{
  "id": "uuid",
  "name": "Pizzas tradicionais",
  "createdAt": "data-hora"
}
```

### 6.5. Listar categorias

```http
GET /category
Authorization: Bearer TOKEN_JWT
```

**Regras**

- usuário autenticado;
- retorna `id`, `name` e `createdAt` de cada categoria;
- ordenação decrescente por `createdAt`.

**Resposta HTTP 200**

```json
[
  {
    "id": "uuid",
    "name": "Pizzas tradicionais",
    "createdAt": "data-hora"
  }
]
```

### 6.6. Criar produto

```http
POST /product
Authorization: Bearer TOKEN_JWT
Content-Type: multipart/form-data
```

**Campos do formulário**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | Sim | Nome do produto |
| `price` | string | Sim | Preço em centavos (convertido para `int` no controller) |
| `description` | string | Sim | Descrição do produto |
| `category_id` | string (UUID) | Sim | ID de uma categoria existente |
| `file` | arquivo | Sim | Imagem do produto (JPG, JPEG ou PNG; máx. 4 MB) |

**Regras**

- usuário autenticado com perfil `ADMIN`;
- a categoria informada deve existir no banco;
- a imagem é enviada para o Cloudinary na pasta `products`;
- o campo `banner` no banco recebe a URL segura retornada pelo Cloudinary;
- produto criado com `disabled: false` por padrão.

**Resposta HTTP 200**

```json
{
  "id": "uuid",
  "name": "Pizza Margherita",
  "price": 4500,
  "description": "Molho, mussarela e manjericão",
  "category_id": "uuid-da-categoria",
  "banner": "https://res.cloudinary.com/.../products/....jpg",
  "createdAt": "data-hora"
}
```

### 6.7. Listar produtos

```http
GET /products?disabled=false
Authorization: Bearer TOKEN_JWT
```

**Parâmetros de query**

| Parâmetro | Tipo | Padrão | Descrição |
|---|---|---|---|
| `disabled` | `"true"` ou `"false"` | `"false"` | Filtra produtos ativos (`false`) ou arquivados (`true`) |

**Regras**

- usuário autenticado;
- retorna dados do produto incluindo a categoria relacionada (`id` e `name`);
- ordenação decrescente por `createdAt`.

**Resposta HTTP 200**

```json
[
  {
    "id": "uuid",
    "name": "Pizza Margherita",
    "price": 4500,
    "description": "Molho, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/....jpg",
    "disabled": false,
    "category_id": "uuid-da-categoria",
    "createdAt": "data-hora",
    "category": {
      "id": "uuid-da-categoria",
      "name": "Pizzas tradicionais"
    }
  }
]
```

### 6.8. Listar produtos por categoria

```http
GET /category/product?category_id=UUID_DA_CATEGORIA
Authorization: Bearer TOKEN_JWT
```

**Parâmetros de query**

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `category_id` | string (UUID) | Sim | ID da categoria cujos produtos serão listados |

**Regras**

- usuário autenticado;
- a categoria informada deve existir no banco; caso contrário, retorna erro `"Categoria não encontrada!"`;
- retorna apenas produtos ativos (`disabled: false`); não há parâmetro para incluir produtos arquivados;
- retorna dados do produto incluindo a categoria relacionada (`id` e `name`);
- ordenação decrescente por `createdAt`.

**Resposta HTTP 200**

```json
[
  {
    "id": "uuid",
    "name": "Pizza Margherita",
    "price": 4500,
    "description": "Molho, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/....jpg",
    "disabled": false,
    "category_id": "uuid-da-categoria",
    "createdAt": "data-hora",
    "category": {
      "id": "uuid-da-categoria",
      "name": "Pizzas tradicionais"
    }
  }
]
```

### 6.9. Excluir produto (soft delete)

```http
DELETE /product?product_id=UUID_DO_PRODUTO
Authorization: Bearer TOKEN_JWT
```

**Regras**

- usuário autenticado com perfil `ADMIN`;
- não remove o registro do banco; define `disabled: true`;
- o produto deixa de aparecer na listagem padrão (`disabled=false`).

**Resposta HTTP 200**

```json
{
  "message": "Produto deletado/arquivado com sucesso!"
}
```

## 7. Autenticação e autorização

### Autenticação

O middleware `isAuthenticated` espera o cabeçalho:

```http
Authorization: Bearer TOKEN_JWT
```

Ele separa o token pelo espaço, valida sua assinatura com `JWT_SECRET`, recupera `sub` e o disponibiliza como `req.user_id`. A tipagem é adicionada em `src/@types/express/index.d.ts`.

### Autorização administrativa

O middleware `isAdmin` usa `req.user_id` para consultar o usuário no banco e permite a continuação somente quando `role === "ADMIN"`.

Perfis existentes:

- `STAFF`: padrão para novos usuários; pode listar categorias e produtos;
- `ADMIN`: autorizado a criar categorias e produtos, e arquivar produtos.

Não existe endpoint implementado para promover um usuário a `ADMIN`; essa alteração precisa ocorrer diretamente no banco, por seed, Prisma Studio ou futura funcionalidade administrativa.

## 8. Upload de imagens

### Multer (`src/config/multer.ts`)

- **Storage:** `memoryStorage()` — o arquivo fica em `req.file.buffer` para envio direto ao Cloudinary;
- **Limite de tamanho:** 4 MB;
- **Formatos aceitos:** `image/jpeg`, `image/jpg`, `image/png`;
- **Campo do formulário:** `file` (configurado em `upload.single('file')` na rota).

### Cloudinary (`src/config/cloudinary.ts`)

Configurado com três variáveis de ambiente:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

No `CreateProductService`, o upload usa `cloudinary.uploader.upload_stream` com:

- pasta destino: `products`;
- `resource_type`: `image`;
- `public_id`: timestamp + nome do arquivo (sem extensão).

A URL retornada (`secure_url`) é persistida no campo `banner` do produto.

## 9. Validação dos schemas

O projeto usa **Zod 4.4.3**. O middleware genérico `validateSchema` monta o objeto abaixo e executa `schema.parseAsync()`:

```ts
{
  body: req.body,
  query: req.query,
  params: req.params
}
```

Quando o Zod rejeita os dados, a API responde HTTP `400`:

```json
{
  "error": "Erro validação",
  "details": [
    { "message": "mensagem da regra violada" }
  ]
}
```

O middleware valida, mas **não reatribui** os valores parseados de volta a `req.body` ou `req.query`. Transformações definidas nos schemas (como a de `listProductSchema`) não afetam automaticamente o que o controller lê.

### Schemas atuais

| Schema | Campo | Regra |
|---|---|---|
| `createUserSchema` | `body.name` | string, mínimo 3 caracteres |
| `createUserSchema` | `body.email` | e-mail válido |
| `createUserSchema` | `body.password` | string, mínimo 6 caracteres |
| `authUserSchema` | `body.email` | e-mail válido |
| `authUserSchema` | `body.password` | string, mínimo 1 caractere |
| `createCategorySchema` | `body.name` | string, mínimo 2 caracteres |
| `createProductSchema` | `body.name` | string, mínimo 1 caractere |
| `createProductSchema` | `body.price` | string, mínimo 1 caractere |
| `createProductSchema` | `body.description` | string, mínimo 1 caractere |
| `createProductSchema` | `body.category_id` | string (UUID da categoria) |
| `listProductSchema` | `query.disabled` | enum `"true"` \| `"false"`, opcional, padrão `"false"` |
| `listProductByCategorySchema` | `query.category_id` | string obrigatória (UUID da categoria) |

A validação da presença do arquivo de imagem ocorre no `CreateProductController` (`req.file`), e não via Zod.

## 10. Banco de dados e Prisma

### Conexão

O Prisma 7 recebe a URL do PostgreSQL pelo `prisma.config.ts`. Em tempo de execução, `src/prisma/index.ts` cria um `PrismaPg` com `DATABASE_URL` e o fornece ao `PrismaClient` gerado.

```text
DATABASE_URL → PrismaPg → PrismaClient → PostgreSQL
```

O generator utilizado é `prisma-client`, com saída em `src/generated/prisma`.

### Modelo relacional

```mermaid
erDiagram
    CATEGORY ||--o{ PRODUCT : possui
    PRODUCT ||--o{ ITEM : compoe
    ORDER ||--o{ ITEM : contem

    USER {
        string id PK
        string name
        string email UK
        string password
        Role role
        datetime createdAt
        datetime updatedAt
    }
    CATEGORY {
        string id PK
        string name
        datetime createdAt
        datetime updatedAt
    }
    PRODUCT {
        string id PK
        string name
        int price
        string description
        string banner
        boolean disabled
        string category_id FK
        datetime createdAt
        datetime updatedAt
    }
    ORDER {
        string id PK
        int table
        boolean status
        boolean draft
        string name
        datetime createdAt
        datetime updatedAt
    }
    ITEM {
        string id PK
        int amount
        string order_id FK
        string product_id FK
        datetime createdAt
        datetime updatedAt
    }
```

### 10.1. User → tabela `users`

| Campo | Tipo | Restrições/padrão |
|---|---|---|
| `id` | String/UUID | chave primária, UUID automático |
| `name` | String | obrigatório |
| `email` | String | obrigatório, único |
| `password` | String | obrigatório, armazena hash |
| `role` | Enum `Role` | `STAFF` por padrão; aceita `STAFF` ou `ADMIN` |
| `createdAt` | DateTime | data atual por padrão |
| `updatedAt` | DateTime | atualizado automaticamente pelo Prisma |

### 10.2. Category → tabela `categories`

| Campo | Tipo | Restrições/padrão |
|---|---|---|
| `id` | String/UUID | chave primária, UUID automático |
| `name` | String | obrigatório |
| `createdAt` | DateTime | data atual por padrão |
| `updatedAt` | DateTime | atualizado automaticamente |
| `products` | Relação | uma categoria possui vários produtos |

### 10.3. Product → tabela `products`

| Campo | Tipo | Restrições/padrão |
|---|---|---|
| `id` | String/UUID | chave primária, UUID automático |
| `name` | String | obrigatório |
| `price` | Int | obrigatório; valor armazenado em centavos |
| `description` | String | obrigatório |
| `banner` | String | obrigatório; URL da imagem no Cloudinary |
| `disabled` | Boolean | `false` por padrão; `true` indica produto arquivado |
| `category_id` | String/UUID | chave estrangeira obrigatória |
| `createdAt` | DateTime | data atual por padrão |
| `updatedAt` | DateTime | atualizado automaticamente |

Ao excluir uma categoria, seus produtos são excluídos em cascata.

### 10.4. Order → tabela `orders`

| Campo | Tipo | Restrições/padrão |
|---|---|---|
| `id` | String/UUID | chave primária, UUID automático |
| `table` | Int | número da mesa, obrigatório |
| `status` | Boolean | `false` por padrão; comentário indica pendente, e `true`, pronto |
| `draft` | Boolean | `true` por padrão |
| `name` | String opcional | nome associado ao pedido |
| `createdAt` | DateTime | data atual por padrão |
| `updatedAt` | DateTime | atualizado automaticamente |

### 10.5. Item → tabela `items`

| Campo | Tipo | Restrições/padrão |
|---|---|---|
| `id` | String/UUID | chave primária, UUID automático |
| `amount` | Int | quantidade obrigatória |
| `order_id` | String/UUID | chave estrangeira obrigatória para pedido |
| `product_id` | String/UUID | chave estrangeira obrigatória para produto |
| `createdAt` | DateTime | data atual por padrão |
| `updatedAt` | DateTime | atualizado automaticamente |

Ao excluir um pedido, seus itens são excluídos em cascata. Ao excluir um produto, seus itens também são excluídos em cascata.

### Migration existente

Existe uma migration inicial, `20260802172104_create_tables`, que cria:

- enum `Role`;
- tabelas `users`, `categories`, `products`, `orders` e `items`;
- índice único para `users.email`;
- chaves estrangeiras e exclusões em cascata.

## 11. Variáveis de ambiente

| Variável | Obrigatória | Finalidade |
|---|---|---|
| `DATABASE_URL` | Sim | string de conexão PostgreSQL usada pelo Prisma e pelo adaptador `pg` |
| `JWT_SECRET` | Sim | segredo de assinatura e verificação dos JWTs |
| `CLOUDINARY_CLOUD_NAME` | Sim (para produtos) | identificador da conta Cloudinary |
| `CLOUDINARY_API_KEY` | Sim (para produtos) | chave de API do Cloudinary |
| `CLOUDINARY_API_SECRET` | Sim (para produtos) | segredo de API do Cloudinary |
| `PORT` | Não | porta HTTP; padrão `3333` |

Exemplo recomendado para `.env.example`:

```dotenv
PORT=3333
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:5432/BANCO?schema=public"
JWT_SECRET="substitua-por-um-segredo-longo-e-aleatorio"
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"
```

O `.env` não deve ser versionado. O `.gitignore` do backend já contém regra para arquivos `.env`.

## 12. Comandos disponíveis e operação

### Instalação

```bash
cd backend
npm ci
```

### Gerar o Prisma Client

```bash
npx prisma generate
```

### Aplicar migrations em desenvolvimento

```bash
npx prisma migrate dev
```

### Executar em desenvolvimento

```bash
npm run dev
```

O único script atualmente declarado é:

```json
{
  "dev": "tsx watch src/server.ts"
}
```

Ainda não existem scripts `build`, `start`, `test`, `lint` ou `prisma:generate`.

## 13. Tratamento de erros e respostas HTTP

O middleware global considera qualquer valor que seja instância de `Error` como erro HTTP `400` e devolve sua mensagem. Caso contrário, responde `500`.

Os middlewares de autenticação e autorização respondem diretamente com `401`. A validação Zod responde `400`.

Principais respostas atuais:

| Situação | Status |
|---|---:|
| Schema inválido | 400 |
| Erro lançado por um service ou controller | 400 |
| Formato de imagem inválido (Multer) | 400 |
| Token ausente ou inválido | 401 |
| Usuário não administrativo | 401 |
| Categoria criada | 201 |
| Demais operações bem-sucedidas | 200 |

## 14. Estado funcional atual

### Implementado

- criação de usuário;
- hash de senha;
- login e emissão de JWT;
- autenticação via Bearer token;
- consulta dos dados do usuário autenticado;
- perfis `STAFF` e `ADMIN`;
- autorização administrativa;
- criação de categoria;
- listagem de categorias;
- criação de produto com upload de imagem para Cloudinary;
- listagem de produtos com filtro por status `disabled`;
- listagem de produtos ativos por categoria (`GET /category/product`);
- exclusão lógica de produto (`disabled: true`);
- validação Zod;
- upload multipart com Multer;
- modelagem de usuários, categorias, produtos, pedidos e itens;
- migration inicial PostgreSQL.

### Modelado ou parcialmente implementado, mas incompleto

- pedidos (`Order`);
- itens do pedido (`Item`);
- alteração e exclusão de categorias;
- edição de produto (reativação, atualização de dados ou imagem);
- remoção física de produto ou imagem no Cloudinary;
- gerenciamento de perfis de usuário.

## 15. Pontos de atenção encontrados

Esta seção registra o estado observado no código atual; nenhuma correção foi aplicada durante a atualização deste documento.

1. **Erro no `CreateUserController`:** há import duplicado de `CreateUserService` e um import incorreto/não utilizado de `prismaClient` a partir do cliente gerado. Isso deve impedir a compilação TypeScript.
2. **Typo no import de `ListProductsController`:** importa de `LIstProductService` (L maiúsculo no meio); o arquivo real também se chama `LIstProductService.ts`. Pode falhar em sistemas case-sensitive (Linux/macOS) se o import for corrigido sem renomear o arquivo.
3. **Typo no nome do arquivo `ListCatgoryService.ts`:** grafia incorreta de "Category".
4. **Typo no nome do arquivo `ListProductByCategoryServvice.ts`:** grafia incorreta de "Service" (`Servvice`); o controller importa desse caminho.
5. **Listagem por categoria sem filtro `disabled`:** `GET /category/product` retorna sempre produtos ativos; não há parâmetro para listar arquivados de uma categoria específica.
6. **Scripts incompletos:** faltam `build`, `start`, `test` e `lint`; portanto, o projeto só oferece execução em modo watch.
7. **Versão do Node não fixada:** convém adicionar `engines` e/ou `.nvmrc`.
8. **TypeScript 7.0.2:** é uma versão muito nova e o próprio comentário do `tsconfig` ainda menciona TypeScript 5.6. A compatibilidade da cadeia de ferramentas deve ser validada.
9. **Status de autorização:** usuário autenticado sem permissão administrativa recebe `401`; semanticamente, `403 Forbidden` é mais apropriado.
10. **Tratamento global:** todos os objetos `Error` viram `400`, inclusive possíveis falhas internas do banco ou do Cloudinary. Recomenda-se uma classe de erro operacional com status explícito.
11. **CORS irrestrito:** `cors()` aceita qualquer origem. Em produção, deve haver uma lista de origens permitidas.
12. **JWT e Cloudinary sem validação de configuração:** se variáveis estiverem ausentes, o erro ocorrerá em execução. As variáveis devem ser validadas na inicialização.
13. **Formato Bearer pouco defensivo:** o middleware não valida explicitamente o esquema `Bearer` nem a quantidade de partes do cabeçalho.
14. **Busca por campo único:** login e cadastro usam `findFirst` para `email`, apesar de o campo ser único; `findUnique` expressa melhor essa regra.
15. **Criação de usuário e produto retornam 200:** para consistência REST, o ideal seria HTTP `201`.
16. **Categoria e produto sem unicidade:** nomes duplicados são aceitos pela modelagem atual.
17. **Soft delete sem reativação:** não existe endpoint para reverter `disabled: true` em um produto.
18. **Delete de produto sem validação Zod:** `product_id` é lido de `req.query` sem schema; ausência ou UUID inválido gera erro genérico.
19. **Imagens órfãs no Cloudinary:** ao arquivar um produto, a imagem permanece no Cloudinary; não há rotina de limpeza.
20. **Exclusão em cascata de produto:** apagar uma categoria remove produtos e itens históricos associados. Isso pode afetar a integridade histórica de pedidos.
21. **Sem índices adicionais:** as chaves estrangeiras e campos usados em filtros frequentes podem precisar de índices conforme o volume crescer.
22. **Sem paginação:** listagens de categorias e produtos retornam todos os registros; endpoints futuros devem prever paginação.
23. **Sem testes automatizados:** não foram encontrados testes unitários, de integração ou end-to-end.
24. **Sem documentação OpenAPI:** os contratos existem apenas no código.
25. **Services instanciados diretamente:** controllers criam os services com `new`, o que funciona, mas dificulta isolamento e mocks em testes.
26. **Captura genérica em services:** `CreateCategoryService`, `ListCategoryService`, `ListProductService`, `ListProductByCategoryService` e `DeleteProductService` escondem a causa original e retornam mensagens genéricas.
27. **Campos booleanos de estado:** `status` e `draft` em pedidos podem gerar estados ambíguos. Enums explícitos tornam o fluxo do pedido mais claro.
28. **README insuficiente:** contém apenas o título e não orienta instalação, configuração ou uso.
29. **Pacote duplicado na raiz:** o `package.json` da raiz declara apenas `bcryptjs`, também presente no backend; deve-se confirmar se esse manifesto é necessário.
30. **`validateSchema` não propaga valores parseados:** transformações Zod (ex.: `listProductSchema`) não alteram `req.query`/`req.body` usados pelos controllers.

## 16. Recomendações de evolução

Prioridade sugerida:

1. corrigir os imports do `CreateUserController` e do `ListProductsController`, e renomear `ListCatgoryService.ts`, `LIstProductService.ts` e `ListProductByCategoryServvice.ts`;
2. fixar uma versão estável do Node.js e confirmar a versão do TypeScript;
3. criar scripts de build, start, lint e testes;
4. adicionar validação tipada das variáveis de ambiente (incluindo Cloudinary);
5. padronizar erros e códigos HTTP;
6. implementar testes de autenticação, autorização, validação, upload e services;
7. documentar a API com OpenAPI/Swagger;
8. completar os módulos de pedido e item;
9. adicionar endpoints de edição/reativação de produto e CRUD completo de categorias;
10. revisar as exclusões em cascata para preservar o histórico dos pedidos;
11. criar seed seguro para o primeiro administrador;
12. restringir CORS e aplicar práticas de segurança para produção;
13. expandir o README com setup, variáveis Cloudinary e exemplos de requisição.

## 17. Resumo arquitetural para continuidade

Ao implementar uma nova funcionalidade, siga o padrão já adotado:

```text
1. Criar o schema Zod em src/schemas/
2. Criar o service em src/services/<dominio>/
3. Criar o controller em src/controllers/<dominio>/
4. Registrar a rota em src/routes.ts
5. Encadear autenticação/autorização/validação conforme necessário
6. Para uploads, configurar Multer em src/config/multer.ts e registrar upload.single('file') na rota
7. Acessar o banco exclusivamente pelo prismaClient do src/prisma/index.ts
8. Retornar pelo controller apenas os campos públicos necessários
9. Adicionar testes para o service, middleware e endpoint
```

O princípio central é manter o controller pequeno e deixar a regra de negócio no service. O controller conhece HTTP; o service conhece o caso de uso, a persistência e integrações externas; o Prisma concentra o acesso ao PostgreSQL; o Cloudinary concentra o armazenamento de imagens.

---

**Base da análise:** código-fonte do repositório `pizzaria`, incluindo manifestos, lockfile, código TypeScript, schema Prisma, migration e histórico de commits até o commit `d295b64` (*list product by category*), agosto de 2026.
