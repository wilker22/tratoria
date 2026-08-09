# Contexto Técnico do Projeto Pizzaria

## 1. Identificação do projeto

- **Nome declarado no backend:** `backend`
- **Versão do backend:** `1.0.0`
- **Nome apresentado no README:** `PROJETO TRATORIA`
- **Tipo:** API REST para gerenciamento de uma pizzaria/tratoria
- **Estado atual:** backend em desenvolvimento, com usuários, autenticação, consulta do usuário autenticado e criação de categorias implementados
- **Linguagem:** TypeScript
- **Runtime:** Node.js
- **Banco de dados:** PostgreSQL
- **ORM:** Prisma ORM 7 com driver adapter `@prisma/adapter-pg`

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
    E --> D
    D --> A
```

### Fluxo de uma requisição

1. **Rotas:** recebem a requisição e definem quais middlewares e controller serão executados.
2. **Middlewares:** validam o schema, autenticam o token e, quando necessário, verificam se o usuário é administrador.
3. **Controllers:** extraem dados de `body` ou do objeto `Request`, chamam o service correspondente e definem a resposta HTTP.
4. **Services:** concentram a regra de negócio, consultam ou alteram o banco pelo Prisma e devolvem o resultado ao controller.
5. **Prisma/PostgreSQL:** realizam a persistência e a recuperação dos dados.
6. **Tratamento global de erros:** erros lançados pelas camadas seguintes chegam ao middleware final de erro em `server.ts`.

### Exemplo real: criação de categoria

`POST /category` → `isAuthenticated` → `isAdmin` → `validateSchema(createCategorySchema)` → `CreateCategoryController` → `CreateCategoryService` → `prismaClient.category.create()` → PostgreSQL.

## 3. Tecnologias e versões

As versões abaixo são as versões exatas resolvidas no `backend/package-lock.json`, e não apenas os intervalos declarados no `package.json`.

### Dependências de execução

| Biblioteca | Versão | Finalidade |
|---|---:|---|
| `@prisma/adapter-pg` | 7.9.1 | Adaptador PostgreSQL utilizado pelo Prisma 7 |
| `@prisma/client` | 7.9.1 | Cliente ORM gerado para acesso ao banco |
| `bcryptjs` | 3.0.3 | Hash e comparação de senhas |
| `cors` | 2.8.6 | Liberação de requisições entre origens |
| `dotenv` | 17.4.2 | Carregamento de variáveis do arquivo `.env` |
| `express` | 5.2.1 | Framework HTTP e roteamento |
| `jsonwebtoken` | 9.0.3 | Geração e validação de tokens JWT |
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
        ├── controllers/
        │   ├── category/CreateCategoryController.ts
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
        │   └── userSchema.ts
        ├── services/
        │   ├── category/CreateCategoryService.ts
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
| `src/routes.ts` | Registro central dos endpoints e cadeia de middlewares |
| `src/controllers/` | Adaptação entre HTTP e os casos de uso |
| `src/services/` | Regras de negócio e operações pelo Prisma |
| `src/midlewares/` | Validação, autenticação e autorização |
| `src/schemas/` | Schemas Zod das requisições |
| `src/prisma/index.ts` | Inicialização do Prisma Client com `PrismaPg` |
| `src/generated/prisma/` | Código gerado automaticamente pelo Prisma; não deve ser editado manualmente |
| `prisma/schema.prisma` | Modelagem declarativa do banco |
| `prisma/migrations/` | Histórico SQL da estrutura do banco |
| `src/@types/express/` | Extensão do tipo `Express.Request` com `user_id` |

Observação: a pasta está escrita como `midlewares`; a grafia convencional seria `middlewares`.

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

| Método | Endpoint | Acesso | Validação | Controller | Resposta de sucesso |
|---|---|---|---|---|---|
| `POST` | `/users` | Público | `createUserSchema` | `CreateUserController` | Usuário criado, sem senha; atualmente HTTP `200` |
| `POST` | `/session` | Público | `authUserSchema` | `AuthUserController` | Dados do usuário e token JWT; HTTP `200` |
| `GET` | `/me` | JWT | Não possui schema | `DetailUserController` | Dados do usuário autenticado; HTTP `200` |
| `POST` | `/category` | JWT + perfil `ADMIN` | `createCategorySchema` | `CreateCategoryController` | Categoria criada; HTTP `201` |

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

- `STAFF`: padrão para novos usuários;
- `ADMIN`: autorizado a criar categorias.

Não existe endpoint implementado para promover um usuário a `ADMIN`; essa alteração precisa ocorrer diretamente no banco, por seed, Prisma Studio ou futura funcionalidade administrativa.

## 8. Validação dos schemas

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

### Schemas atuais

| Schema | Campo | Regra |
|---|---|---|
| `createUserSchema` | `body.name` | string, mínimo 3 caracteres |
| `createUserSchema` | `body.email` | e-mail válido |
| `createUserSchema` | `body.password` | string, mínimo 6 caracteres |
| `authUserSchema` | `body.email` | e-mail válido |
| `authUserSchema` | `body.password` | string, mínimo 1 caractere |
| `createCategorySchema` | `body.name` | string, mínimo 2 caracteres |

## 9. Banco de dados e Prisma

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

### 9.1. User → tabela `users`

| Campo | Tipo | Restrições/padrão |
|---|---|---|
| `id` | String/UUID | chave primária, UUID automático |
| `name` | String | obrigatório |
| `email` | String | obrigatório, único |
| `password` | String | obrigatório, armazena hash |
| `role` | Enum `Role` | `STAFF` por padrão; aceita `STAFF` ou `ADMIN` |
| `createdAt` | DateTime | data atual por padrão |
| `updatedAt` | DateTime | atualizado automaticamente pelo Prisma |

### 9.2. Category → tabela `categories`

| Campo | Tipo | Restrições/padrão |
|---|---|---|
| `id` | String/UUID | chave primária, UUID automático |
| `name` | String | obrigatório |
| `createdAt` | DateTime | data atual por padrão |
| `updatedAt` | DateTime | atualizado automaticamente |
| `products` | Relação | uma categoria possui vários produtos |

### 9.3. Product → tabela `products`

| Campo | Tipo | Restrições/padrão |
|---|---|---|
| `id` | String/UUID | chave primária, UUID automático |
| `name` | String | obrigatório |
| `price` | Int | obrigatório; valor armazenado em centavos |
| `description` | String | obrigatório |
| `banner` | String | obrigatório; referência textual à imagem |
| `disabled` | Boolean | `false` por padrão |
| `category_id` | String/UUID | chave estrangeira obrigatória |
| `createdAt` | DateTime | data atual por padrão |
| `updatedAt` | DateTime | atualizado automaticamente |

Ao excluir uma categoria, seus produtos são excluídos em cascata.

### 9.4. Order → tabela `orders`

| Campo | Tipo | Restrições/padrão |
|---|---|---|
| `id` | String/UUID | chave primária, UUID automático |
| `table` | Int | número da mesa, obrigatório |
| `status` | Boolean | `false` por padrão; comentário indica pendente, e `true`, pronto |
| `draft` | Boolean | `true` por padrão |
| `name` | String opcional | nome associado ao pedido |
| `createdAt` | DateTime | data atual por padrão |
| `updatedAt` | DateTime | atualizado automaticamente |

### 9.5. Item → tabela `items`

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

## 10. Variáveis de ambiente

O `.env` analisado define estas chaves, sem reproduzir seus valores por segurança:

| Variável | Obrigatória | Finalidade |
|---|---|---|
| `DATABASE_URL` | Sim | string de conexão PostgreSQL usada pelo Prisma e pelo adaptador `pg` |
| `JWT_SECRET` | Sim | segredo de assinatura e verificação dos JWTs |
| `PORT` | Não | porta HTTP; padrão `3333` |

Exemplo recomendado para `.env.example`:

```dotenv
PORT=3333
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:5432/BANCO?schema=public"
JWT_SECRET="substitua-por-um-segredo-longo-e-aleatorio"
```

O `.env` não deve ser versionado. O `.gitignore` do backend já contém regra para arquivos `.env`.

## 11. Comandos disponíveis e operação

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

## 12. Tratamento de erros e respostas HTTP

O middleware global considera qualquer valor que seja instância de `Error` como erro HTTP `400` e devolve sua mensagem. Caso contrário, responde `500`.

Os middlewares de autenticação e autorização respondem diretamente com `401`. A validação Zod responde `400`.

Principais respostas atuais:

| Situação | Status |
|---|---:|
| Schema inválido | 400 |
| Erro lançado por um service | 400 |
| Token ausente ou inválido | 401 |
| Usuário não administrativo | 401 |
| Categoria criada | 201 |
| Demais operações bem-sucedidas | 200 |

## 13. Estado funcional atual

### Implementado

- criação de usuário;
- hash de senha;
- login e emissão de JWT;
- autenticação via Bearer token;
- consulta dos dados do usuário autenticado;
- perfis `STAFF` e `ADMIN`;
- autorização administrativa;
- criação de categoria;
- validação Zod;
- modelagem de usuários, categorias, produtos, pedidos e itens;
- migration inicial PostgreSQL.

### Modelado, mas sem endpoints/services

- produtos;
- pedidos;
- itens do pedido;
- listagem, alteração e exclusão de categorias;
- gerenciamento de perfis de usuário.

## 14. Pontos de atenção encontrados

Esta seção registra o estado observado; nenhuma correção foi aplicada ao projeto.

1. **Erro no `CreateUserController`:** há import duplicado de `CreateUserService` e um import incorreto/não utilizado de `prismaClient` a partir do cliente gerado. Isso deve impedir a compilação TypeScript.
2. **Scripts incompletos:** faltam `build`, `start`, `test` e `lint`; portanto, o projeto só oferece execução em modo watch.
3. **Versão do Node não fixada:** convém adicionar `engines` e/ou `.nvmrc`.
4. **TypeScript 7.0.2:** é uma versão muito nova e o próprio comentário do `tsconfig` ainda menciona TypeScript 5.6. A compatibilidade da cadeia de ferramentas deve ser validada.
5. **Status de autorização:** usuário autenticado sem permissão administrativa recebe `401`; semanticamente, `403 Forbidden` é mais apropriado.
6. **Tratamento global:** todos os objetos `Error` viram `400`, inclusive possíveis falhas internas do banco. Recomenda-se uma classe de erro operacional com status explícito.
7. **CORS irrestrito:** `cors()` aceita qualquer origem. Em produção, deve haver uma lista de origens permitidas.
8. **JWT sem validação de configuração:** se `JWT_SECRET` estiver ausente, o erro ocorrerá em execução. As variáveis devem ser validadas na inicialização.
9. **Formato Bearer pouco defensivo:** o middleware não valida explicitamente o esquema `Bearer` nem a quantidade de partes do cabeçalho.
10. **Busca por campo único:** login e cadastro usam `findFirst` para `email`, apesar de o campo ser único; `findUnique` expressa melhor essa regra.
11. **Criação de usuário retorna 200:** para consistência REST, o ideal seria HTTP `201`.
12. **Categoria sem unicidade:** nomes duplicados são aceitos pela modelagem atual.
13. **Exclusão em cascata de produto:** apagar uma categoria remove produtos e itens históricos associados. Isso pode afetar a integridade histórica de pedidos.
14. **Sem índices adicionais:** as chaves estrangeiras e campos usados em filtros frequentes podem precisar de índices conforme o volume crescer.
15. **Sem paginação:** ainda não existem listagens, mas endpoints futuros devem prever paginação.
16. **Sem testes automatizados:** não foram encontrados testes unitários, de integração ou end-to-end.
17. **Sem documentação OpenAPI:** os contratos existem apenas no código.
18. **Services instanciados diretamente:** controllers criam os services com `new`, o que funciona, mas dificulta isolamento e mocks em testes.
19. **Captura genérica em categoria:** `CreateCategoryService` esconde a causa original e sempre retorna “Falha ao criar categoria”.
20. **Campos booleanos de estado:** `status` e `draft` podem gerar estados ambíguos. Enums explícitos tornam o fluxo do pedido mais claro.
21. **README insuficiente:** contém apenas o título e não orienta instalação, configuração ou uso.
22. **Pacote duplicado na raiz:** o `package.json` da raiz declara apenas `bcryptjs`, também presente no backend; deve-se confirmar se esse manifesto é necessário.

## 15. Recomendações de evolução

Prioridade sugerida:

1. corrigir os imports do `CreateUserController` e garantir compilação limpa;
2. fixar uma versão estável do Node.js e confirmar a versão do TypeScript;
3. criar scripts de build, start, lint e testes;
4. adicionar validação tipada das variáveis de ambiente;
5. padronizar erros e códigos HTTP;
6. implementar testes de autenticação, autorização, validação e services;
7. documentar a API com OpenAPI/Swagger;
8. completar os módulos de produto, pedido e item;
9. revisar as exclusões em cascata para preservar o histórico dos pedidos;
10. criar seed seguro para o primeiro administrador;
11. restringir CORS e aplicar práticas de segurança para produção;
12. expandir o README com setup e exemplos de requisição.

## 16. Resumo arquitetural para continuidade

Ao implementar uma nova funcionalidade, siga o padrão já adotado:

```text
1. Criar o schema Zod em src/schemas/
2. Criar o service em src/services/<dominio>/
3. Criar o controller em src/controllers/<dominio>/
4. Registrar a rota em src/routes.ts
5. Encadear autenticação/autorização/validação conforme necessário
6. Acessar o banco exclusivamente pelo prismaClient do src/prisma/index.ts
7. Retornar pelo controller apenas os campos públicos necessários
8. Adicionar testes para o service, middleware e endpoint
```

O princípio central é manter o controller pequeno e deixar a regra de negócio no service. O controller conhece HTTP; o service conhece o caso de uso e a persistência; o Prisma concentra o acesso ao PostgreSQL.

---

**Base da análise:** conteúdo do arquivo `pizzaria.zip`, incluindo manifestos, lockfile, código TypeScript, schema Prisma e migration disponíveis em 7 de agosto de 2026.
