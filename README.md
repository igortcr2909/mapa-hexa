# COOPA — O Encontro das Torcidas ⚽🏆

Plataforma de eventos da Copa do Mundo 2026 em Florianópolis.

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Java 17 + Spring Boot 3.3.5 + Spring Security + JWT |
| Banco | MongoDB 7 |
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Infra | Docker + Docker Compose |

## Como rodar localmente

### Pré-requisitos

- Java 17+
- Maven 3.9+
- Node.js 20+
- Docker + Docker Compose

---

### Opção 1 — Docker Compose (recomendado)

```bash
cp .env.example .env
# Edite o .env com um JWT_SECRET forte

docker-compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:8080
- Swagger: http://localhost:8080/api/swagger-ui.html

---

### Opção 2 — Dev local separado

**Backend:**

```bash
cd backend

# MongoDB via Docker (se não tiver local):
docker run -d -p 27017:27017 --name mongo mongo:7

# Rodar aplicação:
./mvnw spring-boot:run
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:5173
```

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `JWT_SECRET` | (obrigatório em prod) | Chave JWT, mínimo 64 chars |
| `SPRING_DATA_MONGODB_URI` | `mongodb://localhost:27017` | URI do MongoDB |
| `APP_CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Origens CORS permitidas |

---

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastrar usuário |
| POST | `/api/auth/login` | Login |
| GET | `/api/users/me` | Perfil do usuário logado |
| PUT | `/api/users/me` | Atualizar perfil |
| GET | `/api/eventos` | Listar eventos ativos |
| POST | `/api/eventos` | Criar evento |
| GET | `/api/eventos/:id` | Detalhes do evento |
| POST | `/api/eventos/:id/inscricao` | Confirmar presença |
| DELETE | `/api/eventos/:id/inscricao` | Cancelar presença |
| GET | `/api/eventos/:id/mural` | Mensagens do mural |
| POST | `/api/eventos/:id/mural` | Publicar no mural |

Documentação completa: `http://localhost:8080/api/swagger-ui.html`

---

## Critérios de avaliação cobertos

- Autenticação JWT em todas as rotas protegidas
- Cadastro de usuários com validação
- Atualização cadastral (`PUT /api/users/me`)
- Persistência MongoDB (users, eventos, inscrições, mural)
- Compartilhamento: eventos visíveis a todos + inscrições + mural
- Responsividade: Tailwind mobile-first
- Docker Compose para deploy
- Arquitetura em camadas (domain → application → presentation)
- Swagger em `/api/swagger-ui.html`
