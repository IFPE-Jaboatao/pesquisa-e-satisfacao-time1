# Pesquisa e Satisfação - Time 1

Sistema de pesquisa de satisfação desenvolvido para o IFPE (Instituto Federal de Pernambuco), permitindo a criação, distribuição e coleta de pesquisas de satisfação de forma centralizada, com suporte a respostas anônimas e análise de dados.

## Arquitetura

O projeto é estruturado como um **monorepo** contendo duas aplicações independentes:

```
pesquisa-e-satisfacao-time1/
├── api/          # Backend - API REST com NestJS
├── app/          # Frontend - Interface web com Next.js
└── README.md     # Este arquivo
```

### Backend (`api/`)

API RESTful construída com **NestJS** que gerencia usuários, perfis, campi, cursos, disciplinas e pesquisas de satisfação.

- **Autenticação**: JWT com Passport
- **Autorização**: Controle de acesso baseado em perfis (RBAC)
- **Banco Relacional**: PostgreSQL (TypeORM) — usuários, perfis, campi, cursos
- **Banco de Documentos**: MongoDB (Mongoose) — pesquisas e respostas
- **Documentação**: Swagger/OpenAPI disponível em `/docs`
- **Auditoria**: Log automático de operações via TypeORM Subscriber

[Documentação completa do backend →](api/README.md)

### Frontend (`app/`)

Interface web construída com **Next.js 16** e **React 19**, com estilização via **Tailwind CSS 4**.

- **Framework**: Next.js com App Router
- **UI**: React 19
- **Estilização**: Tailwind CSS v4
- **Linguagem**: TypeScript

[Documentação completa do frontend →](app/README.md)

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | NestJS 11, TypeScript 5.7 |
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Banco Relacional | PostgreSQL + TypeORM |
| Banco de Documentos | MongoDB + Mongoose |
| Autenticação | JWT (passport-jwt) |
| Validação | class-validator + class-transformer |
| Documentação API | Swagger (@nestjs/swagger) |
| Testes | Jest + Supertest |

## Perfis de Acesso

| Perfil | Descrição |
|---|---|
| `ADMIN` | Administrador do sistema (acesso completo) |
| `GESTOR` | Gestor acadêmico (gerencia pesquisas, visualiza campi/cursos) |
| `TECNICO` | Servidor técnico (visualiza campi) |
| `DOCENTE` | Professor (visualiza campi) |
| `ALUNO` | Estudante (visualiza campi, visualiza e responde pesquisas) |

## Pré-requisitos

- **Node.js** >= 20.x
- **npm** >= 10.x
- **PostgreSQL** >= 14 (rodando localmente)
- **MongoDB** >= 6 (rodando localmente)

## Início Rápido

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd pesquisa-e-satisfacao-time1
```

### 2. Configure o Backend

```bash
cd api

# Instale as dependências
npm install

# Copie e configure as variáveis de ambiente
cp .env.example .env

# Execute as migrações do banco de dados
npm run migration:run

# Inicie o servidor em modo desenvolvimento
npm run start:dev
```

O backend estará disponível em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/docs`.

**Credenciais padrão** (criadas automaticamente via seed):
- Email: `admin@email.com`
- Senha: `admin123`

### 3. Configure o Frontend

```bash
cd app

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:3001`.

## Estrutura de Diretórios

### Backend (`api/src/`)

```
src/
├── main.ts                    # Ponto de entrada (Swagger, Helmet, CORS)
├── app.module.ts              # Módulo raiz
├── common/                    # Utilitários compartilhados
│   ├── dtos/                  # DTOs genéricos (ApiResponseDto)
│   ├── enums/                 # Enums compartilhados
│   └── interfaces/            # Interfaces compartilhadas
├── database/
│   ├── typeorm.ts             # Configuração do datasource TypeORM
│   ├── migrations/            # Migrações do PostgreSQL
│   └── seeds/                 # Seed automático (perfis + admin)
└── modules/
    ├── auth/                  # Autenticação JWT
    ├── users/                 # Gestão de usuários
    ├── profiles/              # Perfis de acesso
    ├── audit/                 # Log de auditoria automático
    ├── catalog/               # Catálogo acadêmico
    │   ├── campus/            # Gestão de campi
    │   ├── courses/           # Gestão de cursos
    │   ├── classes/           # Turmas
    │   ├── disciplines/       # Disciplinas
    │   └── services/          # Serviços por campus
    └── surveys/               # Pesquisas de satisfação (MongoDB)
        ├── schemas/           # Schemas Mongoose
        ├── dtos/              # DTOs de requisição/resposta
        └── types/             # Tipos TypeScript
```

### Frontend (`app/`)

```
app/
├── next.config.ts             # Configuração do Next.js
├── tsconfig.json              # Configuração do TypeScript
├── postcss.config.mjs         # Configuração do PostCSS/Tailwind
├── eslint.config.mjs          # Configuração do ESLint
└── package.json               # Dependências e scripts
```

## Scripts Disponíveis

### Backend

| Comando | Descrição |
|---|---|
| `npm run start:dev` | Inicia em modo desenvolvimento com hot-reload |
| `npm run start:prod` | Inicia em modo produção |
| `npm run build` | Compila TypeScript |
| `npm run migration:run` | Executa migrações pendentes |
| `npm run migration:generate` | Gera nova migração |
| `npm run migration:revert` | Reverte última migração |
| `npm run test` | Executa testes unitários |
| `npm run test:e2e` | Executa testes end-to-end |
| `npm run test:cov` | Executa testes com cobertura |
| `npm run lint` | Executa linting e corrige automaticamente |
| `npm run format` | Formata código com Prettier |

### Frontend

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Compila para produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa linting |

## Variáveis de Ambiente (Backend)

Crie o arquivo `api/.env` baseado no `api/.env.example`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=root
DB_NAME=satisfaction_survey

MONGO_URI=mongodb://localhost:27017/satisfaction_survey

JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1d
```

## Endpoints da API

### Autenticação

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/login` | Não | Login do usuário |

### Usuários

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| POST | `/users` | JWT (ADMIN) | Criar usuário |
| GET | `/users` | JWT (ADMIN) | Listar usuários |
| GET | `/users/:id` | JWT (ADMIN) | Buscar usuário |

### Campus

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| POST | `/campus` | JWT (ADMIN) | Criar campus |
| GET | `/campus` | JWT | Listar campus |
| GET | `/campus/:id` | JWT | Buscar campus |
| PATCH | `/campus/:id` | JWT (ADMIN) | Atualizar campus |
| PATCH | `/campus/:id/inactivate` | JWT (ADMIN) | Inativar campus |
| DELETE | `/campus/:id` | JWT (ADMIN) | Remover campus |

### Cursos

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| POST | `/courses` | JWT (ADMIN) | Criar curso |
| GET | `/courses` | JWT (ADMIN, GESTOR) | Listar cursos |
| GET | `/courses/:id` | JWT (ADMIN, GESTOR) | Buscar curso |
| PATCH | `/courses/:id` | JWT (ADMIN) | Atualizar curso |
| PATCH | `/courses/:id/inactivate` | JWT (ADMIN) | Inativar curso |
| DELETE | `/courses/:id` | JWT (ADMIN) | Remover curso |

### Pesquisas

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| GET | `/surveys` | JWT (ADMIN, GESTOR) | Listar pesquisas |
| POST | `/surveys` | JWT (ADMIN, GESTOR) | Criar pesquisa |
| GET | `/surveys/:id` | JWT | Buscar pesquisa |
| PATCH | `/surveys/:id` | JWT (ADMIN, GESTOR) | Atualizar pesquisa |
| PATCH | `/surveys/:id/inactivate` | JWT (ADMIN) | Inativar pesquisa |
| GET | `/surveys/:id/anonymous-link` | JWT (ADMIN, GESTOR) | Gerar link anônimo |
| GET | `/surveys/public/:token` | Não | Acesso público à pesquisa |
| POST | `/surveys/:id/answer` | JWT (ALUNO) | Responder pesquisa (autenticado) |
| POST | `/surveys/public/:token/answer` | Não | Responder pesquisa (anônimo) |

> A documentação completa e interativa está disponível em `http://localhost:3000/docs` após iniciar o backend.

## Banco de Dados

O projeto utiliza uma **arquitetura dual-banco**:

### PostgreSQL (Dados Relacionais)

| Tabela | Descrição |
|---|---|
| `users` | Contas de usuário (UUID, soft-delete) |
| `profiles` | Perfis de acesso |
| `user_profiles` | Relação muitos-para-muitos entre usuários e perfis |
| `campuses` | Campi do IFPE |
| `courses` | Cursos acadêmicos |
| `classes` | Turmas |
| `disciplines` | Disciplinas |
| `services` | Serviços oferecidos por campus |
| `audit_logs` | Trilha de auditoria automática |

### MongoDB (Dados de Pesquisa)

| Coleção | Descrição |
|---|---|
| `surveys` | Definições de pesquisas com questões embutidas |
| `answers` | Respostas das pesquisas |
| `access_tokens` | Tokens de acesso anônimo |

### Tipos de Questões Suportados

- `TEXT` — Resposta aberta em texto
- `SINGLE_CHOICE` — Escolha única
- `MULTIPLE_CHOICE` — Múltipla escolha
- `SCALE` — Escala de avaliação (ex: Likert)

## Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código

- Backend: Siga as convenções do NestJS e TypeScript
- Frontend: Siga as convenções do Next.js e ESLint
- Execute `npm run lint` antes de submeter alterações
- Utilize Conventional Commits para mensagens de commit

## Licença

Este projeto é de uso acadêmico do IFPE.
