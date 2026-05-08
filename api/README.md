# API - Backend

Backend da API REST do sistema de Pesquisa e Satisfação do IFPE, construído com **NestJS 11** e **TypeScript**.

## Descrição

API responsável pela gestão de usuários, perfis de acesso, catálogo acadêmico (campi, cursos, turmas, serviços) e pesquisas de satisfação com suporte a respostas anônimas.

Utiliza uma **arquitetura dual-banco**:
- **PostgreSQL** (TypeORM) — dados relacionais estruturados
- **MongoDB** (Mongoose) — pesquisas flexíveis e respostas

## Pré-requisitos

- **Node.js** >= 20.x
- **npm** >= 10.x
- **PostgreSQL** >= 14 (rodando localmente)
- **MongoDB** >= 6 (rodando localmente)

## Instalação

```bash
npm install
```

## Configuração

Crie o arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `PORT` | Porta do servidor | `3000` |
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_USER` | Usuário do PostgreSQL | `postgres` |
| `DB_PASS` | Senha do PostgreSQL | `root` |
| `DB_NAME` | Nome do banco PostgreSQL | `satisfaction_survey` |
| `MONGO_URI` | URI de conexão MongoDB | `mongodb://localhost:27017/satisfaction_survey` |
| `JWT_SECRET` | Chave secreta para assinatura JWT | `supersecretkey` |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `1d` |

## Execução

```bash
# Desenvolvimento com hot-reload
npm run start:dev

# Modo debug
npm run start:debug

# Produção (após build)
npm run start:prod
```

Após iniciar, acesse:
- **API**: `http://localhost:3000`
- **Swagger**: `http://localhost:3000/docs`
- **Swagger JSON**: `http://localhost:3000/api-json`

## Banco de Dados

### Tabelas PostgreSQL

| Tabela | Descrição |
|---|---|
| `users` | Contas de usuário (UUID, soft-delete) |
| `profiles` | Perfis de acesso |
| `user_profiles` | Relação muitos-para-muitos entre usuários e perfis |
| `campuses` | Campi do IFPE |
| `courses` | Cursos acadêmicos |
| `classes` | Turmas vinculadas a cursos |
| `enrollments` | Matrículas de alunos em turmas (unique: user + class) |
| `services` | Serviços oferecidos por campus |
| `audit_logs` | Trilha de auditoria automática (JSONB) |

### Migrações

```bash
# Executar migrações pendentes
npm run migration:run

# Reverter última migração
npm run migration:revert

# Gerar nova migração (após alterar entidades)
npm run migration:generate
```

### Seed Automático

Ao iniciar a aplicação pela primeira vez, os seguintes dados são criados automaticamente:

**Perfis:**
- `ADMIN` — Administrador
- `GESTOR` — Gestor acadêmico
- `TECNICO` — Servidor técnico
- `DOCENTE` — Professor
- `ALUNO` — Estudante

**Usuário Admin padrão:**
- Email: `admin@email.com`
- Senha: `admin123`

## Estrutura do Projeto

```
src/
├── main.ts                    # Bootstrap (Swagger, Helmet, CORS)
├── app.module.ts              # Módulo raiz
├── common/
│   ├── dtos/
│   │   └── api-response.dto.ts       # Envelope padrão de resposta
│   ├── enums/
│   │   └── status.enum.ts            # ACTIVE, INACTIVE
│   └── interfaces/
│       └── auth-user.interface.ts    # Interface do usuário autenticado
├── database/
│   ├── typeorm.ts                    # DataSource TypeORM
│   ├── migrations/
│   │   └── 1777950021060-InitialMigration.ts
│   └── seeds/
│       ├── seed.module.ts
│       └── seed.service.ts           # Seed de perfis e admin
└── modules/
    ├── auth/                         # Autenticação JWT
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.module.ts
    │   ├── decorators/
    │   │   └── roles.decorator.ts    # @Roles() decorator
    │   ├── dtos/
    │   │   ├── login.dto.ts
    │   │   └── login-response.dto.ts
    │   ├── guards/
    │   │   ├── jwt-auth.guard.ts     # Guarda de autenticação
    │   │   └── roles.guard.ts        # Guarda de autorização
    │   └── strategies/
    │       └── jwt.strategy.ts       # Estratégia Passport JWT
    ├── users/                        # Gestão de usuários
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   ├── users.module.ts
    │   ├── user.entity.ts
    │   └── dtos/
    │       ├── create-user.dto.ts
    │       ├── user-response.dto.ts
    │       └── user.seeds.ts
    ├── profiles/                     # Perfis de acesso
    │   ├── profiles.entity.ts
    │   ├── profiles.module.ts
    │   ├── profiles.service.ts
    │   └── profiles.seed.ts
    ├── audit/                        # Auditoria automática
    │   ├── audit.entity.ts           # Entidade de log
    │   ├── audit.module.ts
    │   ├── audit.service.ts
    │   └── audit.subscriber.ts       # Subscriber TypeORM (INSERT/UPDATE/DELETE)
    ├── catalog/                      # Catálogo acadêmico
    │   ├── campus/                   # Gestão de campi
    │   ├── courses/                  # Gestão de cursos
    │   │   ├── courses.controller.ts
    │   │   ├── courses.service.ts
    │   │   ├── courses.module.ts
    │   │   ├── course.entity.ts
    │   │   └── dtos/
    │   ├── classes/                  # Gestão de turmas e matrículas
    │   │   ├── classes.controller.ts
    │   │   ├── classes.service.ts
    │   │   ├── classes.module.ts
    │   │   ├── classes.entity.ts
    │   │   ├── enrollment.entity.ts
    │   │   └── dtos/
    │   └── services/                 # Gestão de serviços por campus
    │       ├── services.controller.ts
    │       ├── services.service.ts
    │       ├── services.module.ts
    │       ├── service.entity.ts
    │       └── dtos/
    └── surveys/                      # Pesquisas (MongoDB)
        ├── surveys.controller.ts
        ├── surveys.service.ts
        ├── surveys.module.ts
        ├── schemas/
        │   ├── survey.schema.ts      # Schema da pesquisa
        │   ├── answer.schema.ts      # Schema de respostas
        │   └── access-token.schema.ts # Schema de tokens públicos
        ├── dtos/
        │   ├── create-survey.dto.ts
        │   ├── update-survey.dto.ts
        │   ├── answer-survey.dto.ts
        │   └── ...
        └── types/
            └── survey-question.type.ts
```

## Módulos e Funcionalidades

### Auth Module

Autenticação via JWT com Passport.

| Método | Endpoint | Body | Descrição |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | Autentica e retorna token JWT |

**Resposta de login:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "admin@email.com",
      "name": "Administrador"
    }
  }
}
```

### Users Module

Gestão de usuários do sistema.

| Método | Endpoint | Auth | Roles | Descrição |
|---|---|---|---|---|
| POST | `/users` | JWT | ADMIN | Criar novo usuário |
| GET | `/users` | JWT | ADMIN | Listar todos os usuários |
| GET | `/users/:id` | JWT | ADMIN | Buscar usuário por ID |

### Profiles Module

Perfis de acesso com seed automático. Relacionado a usuários via muitos-para-muitos.

### Audit Module

Sistema de auditoria automática via TypeORM Entity Subscriber. Registra automaticamente todas as operações de INSERT, UPDATE e DELETE nas entidades monitoradas, incluindo valores anteriores e novos em formato JSONB.

### Catalog Module

#### Campus

| Método | Endpoint | Auth | Roles | Descrição |
|---|---|---|---|---|
| POST | `/campus` | JWT | ADMIN | Criar campus |
| GET | `/campus` | JWT | Todos | Listar campus |
| GET | `/campus/:id` | JWT | Todos | Buscar campus |
| PATCH | `/campus/:id` | JWT | ADMIN | Atualizar campus |
| PATCH | `/campus/:id/inactivate` | JWT | ADMIN | Inativar campus (soft-delete) |
| DELETE | `/campus/:id` | JWT | ADMIN | Remover campus (hard-delete) |

#### Courses

| Método | Endpoint | Auth | Roles | Descrição |
|---|---|---|---|---|
| POST | `/courses` | JWT | ADMIN | Criar curso |
| GET | `/courses` | JWT | ADMIN, GESTOR | Listar cursos |
| GET | `/courses/:id` | JWT | ADMIN, GESTOR | Buscar curso |
| PATCH | `/courses/:id` | JWT | ADMIN | Atualizar curso |
| PATCH | `/courses/:id/inactivate` | JWT | ADMIN | Inativar curso |
| DELETE | `/courses/:id` | JWT | ADMIN | Remover curso |

#### Classes (Turmas)

Módulo completo para gestão de turmas e matrículas de alunos, com validações automáticas de integridade acadêmica.

| Método | Endpoint | Auth | Roles | Descrição |
|---|---|---|---|---|
| POST | `/classes` | JWT | ADMIN | Criar turma |
| GET | `/classes` | JWT | Todos | Listar turmas |
| GET | `/classes/:id` | JWT | Todos | Buscar turma |
| PATCH | `/classes/:id` | JWT | ADMIN | Atualizar turma |
| PATCH | `/classes/:id/inactivate` | JWT | ADMIN | Inativar turma |
| DELETE | `/classes/:id` | JWT | ADMIN | Remover turma |
| POST | `/classes/:id/enroll` | JWT | ADMIN | Matricular aluno na turma |
| GET | `/classes/:id/students` | JWT | ADMIN, GESTOR, DOCENTE | Listar alunos matriculados |
| DELETE | `/classes/:id/students/:userId` | JWT | ADMIN | Cancelar matrícula do aluno |

**Entidades:**

| Entidade | Tabela | Descrição |
|---|---|---|
| `Class` | `classes` | Turma vinculada a um curso com semestre/ano |
| `Enrollment` | `enrollments` | Matrícula de aluno em uma turma (unique: user + class) |

**Validações implementadas:**

| Validação | Descrição |
|---|---|
| Turma duplicada | Bloqueia criação de turma com mesmo nome + curso + semestre + ano |
| Data disruptiva | Ano da turma não pode ser anterior à criação do curso nem superior ao ano atual |
| Semestre inválido | Semestre deve ser 1 ou 2 |
| Matrícula duplicada | Aluno não pode ser matriculado duas vezes na mesma turma (constraint unique no banco) |
| Perfil de aluno | Apenas usuários com perfil `ALUNO` podem ser matriculados |
| Turma inativa | Bloqueia matrícula em turmas inativas |

#### Services (Serviços)

Módulo para gestão de serviços oferecidos por campus (ex: biblioteca, restaurante, laboratório).

| Método | Endpoint | Auth | Roles | Descrição |
|---|---|---|---|---|
| POST | `/services` | JWT | ADMIN | Criar serviço |
| GET | `/services` | JWT | Todos | Listar serviços |
| GET | `/services/:id` | JWT | Todos | Buscar serviço |
| PATCH | `/services/:id` | JWT | ADMIN | Atualizar serviço |
| PATCH | `/services/:id/inactivate` | JWT | ADMIN | Inativar serviço |
| DELETE | `/services/:id` | JWT | ADMIN | Remover serviço |

**Entidade:**

| Entidade | Tabela | Descrição |
|---|---|---|
| `Service` | `services` | Serviço vinculado a um campus com nome e descrição |

**Validações implementadas:**

| Validação | Descrição |
|---|---|
| Serviço duplicado | Bloqueia criação de serviço com mesmo nome para o mesmo campus |

### Surveys Module

Módulo de pesquisas armazenado no MongoDB, com suporte a questões de múltiplos tipos e respostas anônimas via token público.

**Tipos de questão suportados:**
- `TEXT` — Resposta aberta
- `SINGLE_CHOICE` — Escolha única
- `MULTIPLE_CHOICE` — Múltipla escolha
- `SCALE` — Escala numérica

| Método | Endpoint | Auth | Roles | Descrição |
|---|---|---|---|---|
| GET | `/surveys` | JWT | ADMIN, GESTOR | Listar pesquisas (paginado) |
| POST | `/surveys` | JWT | ADMIN, GESTOR | Criar pesquisa |
| GET | `/surveys/:id` | JWT | Todos | Buscar pesquisa |
| PATCH | `/surveys/:id` | JWT | ADMIN, GESTOR | Atualizar pesquisa |
| PATCH | `/surveys/:id/inactivate` | JWT | ADMIN | Inativar pesquisa |
| GET | `/surveys/:id/anonymous-link` | JWT | ADMIN, GESTOR | Gerar link anônimo |
| GET | `/surveys/public/:token` | Não | — | Acessar pesquisa publicamente |
| POST | `/surveys/:id/answer` | JWT | ALUNO | Responder (autenticado) |
| POST | `/surveys/public/:token/answer` | Não | — | Responder (anônimo) |

**Parâmetros de listagem (`GET /surveys`):**
- `page` — Página atual (default: 1)
- `limit` — Itens por página (default: 10)
- `search` — Termo de busca
- `status` — Filtro por status

## Padrões de Arquitetura

| Padrão | Implementação |
|---|---|
| **Modular** | Feature modules do NestJS |
| **DTO** | class-validator para validação de entrada |
| **Repository** | `@InjectRepository` do TypeORM |
| **Guard** | JWT auth + Role-based authorization |
| **Strategy** | Passport JWT para extração de token |
| **Subscriber** | TypeORM Entity Subscriber para auditoria |
| **Soft Delete** | `deleted_at` para surveys, campus, courses |
| **Unique Constraint** | `@Unique` no TypeORM para evitar duplicidade de matrícula |
| **Validação de Regra de Negócio** | Verificação de data, status e perfil antes de operações |
| **Response Wrapper** | `ApiResponseDto<T>` consistente |
| **Decorator** | `@Roles()` para controle de acesso |

## Segurança

- **Helmet** — Headers de segurança HTTP
- **CORS** — Configurado e habilitado
- **JWT** — Autenticação via Bearer token
- **bcrypt** — Hash de senhas
- **Validation Pipe** — `whitelist: true`, `forbidNonWhitelisted: true`
- **Swagger protegido** — Documentação disponível apenas em desenvolvimento

## Testes

```bash
# Testes unitários
npm run test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:cov

# Testes end-to-end
npm run test:e2e

# Debug de testes
npm run test:debug
```

## Code Style

```bash
# Lint com correção automática
npm run lint

# Formatação com Prettier
npm run format
```

## Build

```bash
# Compilar TypeScript
npm run build

# O output vai para a pasta dist/
```

## Tecnologias

| Categoria | Tecnologia |
|---|---|
| Framework | NestJS 11 |
| Linguagem | TypeScript 5.7 |
| Banco Relacional | PostgreSQL + TypeORM 0.3 |
| Banco Documentos | MongoDB + Mongoose 9 |
| Autenticação | JWT + Passport |
| Hash | bcryptjs 3 |
| Validação | class-validator + class-transformer |
| Documentação | Swagger (@nestjs/swagger) |
| Segurança | Helmet |
| Agendamento | @nestjs/schedule |
| Testes | Jest + Supertest |
| Lint | ESLint 9 + Prettier |
