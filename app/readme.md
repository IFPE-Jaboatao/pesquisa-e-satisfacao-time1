# App - Frontend

Interface web do sistema de Pesquisa e Satisfação do IFPE, construída com **Next.js 16** e **React 19**.

## Descrição

Frontend em desenvolvimento para o sistema de pesquisa de satisfação. A aplicação consumirá a API REST do backend (`api/`) para fornecer uma interface interativa para:

- Autenticação de usuários
- Gestão de pesquisas
- Resposta a pesquisas (autenticado e anônimo)
- Visualização de resultados
- Gestão de catálogo acadêmico (campi, cursos, etc.)

## Tecnologias

| Categoria | Tecnologia |
|---|---|
| Framework | Next.js 16 |
| UI Library | React 19 |
| Estilização | Tailwind CSS 4 |
| Linguagem | TypeScript 5 |
| Linting | ESLint 9 (eslint-config-next) |

## Pré-requisitos

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Backend** rodando em `http://localhost:3000` (ver [api/README.md](../api/README.md))

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000` (ou outra porta se 3000 estiver em uso).

## Produção

```bash
# Build para produção
npm run build

# Iniciar servidor de produção
npm run start
```

## Code Style

```bash
# Executar linting
npm run lint
```

## Estrutura do Projeto

```
app/
├── next.config.ts        # Configuração do Next.js
├── tsconfig.json         # Configuração do TypeScript
├── postcss.config.mjs    # Configuração do PostCSS/Tailwind
├── eslint.config.mjs     # Configuração do ESLint
├── package.json          # Dependências e scripts
└── readme.md             # Este arquivo
```

> **Nota**: A estrutura de fonte (`app/`, `components/`, etc.) será definida conforme o desenvolvimento da aplicação.

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload |
| `npm run build` | Compila a aplicação para produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o ESLint para verificar problemas |

## Configuração de Ambiente

Crie um arquivo `.env.local` na raiz do projeto para configurar variáveis de ambiente:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

| Variável | Descrição | Padrão |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API backend | `http://localhost:3000` |

## Arquitetura Planejada

A aplicação seguirá as convenções do Next.js App Router:

```
app/
├── (auth)/              # Grupo de rotas de autenticação
│   ├── login/           # Página de login
│   └── ...
├── (dashboard)/         # Grupo de rotas do painel administrativo
│   ├── surveys/         # Gestão de pesquisas
│   ├── users/           # Gestão de usuários
│   ├── campus/          # Gestão de campi
│   ├── courses/         # Gestão de cursos
│   └── ...
├── (public)/            # Rotas públicas
│   ├── survey/[token]/  # Resposta anônima a pesquisa
│   └── ...
├── api/                 # API routes (se necessário)
├── components/          # Componentes reutilizáveis
│   ├── ui/              # Componentes de UI base
│   ├── forms/           # Componentes de formulário
│   └── layout/          # Componentes de layout
├── hooks/               # Custom React hooks
├── lib/                 # Utilitários e configurações
│   ├── api.ts           # Cliente API
│   └── utils.ts         # Funções utilitárias
├── types/               # Definições de tipos TypeScript
└── providers/           # Context providers
```

## Integração com a API

A comunicação com o backend será feita via fetch/axios, com:

- **Autenticação**: Token JWT armazenado em httpOnly cookies ou localStorage
- **Interceptors**: Refresh token automático quando expirado
- **Tipagem**: Tipos TypeScript gerados a partir dos DTOs do backend
- **Tratamento de erros**: Mensagens amigáveis para o usuário

## Endpoints da API

A documentação completa da API está disponível em:
- **Swagger UI**: `http://localhost:3000/docs` (backend rodando)
- **README do backend**: [../api/README.md](../api/README.md)

## Contribuindo

1. Siga o padrão de componentes do Next.js (Server Components por padrão)
2. Utilize Tailwind CSS para estilização
3. Mantenha componentes pequenos e reutilizáveis
4. Execute `npm run lint` antes de commitar

## Recursos Úteis

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do React](https://react.dev/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
