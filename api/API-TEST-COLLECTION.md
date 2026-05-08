# Coleção de Testes da API

## Configuração Base

- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`
- **Autenticação**: JWT Bearer Token via `Authorization: Bearer <token>`

### Perfis e Credenciais Padrão (Seed)

| Perfil | Descrição |
|--------|-----------|
| `ALUNO` | Aluno da instituicao |
| `DOCENTE` | Professor |
| `TECNICO` | Servidor tecnico |
| `GESTOR` | Gestor academico |
| `ADMIN` | Administrador do sistema |

**Admin padrão**: `admin@email.com` / `admin123`

---

## Estrutura de Resposta Padrão

Todas as respostas seguem o formato `ApiResponseDto<T>`:

```json
{
  "success": true,
  "message": "Mensagem descritiva",
  "data": { ... },
  "errors": null
}
```

---

## Índice de Endpoints

| # | Método | Rota | Módulo |
|---|--------|------|--------|
| 1 | POST | `/auth/login` | Auth |
| 2 | POST | `/users` | Users |
| 3 | GET | `/users` | Users |
| 4 | GET | `/users/:id` | Users |
| 5 | PATCH | `/users/:id` | Users |
| 6 | PATCH | `/users/:id/inactivate` | Users |
| 7 | DELETE | `/users/:id` | Users |
| 8 | POST | `/campus` | Campus |
| 9 | GET | `/campus` | Campus |
| 10 | GET | `/campus/:id` | Campus |
| 11 | PATCH | `/campus/:id` | Campus |
| 12 | PATCH | `/campus/:id/inactivate` | Campus |
| 13 | DELETE | `/campus/:id` | Campus |
| 14 | POST | `/courses` | Courses |
| 15 | GET | `/courses` | Courses |
| 16 | GET | `/courses/:id` | Courses |
| 17 | PATCH | `/courses/:id` | Courses |
| 18 | PATCH | `/courses/:id/inactivate` | Courses |
| 19 | DELETE | `/courses/:id` | Courses |
| 20 | POST | `/classes` | Classes |
| 21 | GET | `/classes` | Classes |
| 22 | GET | `/classes/:id` | Classes |
| 23 | PATCH | `/classes/:id` | Classes |
| 24 | PATCH | `/classes/:id/inactivate` | Classes |
| 25 | DELETE | `/classes/:id` | Classes |
| 26 | POST | `/classes/:id/enroll` | Classes |
| 27 | GET | `/classes/:id/students` | Classes |
| 28 | DELETE | `/classes/:id/students/:userId` | Classes |
| 29 | POST | `/services` | Services |
| 30 | GET | `/services` | Services |
| 31 | GET | `/services/:id` | Services |
| 32 | PATCH | `/services/:id` | Services |
| 33 | PATCH | `/services/:id/inactivate` | Services |
| 34 | DELETE | `/services/:id` | Services |
| 35 | GET | `/surveys` | Surveys |
| 36 | POST | `/surveys` | Surveys |
| 37 | GET | `/surveys/:id` | Surveys |
| 38 | GET | `/surveys/public/:token` | Surveys |
| 39 | POST | `/surveys/:id/answer` | Surveys |
| 40 | POST | `/surveys/public/:token/answer` | Surveys |
| 41 | PATCH | `/surveys/:id` | Surveys |
| 42 | PATCH | `/surveys/:id/inactivate` | Surveys |
| 43 | GET | `/surveys/:id/anonymous-link` | Surveys |

---

# Módulo: Auth

## Autenticação

### POST `/auth/login` — Login

**Autenticação**: Nenhuma

#### ✅ Sucesso — Credenciais válidas
```json
// Request
{
  "email": "admin@email.com",
  "password": "admin123"
}

// Response 200
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "errors": null
}
```

#### ❌ Erro — Credenciais inválidas
```json
// Request
{
  "email": "admin@email.com",
  "password": "senha_errada"
}

// Response 401
{
  "success": false,
  "message": "Email ou senha inválidos",
  "data": null,
  "errors": ["Email ou senha inválidos"]
}
```

#### ❌ Erro — Validação (email vazio)
```json
// Request
{
  "email": "",
  "password": "admin123"
}

// Response 400
{
  "success": false,
  "message": "Erro de validação",
  "data": null,
  "errors": ["email must be an email"]
}
```

---

# Módulo: Users

## Requer perfil: `ADMIN`

### POST `/users` — Criar usuário

#### ✅ Sucesso
```json
// Request
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "profiles": [
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "b2c3d4e5-f6a7-8901-bcde-f12345678901"
  ]
}

// Response 201
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "name": "João Silva",
    "email": "joao@email.com",
    "profiles": ["ALUNO", "DOCENTE"]
  },
  "errors": null
}
```

#### ❌ Erro — Email duplicado
```json
// Request
{
  "name": "Outro João",
  "email": "joao@email.com",
  "password": "senha123",
  "profiles": ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"]
}

// Response 409
{
  "success": false,
  "message": "Email já está em uso",
  "data": null,
  "errors": ["Email já está em uso"]
}
```

#### ❌ Erro — Validação (campos obrigatórios)
```json
// Request
{
  "name": "",
  "email": "invalido",
  "password": "12",
  "profiles": []
}

// Response 400
{
  "success": false,
  "message": "Erro de validação",
  "data": null,
  "errors": [
    "name should not be empty",
    "email must be an email",
    "password must be longer than or equal to 6 characters",
    "profiles each must be a UUID"
  ]
}
```

#### ❌ Erro — Perfil não encontrado
```json
// Request
{
  "name": "Maria",
  "email": "maria@email.com",
  "password": "senha123",
  "profiles": ["00000000-0000-0000-0000-000000000000"]
}

// Response 400
{
  "success": false,
  "message": "Perfil(is) não encontrado(s)",
  "data": null,
  "errors": ["Perfil(is) não encontrado(s)"]
}
```

#### ❌ Erro — Perfil ADMIN não permitido
```json
// Request
{
  "name": "Novo Admin",
  "email": "novoadmin@email.com",
  "password": "senha123",
  "profiles": ["e5f6a7b8-c9d0-1234-efab-345678901234"]
}

// Response 400
{
  "success": false,
  "message": "Não é permitido atribuir o perfil ADMIN",
  "data": null,
  "errors": ["Não é permitido atribuir o perfil ADMIN"]
}
```

#### ❌ Erro — Perfis ALUNO e DOCENTE simultâneos
```json
// Request
{
  "name": "Maria",
  "email": "maria@email.com",
  "password": "senha123",
  "profiles": [
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "b2c3d4e5-f6a7-8901-bcde-f12345678901"
  ]
}

// Response 400
{
  "success": false,
  "message": "Não é permitido criar um usuário com os perfis ALUNO e DOCENTE simultaneamente",
  "data": null,
  "errors": ["Não é permitido criar um usuário com os perfis ALUNO e DOCENTE simultaneamente"]
}
```

#### ❌ Erro — Perfis ALUNO e GESTOR simultâneos
```json
// Request
{
  "name": "Pedro",
  "email": "pedro@email.com",
  "password": "senha123",
  "profiles": [
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "d4e5f6a7-b8c9-0123-defa-234567890123"
  ]
}

// Response 400
{
  "success": false,
  "message": "Não é permitido criar um usuário com os perfis ALUNO e GESTOR simultaneamente",
  "data": null,
  "errors": ["Não é permitido criar um usuário com os perfis ALUNO e GESTOR simultaneamente"]
}
```

#### ❌ Erro — Perfis ALUNO e TECNICO simultâneos
```json
// Request
{
  "name": "Ana",
  "email": "ana@email.com",
  "password": "senha123",
  "profiles": [
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "c3d4e5f6-a7b8-9012-cdef-123456789012"
  ]
}

// Response 400
{
  "success": false,
  "message": "Não é permitido criar um usuário com os perfis ALUNO e TECNICO simultaneamente",
  "data": null,
  "errors": ["Não é permitido criar um usuário com os perfis ALUNO e TECNICO simultaneamente"]
}
```

#### ❌ Erro — Perfis ALUNO e ADMIN simultâneos
```json
// Request
{
  "name": "Carlos",
  "email": "carlos@email.com",
  "password": "senha123",
  "profiles": [
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "e5f6a7b8-c9d0-1234-efab-345678901234"
  ]
}

// Response 400
{
  "success": false,
  "message": "Não é permitido atribuir o perfil ADMIN",
  "data": null,
  "errors": ["Não é permitido atribuir o perfil ADMIN"]
}
```

---

### GET `/users` — Listar usuários

#### ✅ Sucesso — Lista com registros
```json
// Response 200
{
  "success": true,
  "message": "Usuários encontrados",
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "name": "João Silva",
      "email": "joao@email.com",
      "profiles": ["ALUNO", "DOCENTE"]
    },
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Admin",
      "email": "admin@email.com",
      "profiles": ["ADMIN"]
    }
  ],
  "errors": null
}
```

#### ✅ Sucesso — Lista vazia
```json
// Response 200
{
  "success": true,
  "message": "Usuários encontrados",
  "data": [],
  "errors": null
}
```

---

### GET `/users/:id` — Buscar usuário por ID

#### ✅ Sucesso
```json
// Request params: id = "f47ac10b-58cc-4372-a567-0e02b2c3d479"

// Response 200
{
  "success": true,
  "message": "Usuário encontrado",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "name": "João Silva",
    "email": "joao@email.com",
    "profiles": ["ALUNO", "DOCENTE"]
  },
  "errors": null
}
```

#### ❌ Erro — Não encontrado
```json
// Request params: id = "00000000-0000-0000-0000-000000000000"
// Response 404
{
  "success": false,
  "message": "Usuário não encontrado",
  "data": null,
  "errors": ["Usuário não encontrado"]
}
```

---

### PATCH `/users/:id` — Atualizar usuário

#### ✅ Sucesso
```json
// Request params: id = "f47ac10b-58cc-4372-a567-0e02b2c3d479"
// Request
{
  "name": "João Silva Atualizado",
  "profiles": ["b2c3d4e5-f6a7-8901-bcde-f12345678901"]
}

// Response 200
{
  "success": true,
  "message": "Usuário atualizado com sucesso",
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "name": "João Silva Atualizado",
    "email": "joao@email.com",
    "profiles": ["DOCENTE"]
  },
  "errors": null
}
```

#### ❌ Erro — Não encontrado
```json
// Request params: id = "00000000-0000-0000-0000-000000000000"
// Request
{
  "name": "Teste"
}

// Response 404
{
  "success": false,
  "message": "Usuário não encontrado",
  "data": null,
  "errors": ["Usuário não encontrado"]
}
```

#### ❌ Erro — Perfil ADMIN não permitido
```json
// Request params: id = "f47ac10b-58cc-4372-a567-0e02b2c3d479"
// Request
{
  "profiles": ["e5f6a7b8-c9d0-1234-efab-345678901234"]
}

// Response 400
{
  "success": false,
  "message": "Não é permitido atribuir o perfil ADMIN",
  "data": null,
  "errors": ["Não é permitido atribuir o perfil ADMIN"]
}
```

#### ❌ Erro — Perfis ALUNO e DOCENTE simultâneos
```json
// Request params: id = "f47ac10b-58cc-4372-a567-0e02b2c3d479"
// Request
{
  "profiles": [
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "b2c3d4e5-f6a7-8901-bcde-f12345678901"
  ]
}

// Response 400
{
  "success": false,
  "message": "Não é permitido criar um usuário com os perfis ALUNO e DOCENTE simultaneamente",
  "data": null,
  "errors": ["Não é permitido criar um usuário com os perfis ALUNO e DOCENTE simultaneamente"]
}
```

---

### PATCH `/users/:id/inactivate` — Inativar usuário

#### ✅ Sucesso
```json
// Request params: id = "f47ac10b-58cc-4372-a567-0e02b2c3d479"

// Response 200
{
  "success": true,
  "message": "Usuário inativado com sucesso",
  "data": null,
  "errors": null
}
```

#### ❌ Erro — Não encontrado
```json
// Request params: id = "00000000-0000-0000-0000-000000000000"
// Response 404
{
  "success": false,
  "message": "Usuário não encontrado",
  "data": null,
  "errors": ["Usuário não encontrado"]
}
```

---

### DELETE `/users/:id` — Remover usuário (soft delete)

#### ✅ Sucesso
```json
// Request params: id = "f47ac10b-58cc-4372-a567-0e02b2c3d479"

// Response 200
{
  "success": true,
  "message": "Usuário removido com sucesso",
  "data": null,
  "errors": null
}
```

#### ❌ Erro — Não encontrado
```json
// Request params: id = "00000000-0000-0000-0000-000000000000"
// Response 404
{
  "success": false,
  "message": "Usuário não encontrado",
  "data": null,
  "errors": ["Usuário não encontrado"]
}
```

---

# Módulo: Campus

## Endpoints Públicos: `ALUNO`, `DOCENTE`, `TECNICO`, `GESTOR`, `ADMIN`
## Endpoints de Escrita: `ADMIN`

### POST `/campus` — Criar campus

#### ✅ Sucesso
```json
// Request
{
  "name": "Campus Recife",
  "code": "REC",
  "address": "Av.例, 1000 - Recife, PE"
}

// Response 201
{
  "success": true,
  "message": "Campus criado com sucesso",
  "data": {
    "id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "name": "Campus Recife",
    "code": "REC",
    "address": "Av.例, 1000 - Recife, PE",
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T10:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Validação
```json
// Request
{
  "name": "",
  "code": ""
}

// Response 400
{
  "success": false,
  "message": "Erro de validação",
  "data": null,
  "errors": [
    "name should not be empty",
    "code should not be empty"
  ]
}
```

---

### GET `/campus` — Listar campus

#### ✅ Sucesso
```json
// Response 200
{
  "success": true,
  "message": "Lista de campi",
  "data": [
    {
      "id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
      "name": "Campus Recife",
      "code": "REC",
      "address": "Av.例, 1000 - Recife, PE",
      "status": "ACTIVE",
      "created_at": "2026-05-08T10:00:00.000Z",
      "updated_at": "2026-05-08T10:00:00.000Z"
    }
  ],
  "errors": null
}
```

---

### GET `/campus/:id` — Buscar campus por ID

#### ✅ Sucesso
```json
// Request params: id = "c1d2e3f4-a5b6-7890-abcd-ef1234567890"

// Response 200
{
  "success": true,
  "message": "Campus encontrado",
  "data": {
    "id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "name": "Campus Recife",
    "code": "REC",
    "address": "Av.例, 1000 - Recife, PE",
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T10:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Não encontrado
```json
// Request params: id = "00000000-0000-0000-0000-000000000000"
// Response 404
{
  "success": false,
  "message": "Campus não encontrado",
  "data": null,
  "errors": ["Campus não encontrado"]
}
```

---

### PATCH `/campus/:id` — Atualizar campus

#### ✅ Sucesso
```json
// Request params: id = "c1d2e3f4-a5b6-7890-abcd-ef1234567890"
// Request
{
  "name": "Campus Recife - Sede"
}

// Response 200
{
  "success": true,
  "message": "Campus atualizado com sucesso",
  "data": {
    "id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "name": "Campus Recife - Sede",
    "code": "REC",
    "address": "Av.例, 1000 - Recife, PE",
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T11:00:00.000Z"
  },
  "errors": null
}
```

---

### PATCH `/campus/:id/inactivate` — Inativar campus

#### ✅ Sucesso
```json
// Request params: id = "c1d2e3f4-a5b6-7890-abcd-ef1234567890"

// Response 200
{
  "success": true,
  "message": "Campus inativado com sucesso",
  "data": {
    "id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "name": "Campus Recife - Sede",
    "code": "REC",
    "address": "Av.例, 1000 - Recife, PE",
    "status": "INACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T12:00:00.000Z"
  },
  "errors": null
}
```

---

### DELETE `/campus/:id` — Remover campus

#### ✅ Sucesso
```json
// Request params: id = "c1d2e3f4-a5b6-7890-abcd-ef1234567890"

// Response 200
{
  "success": true,
  "message": "Campus removido com sucesso",
  "data": null,
  "errors": null
}
```

---

# Módulo: Courses

## Endpoints de Leitura: `ADMIN`, `GESTOR`
## Endpoints de Escrita: `ADMIN`

### POST `/courses` — Criar curso

#### ✅ Sucesso
```json
// Request
{
  "name": "Engenharia de Software",
  "code": "ESW",
  "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890"
}

// Response 201
{
  "success": true,
  "message": "Curso criado com sucesso",
  "data": {
    "id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "name": "Engenharia de Software",
    "code": "ESW",
    "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T10:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Campus não encontrado
```json
// Request
{
  "name": "Curso Teste",
  "code": "TST",
  "campusId": "00000000-0000-0000-0000-000000000000"
}

// Response 404
{
  "success": false,
  "message": "Campus não encontrado",
  "data": null,
  "errors": ["Campus não encontrado"]
}
```

---

### GET `/courses` — Listar cursos

#### ✅ Sucesso
```json
// Response 200
{
  "success": true,
  "message": "Lista de cursos",
  "data": [
    {
      "id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
      "name": "Engenharia de Software",
      "code": "ESW",
      "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
      "status": "ACTIVE",
      "created_at": "2026-05-08T10:00:00.000Z",
      "updated_at": "2026-05-08T10:00:00.000Z"
    }
  ],
  "errors": null
}
```

---

### GET `/courses/:id` — Buscar curso por ID

#### ✅ Sucesso
```json
// Request params: id = "d4e5f6a7-b8c9-0123-def4-567890abcdef"

// Response 200
{
  "success": true,
  "message": "Curso encontrado",
  "data": {
    "id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "name": "Engenharia de Software",
    "code": "ESW",
    "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T10:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Não encontrado
```json
// Request params: id = "00000000-0000-0000-0000-000000000000"
// Response 404
{
  "success": false,
  "message": "Curso não encontrado",
  "data": null,
  "errors": ["Curso não encontrado"]
}
```

---

### PATCH `/courses/:id` — Atualizar curso

#### ✅ Sucesso
```json
// Request params: id = "d4e5f6a7-b8c9-0123-def4-567890abcdef"
// Request
{
  "name": "Engenharia de Software - EAD"
}

// Response 200
{
  "success": true,
  "message": "Curso atualizado com sucesso",
  "data": {
    "id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "name": "Engenharia de Software - EAD",
    "code": "ESW",
    "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T11:00:00.000Z"
  },
  "errors": null
}
```

---

### PATCH `/courses/:id/inactivate` — Inativar curso

#### ✅ Sucesso
```json
// Request params: id = "d4e5f6a7-b8c9-0123-def4-567890abcdef"

// Response 200
{
  "success": true,
  "message": "Curso inativado com sucesso",
  "data": {
    "id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "name": "Engenharia de Software - EAD",
    "code": "ESW",
    "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "status": "INACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T12:00:00.000Z"
  },
  "errors": null
}
```

---

### DELETE `/courses/:id` — Remover curso

#### ✅ Sucesso
```json
// Request params: id = "d4e5f6a7-b8c9-0123-def4-567890abcdef"

// Response 200
{
  "success": true,
  "message": "Curso removido com sucesso",
  "data": null,
  "errors": null
}
```

---

# Módulo: Classes

## Endpoints de Leitura: Todos os perfis
## Endpoints de Escrita/Alteração: `ADMIN`
## Endpoints de Listagem de Alunos: `ADMIN`, `GESTOR`, `DOCENTE`

### POST `/classes` — Criar turma

#### ✅ Sucesso
```json
// Request
{
  "name": "Turma A - Engenharia de Software",
  "code": "ESW-2026-A",
  "courseId": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
  "semester": 1,
  "year": 2026
}

// Response 201
{
  "success": true,
  "message": "Turma criada com sucesso",
  "data": {
    "id": "e5f6a7b8-c9d0-1234-ef56-7890abcdef12",
    "name": "Turma A - Engenharia de Software",
    "code": "ESW-2026-A",
    "courseId": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "courseName": "Engenharia de Software",
    "semester": 1,
    "year": 2026,
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T10:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Curso não encontrado
```json
// Request
{
  "name": "Turma Teste",
  "code": "TST-2026-A",
  "courseId": "00000000-0000-0000-0000-000000000000",
  "semester": 1,
  "year": 2026
}

// Response 404
{
  "success": false,
  "message": "Curso não encontrado",
  "data": null,
  "errors": ["Curso não encontrado"]
}
```

#### ❌ Erro — Validação de semestre
```json
// Request
{
  "name": "Turma Teste",
  "code": "TST-2026-B",
  "courseId": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
  "semester": 3,
  "year": 2026
}

// Response 400
{
  "success": false,
  "message": "Erro de validação",
  "data": null,
  "errors": ["Semestre inválido. Deve ser 1 ou 2"]
}
```

#### ❌ Erro — Turma duplicada
```json
// Request (mesmo nome, curso, semestre e ano)
{
  "name": "Turma A - Engenharia de Software",
  "code": "ESW-2026-A",
  "courseId": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
  "semester": 1,
  "year": 2026
}

// Response 409
{
  "success": false,
  "message": "Já existe uma turma com este nome para este curso, semestre e ano",
  "data": null,
  "errors": ["Já existe uma turma com este nome para este curso, semestre e ano"]
}
```

---

### GET `/classes` — Listar turmas

#### ✅ Sucesso
```json
// Response 200
{
  "success": true,
  "message": "Lista de turmas",
  "data": [
    {
      "id": "e5f6a7b8-c9d0-1234-ef56-7890abcdef12",
      "name": "Turma A - Engenharia de Software",
      "code": "ESW-2026-A",
      "courseId": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
      "courseName": "Engenharia de Software",
      "semester": 1,
      "year": 2026,
      "status": "ACTIVE",
      "created_at": "2026-05-08T10:00:00.000Z",
      "updated_at": "2026-05-08T10:00:00.000Z"
    }
  ],
  "errors": null
}
```

---

### GET `/classes/:id` — Buscar turma por ID

#### ✅ Sucesso
```json
// Request params: id = "e5f6a7b8-c9d0-1234-ef56-7890abcdef12"

// Response 200
{
  "success": true,
  "message": "Turma encontrada",
  "data": {
    "id": "e5f6a7b8-c9d0-1234-ef56-7890abcdef12",
    "name": "Turma A - Engenharia de Software",
    "code": "ESW-2026-A",
    "courseId": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "courseName": "Engenharia de Software",
    "semester": 1,
    "year": 2026,
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T10:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Não encontrado
```json
// Request params: id = "00000000-0000-0000-0000-000000000000"
// Response 404
{
  "success": false,
  "message": "Turma não encontrada",
  "data": null,
  "errors": ["Turma não encontrada"]
}
```

---

### PATCH `/classes/:id` — Atualizar turma

#### ✅ Sucesso
```json
// Request params: id = "e5f6a7b8-c9d0-1234-ef56-7890abcdef12"
// Request
{
  "name": "Turma A - ESW (Noturno)"
}

// Response 200
{
  "success": true,
  "message": "Turma atualizada com sucesso",
  "data": {
    "id": "e5f6a7b8-c9d0-1234-ef56-7890abcdef12",
    "name": "Turma A - ESW (Noturno)",
    "code": "ESW-2026-A",
    "courseId": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "courseName": "Engenharia de Software",
    "semester": 1,
    "year": 2026,
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T11:00:00.000Z"
  },
  "errors": null
}
```

---

### PATCH `/classes/:id/inactivate` — Inativar turma

#### ✅ Sucesso
```json
// Request params: id = "e5f6a7b8-c9d0-1234-ef56-7890abcdef12"

// Response 200
{
  "success": true,
  "message": "Turma inativada com sucesso",
  "data": {
    "id": "e5f6a7b8-c9d0-1234-ef56-7890abcdef12",
    "name": "Turma A - ESW (Noturno)",
    "code": "ESW-2026-A",
    "courseId": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "courseName": "Engenharia de Software",
    "semester": 1,
    "year": 2026,
    "status": "INACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T12:00:00.000Z"
  },
  "errors": null
}
```

---

### DELETE `/classes/:id` — Remover turma

#### ✅ Sucesso
```json
// Request params: id = "e5f6a7b8-c9d0-1234-ef56-7890abcdef12"

// Response 200
{
  "success": true,
  "message": "Turma removida com sucesso",
  "data": null,
  "errors": null
}
```

---

### POST `/classes/:id/enroll` — Matricular aluno

#### ✅ Sucesso
```json
// Request params: id = "e5f6a7b8-c9d0-1234-ef56-7890abcdef12"
// Request
{
  "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}

// Response 201
{
  "success": true,
  "message": "Aluno matriculado com sucesso",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "userName": "João Silva",
    "userEmail": "joao@email.com",
    "classId": "e5f6a7b8-c9d0-1234-ef56-7890abcdef12",
    "className": "Turma A - ESW (Noturno)",
    "status": "ACTIVE",
    "enrolled_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T10:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Usuário não encontrado
```json
// Request params: id = "e5f6a7b8-c9d0-1234-ef56-7890abcdef12"
// Request
{
  "userId": "00000000-0000-0000-0000-000000000000"
}

// Response 404
{
  "success": false,
  "message": "Usuário não encontrado",
  "data": null,
  "errors": ["Usuário não encontrado"]
}
```

#### ❌ Erro — Usuário não possui perfil ALUNO
```json
// Request params: id = "e5f6a7b8-c9d0-1234-ef56-7890abcdef12"
// Request
{
  "userId": "id-do-admin"
}

// Response 400
{
  "success": false,
  "message": "Usuário não possui perfil de aluno",
  "data": null,
  "errors": ["Usuário não possui perfil de aluno"]
}
```

#### ❌ Erro — Matrícula duplicada
```json
// Request params: id = "e5f6a7b8-c9d0-1234-ef56-7890abcdef12"
// Request
{
  "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}

// Response 409
{
  "success": false,
  "message": "Aluno já matriculado nesta turma",
  "data": null,
  "errors": ["Aluno já matriculado nesta turma"]
}
```

#### ❌ Erro — Turma inativa
```json
// Request params: id = "id-da-turma-inativa"
// Request
{
  "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}

// Response 400
{
  "success": false,
  "message": "Não é possível matricular em uma turma inativa",
  "data": null,
  "errors": ["Não é possível matricular em uma turma inativa"]
}
```

---

### GET `/classes/:id/students` — Listar alunos da turma

#### ✅ Sucesso
```json
// Request params: id = "e5f6a7b8-c9d0-1234-ef56-7890abcdef12"

// Response 200
{
  "success": true,
  "message": "Alunos da turma",
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "userName": "João Silva",
      "userEmail": "joao@email.com",
      "classId": "e5f6a7b8-c9d0-1234-ef56-7890abcdef12",
      "className": "Turma A - ESW (Noturno)",
      "status": "ACTIVE",
      "enrolled_at": "2026-05-08T10:00:00.000Z",
      "updated_at": "2026-05-08T10:00:00.000Z"
    }
  ],
  "errors": null
}
```

#### ✅ Sucesso — Lista vazia
```json
// Request params: id = "e5f6a7b8-c9d0-1234-ef56-7890abcdef12"

// Response 200
{
  "success": true,
  "message": "Alunos da turma",
  "data": [],
  "errors": null
}
```

---

### DELETE `/classes/:id/students/:userId` — Remover aluno da turma

#### ✅ Sucesso
```json
// Request params: id = "e5f6a7b8-c9d0-1234-ef56-7890abcdef12", userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479"

// Response 200
{
  "success": true,
  "message": "Aluno removido da turma com sucesso",
  "data": null,
  "errors": null
}
```

---

# Módulo: Services

## Endpoints de Leitura: Todos os perfis
## Endpoints de Escrita: `ADMIN`

### POST `/services` — Criar serviço

#### ✅ Sucesso
```json
// Request
{
  "name": "Atendimento Psicológico",
  "description": "Atendimento psicológico gratuito para alunos",
  "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890"
}

// Response 201
{
  "success": true,
  "message": "Serviço criado com sucesso",
  "data": {
    "id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
    "name": "Atendimento Psicológico",
    "description": "Atendimento psicológico gratuito para alunos",
    "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "campusName": "Campus Recife",
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T10:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Campus não encontrado
```json
// Request
{
  "name": "Serviço Teste",
  "campusId": "00000000-0000-0000-0000-000000000000"
}

// Response 404
{
  "success": false,
  "message": "Campus não encontrado",
  "data": null,
  "errors": ["Campus não encontrado"]
}
```

#### ❌ Erro — Nome duplicado no mesmo campus
```json
// Request
{
  "name": "Atendimento Psicológico",
  "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890"
}

// Response 409
{
  "success": false,
  "message": "Já existe um serviço com este nome para este campus",
  "data": null,
  "errors": ["Já existe um serviço com este nome para este campus"]
}
```

---

### GET `/services` — Listar serviços

#### ✅ Sucesso
```json
// Response 200
{
  "success": true,
  "message": "Lista de serviços",
  "data": [
    {
      "id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
      "name": "Atendimento Psicológico",
      "description": "Atendimento psicológico gratuito para alunos",
      "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
      "campusName": "Campus Recife",
      "status": "ACTIVE",
      "created_at": "2026-05-08T10:00:00.000Z",
      "updated_at": "2026-05-08T10:00:00.000Z"
    }
  ],
  "errors": null
}
```

---

### GET `/services/:id` — Buscar serviço por ID

#### ✅ Sucesso
```json
// Request params: id = "f6a7b8c9-d0e1-2345-ef67-8901abcdef23"

// Response 200
{
  "success": true,
  "message": "Serviço encontrado",
  "data": {
    "id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
    "name": "Atendimento Psicológico",
    "description": "Atendimento psicológico gratuito para alunos",
    "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "campusName": "Campus Recife",
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T10:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Não encontrado
```json
// Request params: id = "00000000-0000-0000-0000-000000000000"
// Response 404
{
  "success": false,
  "message": "Serviço não encontrado",
  "data": null,
  "errors": ["Serviço não encontrado"]
}
```

---

### PATCH `/services/:id` — Atualizar serviço

#### ✅ Sucesso
```json
// Request params: id = "f6a7b8c9-d0e1-2345-ef67-8901abcdef23"
// Request
{
  "description": "Atendimento psicológico atualizado"
}

// Response 200
{
  "success": true,
  "message": "Serviço atualizado com sucesso",
  "data": {
    "id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
    "name": "Atendimento Psicológico",
    "description": "Atendimento psicológico atualizado",
    "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "campusName": "Campus Recife",
    "status": "ACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T11:00:00.000Z"
  },
  "errors": null
}
```

---

### PATCH `/services/:id/inactivate` — Inativar serviço

#### ✅ Sucesso
```json
// Request params: id = "f6a7b8c9-d0e1-2345-ef67-8901abcdef23"

// Response 200
{
  "success": true,
  "message": "Serviço inativado com sucesso",
  "data": {
    "id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
    "name": "Atendimento Psicológico",
    "description": "Atendimento psicológico atualizado",
    "campusId": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "campusName": "Campus Recife",
    "status": "INACTIVE",
    "created_at": "2026-05-08T10:00:00.000Z",
    "updated_at": "2026-05-08T12:00:00.000Z"
  },
  "errors": null
}
```

---

### DELETE `/services/:id` — Remover serviço

#### ✅ Sucesso
```json
// Request params: id = "f6a7b8c9-d0e1-2345-ef67-8901abcdef23"

// Response 200
{
  "success": true,
  "message": "Serviço removido com sucesso",
  "data": null,
  "errors": null
}
```

---

# Módulo: Surveys

## Endpoints de Leitura/Listagem: `ADMIN`, `GESTOR`
## Endpoints de Criação/Atualização: `ADMIN`, `GESTOR`
## Endpoints de Resposta Autenticada: `ALUNO`
## Endpoints de Exclusão: `ADMIN`
## Endpoints Públicos: Sem autenticação

### GET `/surveys` — Listar pesquisas (com filtros e paginação)

#### ✅ Sucesso — Sem filtros
```json
// Request query: page=1&limit=10

// Response 200
{
  "success": true,
  "message": "Lista de pesquisas",
  "data": {
    "data": [
      {
        "_id": "661e8c8f4a5b6c7d8e9f0a1b",
        "title": "Pesquisa de Satisfação - Serviço Psicológico",
        "description": "Avalie o atendimento psicológico",
        "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
        "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
        "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
        "is_anonymous": true,
        "active": true,
        "deleted": false,
        "createdAt": "2026-05-08T10:00:00.000Z",
        "updatedAt": "2026-05-08T10:00:00.000Z"
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "last_page": 1
    }
  },
  "errors": null
}
```

#### ✅ Sucesso — Com filtros
```json
// Request query: campus_id=c1d2e3f4-a5b6-7890-abcd-ef1234567890&service_id=f6a7b8c9-d0e1-2345-ef67-8901abcdef23&page=1&limit=10

// Response 200
{
  "success": true,
  "message": "Lista de pesquisas",
  "data": {
    "data": [ /* surveys filtrados */ ],
    "meta": {
      "total": 1,
      "page": 1,
      "last_page": 1
    }
  },
  "errors": null
}
```

#### ✅ Sucesso — Lista vazia
```json
// Request query: page=1&limit=10

// Response 200
{
  "success": true,
  "message": "Lista de pesquisas",
  "data": {
    "data": [],
    "meta": {
      "total": 0,
      "page": 1,
      "last_page": 0
    }
  },
  "errors": null
}
```

---

### POST `/surveys` — Criar pesquisa

#### ✅ Sucesso — Pesquisa anônima
```json
// Request
{
  "title": "Pesquisa de Satisfação - Serviço Psicológico",
  "description": "Avalie o atendimento psicológico",
  "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
  "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
  "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
  "is_anonymous": true,
  "start_date": "08-05-2026 10:00",
  "end_date": "08-06-2026 23:59",
  "questions": [
    {
      "title": "Como você avalia o atendimento?",
      "type": "SINGLE_CHOICE",
      "required": true,
      "options": [
        { "label": "Excelente", "value": "excelente" },
        { "label": "Bom", "value": "bom" },
        { "label": "Regular", "value": "regular" },
        { "label": "Ruim", "value": "ruim" }
      ]
    },
    {
      "title": "Deixe seu comentário",
      "type": "TEXT",
      "required": false
    },
    {
      "title": "Nota para o serviço",
      "type": "SCALE",
      "required": true,
      "scale": {
        "min": 0,
        "max": 10
      }
    },
    {
      "title": "Quais canais você utilizou?",
      "type": "MULTIPLE_CHOICE",
      "required": false,
      "options": [
        { "label": "Presencial", "value": "presencial" },
        { "label": "Online", "value": "online" },
        { "label": "Telefone", "value": "telefone" }
      ]
    }
  ]
}

// Response 201
{
  "success": true,
  "message": "Survey criado",
  "data": {
    "survey": {
      "_id": "661e8c8f4a5b6c7d8e9f0a1b",
      "title": "Pesquisa de Satisfação - Serviço Psicológico",
      "description": "Avalie o atendimento psicológico",
      "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
      "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
      "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
      "is_anonymous": true,
      "active": true,
      "deleted": false,
      "start_date": "2026-05-08T10:00:00.000Z",
      "end_date": "2026-06-08T23:59:00.000Z",
      "questions": [
        {
          "title": "Como você avalia o atendimento?",
          "type": "SINGLE_CHOICE",
          "required": true,
          "options": [
            { "label": "Excelente", "value": "excelente" },
            { "label": "Bom", "value": "bom" },
            { "label": "Regular", "value": "regular" },
            { "label": "Ruim", "value": "ruim" }
          ],
          "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        }
      ],
      "createdAt": "2026-05-08T10:00:00.000Z",
      "updatedAt": "2026-05-08T10:00:00.000Z"
    },
    "anonymous_link": "/surveys/public/550e8400-e29b-41d4-a716-446655440000"
  },
  "errors": null
}
```

#### ✅ Sucesso — Pesquisa não anônima (sem link)
```json
// Request
{
  "title": "Pesquisa de Satisfação - Docentes",
  "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
  "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
  "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
  "is_anonymous": false,
  "start_date": "08-05-2026 10:00",
  "end_date": "08-06-2026 23:59",
  "questions": [
    {
      "title": "Qual seu nível de satisfação?",
      "type": "SINGLE_CHOICE",
      "required": true,
      "options": [
        { "label": "Satisfeito", "value": "satisfeito" },
        { "label": "Insatisfeito", "value": "insatisfeito" }
      ]
    }
  ]
}

// Response 201
{
  "success": true,
  "message": "Survey criado",
  "data": {
    "survey": {
      "_id": "772e9d9a5b6c7d8e9f0a2b3c",
      "title": "Pesquisa de Satisfação - Docentes",
      "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
      "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
      "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
      "is_anonymous": false,
      "active": true,
      "deleted": false,
      "start_date": "2026-05-08T10:00:00.000Z",
      "end_date": "2026-06-08T23:59:00.000Z",
      "questions": [],
      "createdAt": "2026-05-08T10:00:00.000Z",
      "updatedAt": "2026-05-08T10:00:00.000Z"
    },
    "anonymous_link": null
  },
  "errors": null
}
```

#### ❌ Erro — Campus não encontrado
```json
// Request
{
  "title": "Pesquisa Teste",
  "campus_id": "00000000-0000-0000-0000-000000000000",
  "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
  "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
  "is_anonymous": false,
  "start_date": "08-06-2026 10:00",
  "end_date": "08-07-2026 23:59",
  "questions": []
}

// Response 400
{
  "success": false,
  "message": "Campus nao encontrado",
  "data": null,
  "errors": ["Campus nao encontrado"]
}
```

#### ❌ Erro — Curso não encontrado
```json
// Request
{
  "title": "Pesquisa Teste",
  "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
  "course_id": "00000000-0000-0000-0000-000000000000",
  "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
  "is_anonymous": false,
  "start_date": "08-06-2026 10:00",
  "end_date": "08-07-2026 23:59",
  "questions": []
}

// Response 400
{
  "success": false,
  "message": "Curso nao encontrado",
  "data": null,
  "errors": ["Curso nao encontrado"]
}
```

#### ❌ Erro — Serviço não encontrado
```json
// Request
{
  "title": "Pesquisa Teste",
  "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
  "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
  "service_id": "00000000-0000-0000-0000-000000000000",
  "is_anonymous": false,
  "start_date": "08-06-2026 10:00",
  "end_date": "08-07-2026 23:59",
  "questions": []
}

// Response 400
{
  "success": false,
  "message": "Serviço nao encontrado",
  "data": null,
  "errors": ["Serviço nao encontrado"]
}
```

#### ❌ Erro — Data inválida (início no passado)
```json
// Request
{
  "title": "Pesquisa Teste",
  "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
  "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
  "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
  "is_anonymous": false,
  "start_date": "01-01-2020 10:00",
  "end_date": "08-07-2026 23:59",
  "questions": []
}

// Response 400
{
  "success": false,
  "message": "A data/hora de início não pode ser menor que a atual",
  "data": null,
  "errors": ["A data/hora de início não pode ser menor que a atual"]
}
```

#### ❌ Erro — Data inválida (término antes do início)
```json
// Request
{
  "title": "Pesquisa Teste",
  "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
  "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
  "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
  "is_anonymous": false,
  "start_date": "08-06-2026 10:00",
  "end_date": "08-05-2026 23:59",
  "questions": []
}

// Response 400
{
  "success": false,
  "message": "A data/hora de término não pode ser menor que a inicial",
  "data": null,
  "errors": ["A data/hora de término não pode ser menor que a inicial"]
}
```

#### ❌ Erro — Validação de campos
```json
// Request
{
  "title": "",
  "campus_id": "não-e-uuid",
  "course_id": "",
  "service_id": "",
  "is_anonymous": "nao-booleano",
  "start_date": "invalido",
  "end_date": "invalido",
  "questions": "não-é-array"
}

// Response 400
{
  "success": false,
  "message": "Erro de validação",
  "data": null,
  "errors": [
    "title should not be empty",
    "campus_id must be a UUID",
    "course_id must be a UUID",
    "course_id should not be empty",
    "service_id must be a UUID",
    "service_id should not be empty",
    "is_anonymous must be a boolean value",
    "start_date must match /^\\d{2}-\\d{2}-\\d{4} \\d{2}:\\d{2}$/ regular expression",
    "end_date must match /^\\d{2}-\\d{2}-\\d{4} \\d{2}:\\d{2}$/ regular expression",
    "questions must be an array"
  ]
}
```

---

### GET `/surveys/:id` — Buscar pesquisa por ID

#### ✅ Sucesso
```json
// Request params: id = "661e8c8f4a5b6c7d8e9f0a1b"

// Response 200
{
  "success": true,
  "message": "Survey encontrada",
  "data": {
    "_id": "661e8c8f4a5b6c7d8e9f0a1b",
    "title": "Pesquisa de Satisfação - Serviço Psicológico",
    "description": "Avalie o atendimento psicológico",
    "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
    "is_anonymous": true,
    "active": true,
    "deleted": false,
    "start_date": "2026-05-08T10:00:00.000Z",
    "end_date": "2026-06-08T23:59:00.000Z",
    "questions": [],
    "createdAt": "2026-05-08T10:00:00.000Z",
    "updatedAt": "2026-05-08T10:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Não encontrado
```json
// Request params: id = "000000000000000000000000"
// Response 404
{
  "success": false,
  "message": "Survey não encontrado",
  "data": null,
  "errors": ["Survey não encontrado"]
}
```

---

### GET `/surveys/public/:token` — Buscar pesquisa pública por token

#### ✅ Sucesso
```json
// Request params: token = "550e8400-e29b-41d4-a716-446655440000"

// Response 200
{
  "success": true,
  "message": "Survey público",
  "data": {
    "_id": "661e8c8f4a5b6c7d8e9f0a1b",
    "title": "Pesquisa de Satisfação - Serviço Psicológico",
    "description": "Avalie o atendimento psicológico",
    "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
    "is_anonymous": true,
    "active": true,
    "questions": [ /* perguntas completas */ ],
    "start_date": "2026-05-08T10:00:00.000Z",
    "end_date": "2026-06-08T23:59:00.000Z",
    "createdAt": "2026-05-08T10:00:00.000Z",
    "updatedAt": "2026-05-08T10:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Token inválido/expirado
```json
// Request params: token = "00000000-0000-0000-0000-000000000000"
// Response 404
{
  "success": false,
  "message": "Link inválido ou expirado",
  "data": null,
  "errors": ["Link inválido ou expirado"]
}
```

---

### POST `/surveys/:id/answer` — Responder pesquisa (autenticado)

#### ✅ Sucesso
```json
// Request params: id = "772e9d9a5b6c7d8e9f0a2b3c"
// Auth: Bearer token (ALUNO)
// Request
{
  "responses": [
    {
      "question_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "answer": "satisfeito"
    }
  ]
}

// Response 201
{
  "success": true,
  "message": "Resposta registrada",
  "data": {
    "survey_id": "772e9d9a5b6c7d8e9f0a2b3c",
    "user_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "responses": [
      {
        "question_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "answer": "satisfeito"
      }
    ],
    "_id": "883f0e0b6c7d8e9f0a3b4c5d"
  },
  "errors": null
}
```

#### ❌ Erro — Pesquisa já encerrada
```json
// Request params: id = "id-da-pesquisa-encerrada"
// Request
{
  "responses": []
}

// Response 400
{
  "success": false,
  "message": "Esta pesquisa está encerrada e não aceita mais respostas",
  "data": null,
  "errors": ["Esta pesquisa está encerrada e não aceita mais respostas"]
}
```

#### ❌ Erro — Já respondeu (pesquisa não anônima)
```json
// Request params: id = "772e9d9a5b6c7d8e9f0a2b3c"
// Auth: mesmo aluno que já respondeu
// Request
{
  "responses": []
}

// Response 400
{
  "success": false,
  "message": "Você já respondeu esta pesquisa",
  "data": null,
  "errors": ["Você já respondeu esta pesquisa"]
}
```

#### ❌ Erro — Questão obrigatória não respondida
```json
// Request params: id = "772e9d9a5b6c7d8e9f0a2b3c"
// Request
{
  "responses": []
}

// Response 400
{
  "success": false,
  "message": "A questão \"Qual seu nível de satisfação?\" é obrigatória",
  "data": null,
  "errors": ["A questão \"Qual seu nível de satisfação?\" é obrigatória"]
}
```

#### ❌ Erro — Questão não pertence à pesquisa
```json
// Request params: id = "772e9d9a5b6c7d8e9f0a2b3c"
// Request
{
  "responses": [
    {
      "question_id": "00000000-0000-0000-0000-000000000000",
      "answer": "teste"
    }
  ]
}

// Response 400
{
  "success": false,
  "message": "Questão 00000000-0000-0000-0000-000000000000 não pertence à pesquisa",
  "data": null,
  "errors": ["Questão 00000000-0000-0000-0000-000000000000 não pertence à pesquisa"]
}
```

#### ❌ Erro — Tipo de resposta inválido (SINGLE_CHOICE)
```json
// Request params: id = "772e9d9a5b6c7d8e9f0a2b3c"
// Request
{
  "responses": [
    {
      "question_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "answer": "opcao_invalida"
    }
  ]
}

// Response 400
{
  "success": false,
  "message": "Opção inválida para \"Qual seu nível de satisfação?\"",
  "data": null,
  "errors": ["Opção inválida para \"Qual seu nível de satisfação?\""]
}
```

---

### POST `/surveys/public/:token/answer` — Responder pesquisa anônima

#### ✅ Sucesso
```json
// Request params: token = "550e8400-e29b-41d4-a716-446655440000"
// Request
{
  "responses": [
    {
      "question_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "answer": "excelente"
    }
  ]
}

// Response 201
{
  "success": true,
  "message": "Resposta registrada",
  "data": {
    "survey_id": "661e8c8f4a5b6c7d8e9f0a1b",
    "user_id": null,
    "responses": [
      {
        "question_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "answer": "excelente"
      }
    ],
    "_id": "994f1f1c7d8e9f0a4b5c6d7e"
  },
  "errors": null
}
```

#### ❌ Erro — Token inválido
```json
// Request params: token = "00000000-0000-0000-0000-000000000000"
// Request
{
  "responses": []
}

// Response 404
{
  "success": false,
  "message": "Link inválido ou expirado",
  "data": null,
  "errors": ["Link inválido ou expirado"]
}
```

---

### PATCH `/surveys/:id` — Atualizar pesquisa

#### ✅ Sucesso
```json
// Request params: id = "661e8c8f4a5b6c7d8e9f0a1b"
// Request
{
  "title": "Pesquisa de Satisfação - Serviço Psicológico (Atualizada)"
}

// Response 200
{
  "success": true,
  "message": "Pesquisa atualizada",
  "data": {
    "_id": "661e8c8f4a5b6c7d8e9f0a1b",
    "title": "Pesquisa de Satisfação - Serviço Psicológico (Atualizada)",
    "description": "Avalie o atendimento psicológico",
    "campus_id": "c1d2e3f4-a5b6-7890-abcd-ef1234567890",
    "course_id": "d4e5f6a7-b8c9-0123-def4-567890abcdef",
    "service_id": "f6a7b8c9-d0e1-2345-ef67-8901abcdef23",
    "is_anonymous": true,
    "active": true,
    "start_date": "2026-05-08T10:00:00.000Z",
    "end_date": "2026-06-08T23:59:00.000Z",
    "questions": [],
    "createdAt": "2026-05-08T10:00:00.000Z",
    "updatedAt": "2026-05-08T12:00:00.000Z"
  },
  "errors": null
}
```

#### ❌ Erro — Não encontrado
```json
// Request params: id = "000000000000000000000000"
// Request
{
  "title": "Teste"
}

// Response 404
{
  "success": false,
  "message": "Survey não encontrado",
  "data": null,
  "errors": ["Survey não encontrado"]
}
```

---

### PATCH `/surveys/:id/inactivate` — Inativar pesquisa (soft delete)

#### ✅ Sucesso
```json
// Request params: id = "661e8c8f4a5b6c7d8e9f0a1b"

// Response 200
{
  "success": true,
  "message": "Pesquisa inativada",
  "data": null,
  "errors": null
}
```

#### ❌ Erro — Não encontrado
```json
// Request params: id = "000000000000000000000000"
// Response 404
{
  "success": false,
  "message": "Survey não encontrado",
  "data": null,
  "errors": ["Survey não encontrado"]
}
```

---

### GET `/surveys/:id/anonymous-link` — Obter link anônimo

#### ✅ Sucesso
```json
// Request params: id = "661e8c8f4a5b6c7d8e9f0a1b"

// Response 200
{
  "success": true,
  "message": "Link recuperado",
  "data": {
    "anonymous_link": "/surveys/public/550e8400-e29b-41d4-a716-446655440000"
  },
  "errors": null
}
```

#### ❌ Erro — Pesquisa não é anônima
```json
// Request params: id = "772e9d9a5b6c7d8e9f0a2b3c"
// Response 400
{
  "success": false,
  "message": "Esta pesquisa não é anônima",
  "data": null,
  "errors": ["Esta pesquisa não é anônima"]
}
```

#### ❌ Erro — Pesquisa não encontrada
```json
// Request params: id = "000000000000000000000000"
// Response 404
{
  "success": false,
  "message": "Survey não encontrado",
  "data": null,
  "errors": ["Survey não encontrado"]
}
```

---

# Fluxos de Teste Completo (Ordem Sugerida)

## Fluxo 1: Administrativo (CRUD base)

```
1. POST /auth/login                      → Obter token ADMIN
2. POST /campus                          → Criar campus
3. POST /courses                         → Criar curso (usa campusId)
4. POST /services                        → Criar serviço (usa campusId)
5. POST /classes                         → Criar turma (usa courseId)
6. POST /users                           → Criar aluno
7. POST /classes/:id/enroll              → Matricular aluno
8. POST /surveys                         → Criar pesquisa (usa campusId, courseId, serviceId)
9. GET  /surveys                         → Listar pesquisas
```

## Fluxo 2: Resposta à Pesquisa

```
10. POST /auth/login                     → Login como ALUNO
11. POST /surveys/:id/answer             → Responder pesquisa
```

## Fluxo 3: Pesquisa Anônima

```
12. POST /surveys                        → Criar pesquisa anônima
13. GET  /surveys/:id/anonymous-link     → Obter link público
14. GET  /surveys/public/:token          → Acessar pesquisa pública
15. POST /surveys/public/:token/answer   → Responder anonimamente
```

## Fluxo 4: Inativações

```
16. PATCH /surveys/:id/inactivate       → Inativar pesquisa
17. PATCH /classes/:id/inactivate       → Inativar turma
18. PATCH /courses/:id/inactivate       → Inativar curso
19. PATCH /campus/:id/inactivate        → Inativar campus
20. PATCH /users/:id/inactivate         → Inativar usuário
```

---

# Códigos de Status HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Sucesso em GET, PATCH, DELETE |
| 201 | Created | Sucesso em POST |
| 400 | Bad Request | Erro de validação ou regra de negócio |
| 401 | Unauthorized | Token ausente ou inválido |
| 403 | Forbidden | Perfil sem permissão |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Duplicidade (email, matrícula, etc.) |
| 500 | Internal Server Error | Erro inesperado no servidor |

---

# Headers de Autenticação

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```
