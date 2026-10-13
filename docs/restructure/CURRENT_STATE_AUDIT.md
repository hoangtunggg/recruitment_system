# P0 Current State Audit

**P0 task status:** DONE  
**Audit date:** 2026-10-05  
**Scope:** Repository state only; no application-code or runtime-behavior changes  
**Authority:** `AGENTS.md`, especially sections 2, 4-8, 18-21, 25-28, 42-49, and 54-56

## 1. Purpose and limits

This document records the repository as it exists at the start of the controlled
restructure program. It does not approve a migration design, reinterpret legacy
documentation, or resolve an architectural conflict.

The audit used static inspection of source, configuration, manifests, tests, and
documentation. Application test suites were not used as proof of correctness because
the existing test baseline is incomplete and contains known stale tests.

## 2. Repository snapshot

| Item | Observed state |
|---|---|
| Workspace | pnpm workspace coordinated by Turborepo |
| Root package | `nest-turbo-starter` |
| Applications | `auth-service`, `user-service`, `notification-service` |
| Shared libraries | `common`, `core`, `email-template` |
| Approximate file inventory | 276 files discoverable by `rg --files` |
| TypeScript/TSX files | 205 |
| Markdown files before P0 artifacts | 25 |
| Test files | 3 E2E files; no unit `*.spec.ts` files |
| Runtime framework | NestJS 11 on Express |
| Internal transport | gRPC is active; TCP support exists but is optional/off by default |
| Persistence | MikroORM 7 + PostgreSQL in `user-service` only |
| Cache/session state | Redis |
| Edge gateway | Apache APISIX; Kong artifacts also remain |
| Worktree precondition | `AGENTS.md` existed as an untracked file before P0 documentation changes |

## 3. Current application architecture

The current implementation is a service-oriented NestJS starter rather than the
target domain-oriented structure described in `AGENTS.md`.

```text
Client
  -> Apache APISIX (HTTP routing and JWT verification)
  -> auth-service / user-service / notification-service
       -> Redis
       -> gRPC between NestJS services
       -> PostgreSQL through user-service only
       -> SMTP or AWS SES through notification-service
```

### 3.1 Application responsibilities

| Application | Current responsibility | Persistence | Internal calls |
|---|---|---|---|
| `auth-service` | Login, sign-up, logout, refresh token, password reset/change | Redis token/reset state; no relational database | gRPC client to user and notification services |
| `user-service` | User identity record, credential hash, basic profile fields, admin CLI | `users` table through MikroORM | gRPC server |
| `notification-service` | Forgot-password email delivery through SMTP/SES abstraction | No implemented notification database/history | gRPC server; gRPC client registration for user service |

### 3.2 Shared-library responsibilities

| Library | Current contents | Audit observation |
|---|---|---|
| `libs/common` | Configuration, decorators, DTOs, enums, errors, filters, validation, logging helpers, events, gRPC interfaces/protos | Broad shared bucket containing several unrelated responsibilities |
| `libs/core` | Base entity/repository/service, auth guards/strategies, Redis, microservice factory, HTTP, Firebase, Google auth, S3 | Broad infrastructure bucket; target ownership is not yet defined |
| `libs/email-template` | React email layout and reset-password template | Closest existing match to target `packages/email-templates` |

## 4. Current module and request flow

### 4.1 HTTP flow

1. APISIX routes `/auth/*`, `/user/*`, and `/notification/*`.
2. Protected routes use the APISIX JWT plugin.
3. APISIX serializes JWT claims into `x-auth-user`.
4. Each NestJS application registers global `AppAuthGuard` and
   `RoleBasedAccessControlGuard`.
5. `gateway-auth` parses `x-auth-user`, checks the token JTI in Redis, then reloads
   the user either locally (`user-service`) or over gRPC.
6. Controllers delegate to services.
7. `AllExceptionFilter` normalizes HTTP or RPC failures.

### 4.2 Authentication flow

1. `auth-service` asks `user-service` for a user over gRPC.
2. `auth-service` verifies the password hash locally.
3. Access and refresh JWTs are signed with a shared secret.
4. A Redis entry keyed by user ID and JTI makes the otherwise signed token revocable.
5. Logout, password changes, deletion, and deactivation remove relevant Redis keys.

### 4.3 Persistence flow

The implemented controller/service/repository path exists only for users:

```text
HTTP controller or gRPC consumer
  -> UserService
  -> UserRepository and EntityManager
  -> PostgreSQL
  -> explicit `toUserResponse` mapper
```

`BaseEntity` supplies UUID v7 identifiers, timestamps, and `deletedAt`. The User
entity enables a default soft-delete filter. The only migration creates `users`; it
does not define a unique constraint on email.

## 5. Target-domain coverage

The following table evaluates concepts mandated by `AGENTS.md`. "Absent" means no
implemented owning module/entity/use case was found; it does not mean the domain is
unnecessary.

| Target domain | Current coverage | Status |
|---|---|---|
| Identity | Accounts, password credentials, JWTs, Redis sessions, basic profile fields | PARTIAL |
| Organization | No organization, membership, organization role, or permission model | ABSENT |
| Recruitment Planning | No recruitment request, hiring need, headcount, approval, or lifecycle | ABSENT |
| Candidate | No distinct candidate profile, experience, education, skill, preference, or CV-version model | ABSENT |
| Job | No implemented job module or persistence | ABSENT |
| Application | No implemented application module or persistence | ABSENT |
| Interview | No implemented recruitment interview module | ABSENT |
| Offer | No offer module, approval, response, or hiring-completion behavior | ABSENT |
| Communication | Password-reset email delivery only; no delivery history, retry, or outbox | PARTIAL |
| Governance | No audit/activity/security-event domain or persistence | ABSENT |

No recruitment lifecycle or state-machine implementation currently exists. Therefore
there is no current code implementing the Recruitment Request, Job, Application,
Interview, or Offer transitions defined conceptually in `AGENTS.md`.

## 6. Authorization and security baseline

| Area | Current behavior | Gap against target concepts |
|---|---|---|
| Identity | One `User` entity with global `role` string | User identity and business role are conflated |
| Roles | `Admin` and `User` only | No Candidate, Recruiter, Hiring Manager, Interviewer, Organization Admin, or Platform Admin separation |
| Organization scope | Not represented | No membership, organization, permission, or tenant/resource-scope check is possible |
| Backend authorization | Global authentication and global-role guard | Does not evaluate membership + permission + ownership + state |
| Gateway trust | Services accept `x-auth-user` after APISIX injection | Direct service access could spoof the header unless deployment networking prevents bypass |
| Session validity | Redis JTI plus user-active check | Implemented, but not connected to organization authorization |
| Audit | Request logging only | No business/security audit record model |
| Secrets/config | Example env contains concrete-looking JWT/APISIX values | Must be reviewed before using examples outside local development |

Additional observed implementation risks, without prescribing P0 fixes:

- both global guards invoke the same Passport strategy, potentially repeating user and
  Redis lookups;
- JWT strategies verify the signature but do not configure issuer validation;
- gRPC user lookup operations can return the password hash for authentication flows;
- email uniqueness is checked in application code without a database unique constraint;
- CORS is broadly enabled at both application and gateway levels;
- `RedisService.deleteByPattern` uses `KEYS`, which does not scale safely;
- user-list limits are not bounded by a maximum at the gRPC DTO boundary;
- `%` and `_` in search input are passed through as wildcard semantics;
- password-reset notification is dispatched without durable queue/outbox tracking;
- database debug configuration is enabled when the service environment equals
  production.

These are current-state findings. Remediation belongs to a later approved phase.

## 7. API, DTO, and error baseline

- HTTP controllers are thin and return service results directly.
- gRPC consumers are registered as NestJS controllers and delegate to services.
- Request DTOs use class-validator directly or the shared `PropertyDto` composite.
- Global validation enables transformation, whitelisting, and implicit conversion.
- Entity-to-wire mapping is explicit for `User`; password inclusion is conditional.
- `ServerException` and centralized `ERROR_RESPONSE` constants feed
  `AllExceptionFilter`.
- RPC errors are converted between HTTP and gRPC status models.
- A success `ResponseInterceptor` exists but is not registered, so the documented
  `{ data, meta }` response wrapper is not the active universal contract.
- Validation errors currently use HTTP 422 and lowercase error codes, which differs
  from legacy API documentation.

## 8. Infrastructure baseline

Current `docker-compose.yml` provisions:

- one PostgreSQL database named from `DEFAULT_PG_DATABASE`;
- Redis and RedisInsight;
- APISIX, etcd, an APISIX homepage, and ADC configuration sync.

It does not currently provision the application services, separate service databases,
MinIO, a web application, an AI service, or a notification worker. Kafka and RabbitMQ
sections are present but commented. Kong compose/config/env artifacts remain.

## 9. Testing and quality baseline

| Area | Observed state |
|---|---|
| Unit tests | None found |
| E2E tests | One shallow health test per application |
| Root `pnpm test` | Runs per-package Jest unit configuration, not `test:e2e` |
| Auth E2E | Expected response capitalization differs from implementation |
| Notification E2E | Imports a module that does not exist |
| Domain tests | None; target domains are absent |
| Authorization tests | None |
| Lifecycle/transition tests | None |
| Concurrency/idempotency tests | None |
| Traceability | No Requirement -> Rule -> Use Case -> Code -> Test mapping |

No test command was claimed as passing during P0. The stale tests and missing unit
tests mean the repository does not yet provide a dependable regression baseline for
later migration.

## 10. P0 conclusions

1. The current repository is a NestJS starter centered on account authentication,
   user persistence, and password-reset email.
2. It does not implement the Recruitment Management Platform business domains or
   lifecycle described in `AGENTS.md`.
3. Existing architecture/product documentation primarily describes a different,
   AI-oriented product and cannot be treated as approved product behavior.
4. The exact target deployment architecture remains undecided: `AGENTS.md` gives a
   preferred modular layout, while current code and legacy ADRs describe multiple
   services and conflicting transports.
5. P1 must establish approved product context, canonical terminology, actors,
   permissions, business rules, use cases, and lifecycle specifications before domain
   implementation or migration planning proceeds.

## 11. Related P0 artifacts

- [Documentation Inventory](./DOCUMENTATION_INVENTORY.md)
- [Architecture Conflict Register](./ARCHITECTURE_CONFLICTS.md)
- [Restructure Tracker](./RESTRUCTURE_TRACKER.md)

