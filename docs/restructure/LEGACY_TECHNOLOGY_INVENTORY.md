# Legacy Technology & Architecture Inventory

**Status:** AUDITED — current repository evidence

**Audit date:** 2026-10-06

**Scope:** static code/runtime-configuration inventory; no source, dependency, or runtime change

**Runtime qualification:** legacy boot paths are identified from executable composition. The
current audit host cannot run Docker/PostgreSQL/Redis, so infrastructure marked `PARTIAL` is
configured but not live-verified here.

## 1. Method and classification

This inventory treats manifests, lockfile resolutions, executable entry points, module
composition, imports, persistence mappings, migrations, tests, and Docker/APISIX configuration
as evidence. README or architecture prose is not proof that a technology is active. The executed
baseline in `REGRESSION_BASELINE.md` is used only to report previously observed command status.

`Actually used?` has these meanings:

- `YES`: imported or invoked by a legacy boot path, build pipeline, or an executed test command;
- `PARTIAL`: a narrow subset is used, or infrastructure is configured but not live-verified;
- `NO`: installed, commented, unreferenced, stale, or part of the inactive target application.

Recommendations are evidence-based migration guidance, not a new architecture approval. They use
only `KEEP`, `KEEP_AND_SIMPLIFY`, `ADAPT`, `REPLACE`, `REMOVE`, or `FUTURE`.

## 2. Technology and solution inventory

| Area | Technology/Solution | Version | Evidence file | Actually used? | Current purpose | Recommendation |
| ---- | ------------------- | ------- | ------------- | -------------- | --------------- | -------------- |
| Runtime | Node.js | repository `>=20`; baseline `v24.19.0`; container `22.15.0` | `package.json`; `.docker/compose/nodejs/Dockerfile.local`; `docs/restructure/REGRESSION_BASELINE.md` | YES | Runs workspace tooling and NestJS applications. | KEEP |
| Monorepo | pnpm workspace | `10.17.0`, lockfile v9 | `package.json`; `pnpm-workspace.yaml`; `pnpm-lock.yaml` | YES | Resolves `apps/*` and `libs/*` workspace packages. | KEEP |
| Monorepo | Turborepo task graph/cache | resolved `2.9.6` | `package.json`; `turbo.json`; `pnpm-lock.yaml` | YES | Orchestrates build, test, typecheck, lint, dev, and migrations. | KEEP_AND_SIMPLIFY |
| Monorepo | Package topology | 4 apps + 3 libraries | `pnpm-workspace.yaml`; package manifests | YES | Contains three legacy services, inactive `apps/api`, and broad shared libraries. | ADAPT |
| Language | TypeScript | root resolved `6.0.2`; library manifests `^6.0.3`/`^5.8.3` | `package.json`; `tsconfig.json`; library manifests | YES | Application, library, migration, test, and email-template source. Root strict mode is disabled. | KEEP |
| Build | Nest CLI + SWC/Webpack support | Nest CLI `11.0.10`; SWC core `1.13.5` | `package.json`; service manifests; `nest-cli.json` | YES | Builds NestJS apps; `nest-cli.json` only declares auth and target API projects. | KEEP_AND_SIMPLIFY |
| Quality | Oxlint, Prettier, Husky/lint-staged | Oxlint `1.57.0`; Prettier `3.6.2`; Husky `9.1.7` | `package.json`; `pnpm-lock.yaml` | YES | Lint/format/pre-commit tooling; legacy lint currently fails. | KEEP_AND_SIMPLIFY |
| Testing | Jest + ts-jest | Jest `29.7.0`; ts-jest `29.4.5` | root/service manifests; `apps/*/test/jest-e2e.json` | PARTIAL | Legacy package test runner; finds no unit specs and stale E2E suites do not execute. | ADAPT |
| Testing | Supertest | resolved `7.1.4` | service manifests; `apps/*/test/app.e2e-spec.ts` | PARTIAL | Shallow legacy HTTP greeting E2E tests; all three suites are stale. | ADAPT |
| Testing | Node test runner + tsx | Node built-in; tsx `4.21.0` | `apps/api/package.json`; `apps/api/test/*.spec.ts` | YES | Runs inactive target foundation/Identity local tests independently of Jest. | KEEP |
| Backend | NestJS | core/common `11.1.19` | service manifests; `apps/*/src/main.ts` | YES | DI, modules, controllers, guards, filters, hybrid HTTP/gRPC apps. | KEEP |
| Backend | Express HTTP adapter | Nest platform-express resolved `11.1.6` | service manifests; `apps/*/src/main.ts` | YES | Serves HTTP APIs on all legacy services. | KEEP |
| Backend | Feature/AppModule composition | Nest modules | `apps/*/src/modules/app.module.ts`; `apps/*/src/modules/**` | YES | Composes auth, user, email, and send-mail features; boundaries follow technical services rather than recruitment domains. | ADAPT |
| Backend | Controller → service → repository pattern | Nest/MikroORM pattern | `apps/user-service/src/modules/user`; `apps/user-service/src/data-access/user` | YES | Thin HTTP/gRPC controllers delegate to services; UserService uses UserRepository/EntityManager. Only User has a full repository path. | ADAPT |
| Backend | class-validator + class-transformer | `0.14.2` + `0.5.1` | `libs/common/src/pipes/payload-validation.pipe.ts`; DTO files | YES | Global HTTP validation with transform, whitelist, and implicit conversion; explicit pipe on user gRPC consumer. | KEEP |
| Backend | Central exception normalization | custom `AllExceptionFilter` | `libs/common/src/exceptions/all-exception.filter.ts`; service AppModules | YES | Maps HTTP/RPC failures and strips details in staging/production. | ADAPT |
| Backend | Swagger/OpenAPI | `@nestjs/swagger` resolved `11.2.0` | `libs/common/src/docs/swagger.ts`; service `main.ts` | YES | Generates per-service Swagger UI and bearer-auth documentation. | KEEP |
| Configuration | Nest Config + dotenv | Nest Config `4.0.2`; dotenv `17.2.3` | service AppModules; config files; `package.json` | YES | Loads environment-backed configuration. Joi validation exists but `validationSchema` is commented out in legacy AppModules. | ADAPT |
| Database | PostgreSQL | image `postgres:16-alpine` | `docker-compose.yml`; `.docker/compose/postgresql/postgresql.yml`; user DB config | PARTIAL | Only relational system of record; currently used solely by user-service, but runtime connectivity was not available in baseline. | KEEP |
| Database | MikroORM PostgreSQL | core/driver `7.0.10`; Nest integration `7.0.1` | `apps/user-service/package.json`; DB config; AppModule | YES | Maps and persists the User aggregate in user-service. | KEEP |
| Database | Entity conventions | UUID v7 + timestamps + `deletedAt` | `libs/core/src/base/base.entity.ts`; `user.entity.ts` | YES | Shared base class supplies ID and audit timestamps; User adds mixed identity/profile/role fields. | ADAPT |
| Database | Custom repositories | MikroORM EntityRepository | `libs/core/src/base/base.repository.ts`; `user.repository.ts` | YES | Provides generic pagination and a UserRepository marker. | KEEP_AND_SIMPLIFY |
| Database | Versioned migrations | MikroORM migrations `7.0.10` | `apps/user-service/mikro-orm.config.ts`; `src/database/migrations/Migration20251121025600.ts` | YES | One reversible migration creates the `users` table. | KEEP |
| Database | Transaction handling | implicit Unit of Work/`flush()` | `user.service.ts`; `mikro-orm-microservice.interceptor.ts` | PARTIAL | Single writes flush without explicit business transaction; gRPC interceptor creates a RequestContext and performs an extra completion flush. | REPLACE |
| Database | Soft delete | MikroORM default filter | `user.entity.ts`; `user.service.ts` | YES | Sets `deletedAt` and hides deleted users by default. | ADAPT |
| Database | Indexes/constraints | primary key only in legacy migration | `Migration20251121025600.ts` | PARTIAL | Enforces UUID PK; email uniqueness is check-then-insert with no database unique constraint or supporting search indexes. | REPLACE |
| Database | Current database ownership | user-service owns one `public.users` table | user DB config; User entity/migration | YES | Identity credential, profile, global role, and MFA flag are co-located in one service/table. | REPLACE |
| Authentication | Passport | Passport `0.7.0`; Nest Passport `11.0.5` | auth modules; `libs/core/src/auth` | YES | Hosts gateway-header, access-JWT, and refresh-JWT strategies. | ADAPT |
| Authentication | JWT via `@nestjs/jwt`/passport-jwt | Nest JWT `11.0.1`; passport-jwt `4.0.1`; HS256 default | auth module; `jwt.config.ts`; JWT strategies | YES | Issues and validates access/refresh tokens with shared secret, token type, JTI, expiry, and issuer claim. Verification does not configure issuer/audience checks. | REPLACE |
| Authentication | Access/refresh token pair | custom token payload | `auth.service.ts`; `refresh-token.strategy.ts` | YES | Issues both tokens with one JTI; refresh issues a new access token but does not rotate the session/JTI. | ADAPT |
| Authentication | Redis session/revocation state | ioredis resolved `5.8.1` | `libs/core/src/redis`; `auth.service.ts`; auth strategies | YES | Stores JTI validity, reset tokens, and cached user info; enables logout and broad session revocation. | KEEP_AND_SIMPLIFY |
| Authorization | Global Admin/User RBAC guard | custom global guards | `libs/core/src/auth/guards`; service AppModules; `identity.enum.ts` | YES | Authenticates through gateway strategy and optionally checks one global role string; no tenant/membership/resource permissions. | REPLACE |
| Authentication | APISIX JWT + trusted `x-auth-user` | APISIX JWT plugin | `config/apisix/conf/apisix-dev.yaml`; `base-gateway-auth.strategy.ts` | YES | Gateway verifies token, serializes claims into a header, then services trust that header plus Redis/user lookup. | REMOVE |
| Authentication | bcryptjs password hashing | `3.0.2` | `libs/common/src/utilities/hash.util.ts`; user/auth services | YES | Hashes and compares passwords; the hash is returned over gRPC so auth-service can compare it. | REPLACE |
| Service communication | HTTP JSON REST | Nest/Express | controllers; APISIX route configuration | YES | External API protocol for auth and user info; notification has only a health-like root HTTP endpoint. | KEEP |
| Service communication | Nest gRPC | grpc-js `1.14.0`; proto-loader `0.7.15` | service mains/AppModules; `libs/common/src/grpc` | YES | Auth calls user and notification; user and notification expose gRPC servers. | ADAPT |
| Service communication | Proto + handwritten TypeScript contracts | proto3/custom interfaces | `libs/common/src/grpc/proto`; `*-grpc.interface.ts` | YES | Shares RPC schema and client types; UserResponse can transport password hashes. | ADAPT |
| Service communication | RxJS Observable request/response | RxJS resolved `7.8.2` | `call-microservice.ts`; `auth.service.ts` | YES | Converts gRPC streams to promises with timeout/error mapping; reset-mail dispatch is subscribed without awaiting delivery. | KEEP_AND_SIMPLIFY |
| Service communication | Nest TCP transport | Nest transport factory/config | `tcp.config.ts`; `microservice.factory.ts`; service mains | NO | Generic support exists, but no service registers a TCP listener/client. | REMOVE |
| Infrastructure | Docker / Docker Compose | Compose v3; Docker version environment-dependent | `docker-compose.yml`; `.docker/compose/**` | PARTIAL | Defines PostgreSQL, Redis, RedisInsight, etcd, APISIX, nginx homepage, and ADC; application services are not containerized in this compose file. | KEEP_AND_SIMPLIFY |
| Infrastructure | Apache APISIX | `3.14.0-ubuntu` | APISIX compose/config files | PARTIAL | Configured edge routing, JWT verification, claim-header injection, rewrite, and wildcard CORS; not live-verified on audit host. | KEEP_AND_SIMPLIFY |
| Infrastructure | etcd | `v3.5.1` | APISIX compose/config files | PARTIAL | Stores APISIX traditional-mode configuration. | KEEP_AND_SIMPLIFY |
| Infrastructure | ADC configuration sync | bundled `0.23.1` | `.docker/compose/apisix/Dockerfile.adc`; `docker-compose.yml` | PARTIAL | Pushes declarative APISIX config to the admin API. | KEEP_AND_SIMPLIFY |
| Infrastructure | RedisInsight | `latest` image | Redis compose file; `docker-compose.yml` | PARTIAL | Local Redis inspection UI; not application runtime functionality. | REMOVE |
| Infrastructure | Health checks | root greeting only | app controllers; compose files | NO | No Terminus probes, dependency readiness checks, or Compose healthchecks. | FUTURE |
| Notification | Nodemailer SMTP | `8.0.5` | `smtp-email.service.ts`; `email.module.ts` | YES | Active provider selected by DI for password-reset email. | KEEP |
| Notification | AWS SES SDK adapter | client SES `^3.808.0` | `ses-email.service.ts`; `email.module.ts` | NO | Implemented and imported but not registered as the active provider. | ADAPT |
| Notification | React Email templates | React Email `5.0.1`; React `^19` | `libs/email-template`; `email.service.ts` | YES | Renders a reset-password HTML template. Template still contains legacy AI Agent branding. | ADAPT |
| Notification | Direct/fire-and-forget delivery | custom gRPC + SMTP | `auth.service.ts`; `send-mail.consumer.ts`; `smtp-email.service.ts` | YES | Caller does not await dispatch; SMTP/SES adapters catch and swallow delivery errors; no durable delivery status. | REPLACE |
| Notification | BullMQ/queue dashboard concept | BullMQ `^5.56.1`; Nest BullMQ `^11.0.2` | notification manifest; commented AppModule block | NO | Dependencies exist but queue registration and worker flow are commented out. | REMOVE |
| Logging | Winston + nest-winston | Winston resolved `3.18.3`; nest-winston `1.10.2` | `log.util.ts`; service mains/AppModules | YES | Console logging and Nest logger replacement with service/context metadata. | KEEP_AND_SIMPLIFY |
| Observability | Request ID + HTTP logging | express-request-id `3.0.0` | service mains; `http-logger.middleware.ts` | YES | Assigns request ID and logs request/response duration with credential-header redaction. ID is not propagated as a defined cross-service correlation contract. | ADAPT |
| Observability | Metrics and distributed tracing | none | manifests and source search | NO | No metrics exporter, OpenTelemetry SDK, trace propagation, or dashboards are wired. | FUTURE |
| Shared libraries | `libs/common` | workspace package `1.0.0` | `libs/common/package.json`; `libs/common/src/index.ts` | YES | Catch-all for config, DTOs, decorators, errors, events, gRPC contracts, logging, pipes, and utilities. | REPLACE |
| Shared libraries | `libs/core` | workspace package `1.0.0` | `libs/core/package.json`; `libs/core/src/index.ts` | YES | Catch-all for auth, base persistence, Redis, transports, HTTP, Google, Firebase, and S3 adapters. | REPLACE |
| Shared libraries | `libs/email-template` | workspace package `1.0.1` | library manifest; template source | YES | Isolated email rendering/templates package. | ADAPT |
| Security | Helmet | `8.1.0` | service manifests and mains | YES | Applies standard HTTP security headers. | KEEP |
| Security | CORS | Nest/APISIX built-in | service mains; APISIX global rule | YES | Enabled without origin restrictions in services and wildcarded at gateway. | ADAPT |
| Reliability | Rate limiting | commented example only | service mains | NO | No active app or gateway rate-limit policy. | FUTURE |
| Reliability | Redis distributed lock helpers | ioredis SET NX + Lua release | `redis.service.ts` | NO | Lock API exists but has no application callers. | ADAPT |
| Reliability | Target outbox/idempotency foundation | MikroORM target-only code | `apps/api/src/platform/persistence/outbox`; target migration | NO | Inactive P6 source and local tests; no legacy producer/worker or traffic uses it. | ADAPT |
| Caching | Redis user-info cache | ioredis | `user.service.ts`; `redis.service.ts` | YES | Cache-aside user info with TTL and best-effort eviction; pattern deletion uses Redis `KEYS`. | ADAPT |
| Secrets | Environment variables/plain example secrets | dotenv/Nest Config | `.env.example`; config files; APISIX YAML | YES | Supplies database, Redis, JWT, APISIX, mail, and cloud credentials; no runtime secret-manager adapter in legacy. | REPLACE |
| Frontend | Web/mobile client | none | workspace/app inventory | NO | No frontend package, state manager, API client, or auth integration exists in this repository. | FUTURE |
| Stale infrastructure | Kafka | Kafka image `4.0.1`; kafkajs `2.2.4` | commented compose/main blocks; manifests | NO | Generic dependency/config/factory support only; broker and consumers are commented out. | REMOVE |
| Stale infrastructure | RabbitMQ | image `3.12-management-alpine`; amqplib `1.0.3` | commented compose/main/AppModule blocks; manifests | NO | Generic dependency/config support only; no active broker/client/consumer. | REMOVE |
| Stale infrastructure | Kong/deck | Kong `3.12.0.0`; deck `1.52.0` | `.docker/compose/kong`; `config/kong`; `.env.example` | NO | Superseded gateway artifacts; absent from active Compose services. | REMOVE |
| Stale adapters | Google authentication | google-auth-library `9.15.1` | `GoogleAuthModule`; auth module/service | PARTIAL | Module and unused service dependency are wired, but no controller/use case invokes Google sign-in. | REMOVE |
| Stale adapters | Firebase Admin | `13.5.0` | `libs/core/src/firebase`; core manifest | NO | Implemented/exported library code with no application import. | REMOVE |
| Stale adapters | AWS S3 | SDK `^3.821.0` | `libs/core/src/aws-s3`; core manifest | NO | Implemented/exported library code with no application import. | REMOVE |
| Target source | Inactive `apps/api` modular skeleton/foundation | Nest `11.1.19`; MikroORM `7.0.10` | `apps/api/src/main.ts`; `api.module.ts`; target tests | NO | Buildable/tested target source; bootstrap function is deliberately not invoked and no traffic is routed to it. | KEEP |

## A. Current Runtime Architecture

The current executable architecture is a small distributed NestJS starter, not a recruitment
platform implementation:

```text
Client
  -> APISIX HTTP route /auth/*, /user/*, /notification/*
     -> public route: proxy directly
     -> protected route: APISIX jwt-auth -> JSON claims in x-auth-user
        -> legacy NestJS HTTP service
           -> global gateway-auth guard -> Redis JTI lookup
           -> user reload (local repository or user-service gRPC)
           -> optional Admin/User role check
           -> controller -> service

Login/sign-up/password flow
  -> auth-service
     -> synchronous gRPC -> user-service
        -> UserService -> UserRepository/EntityManager -> PostgreSQL users table
     -> bcrypt compare/hash in the caller/owner split
     -> HS256 access + refresh JWT
     -> Redis JTI/session record

Forgot-password notification
  -> auth-service stores reset token in Redis
  -> fire-and-forget gRPC -> notification-service
     -> React Email render -> Nodemailer SMTP
     -> provider errors logged and swallowed
```

All three legacy services run HTTP; user-service and notification-service additionally start gRPC
listeners. Auth-service is a gRPC client. Kafka, RabbitMQ, TCP, and BullMQ are not active.
PostgreSQL ownership is limited to user-service. Redis is a shared operational dependency used by
all legacy services through `libs/core`.

The Compose topology does not launch application containers. It supplies local infrastructure and
expects service processes on the host through `host.docker.internal`. No dependency health/readiness
probe is defined. On the last executed baseline, Docker, PostgreSQL CLI, and Redis CLI were not
available, so this audit proves wiring rather than a live deployment.

`apps/api` is a separate target code path: workspace build/typecheck/tests exercise it, but its
entry function is not invoked and APISIX has no route to it. It is not part of current production
behavior.

## B. Current Technology Stack

The technology set demonstrably present on active code/build paths is:

- Node.js, TypeScript, pnpm workspaces, and Turborepo;
- NestJS 11 with Express, Nest Config, class-validator/class-transformer, Swagger, Helmet;
- PostgreSQL 16 configuration with MikroORM 7 in user-service;
- Passport, HS256 JWT access/refresh tokens, bcryptjs, and Redis-backed JTI/session state;
- HTTP REST at the edge and gRPC for auth-to-user/auth-to-notification calls;
- APISIX with etcd and declarative ADC configuration;
- Nodemailer SMTP and React Email for password-reset mail;
- Winston/nest-winston plus request IDs and HTTP request logging;
- Jest/ts-jest/Supertest as legacy test tooling, and Node test + tsx for target-only tests;
- Docker Compose definitions for PostgreSQL, Redis, RedisInsight, etcd, APISIX, ADC, and a static
  nginx homepage.

No frontend stack exists.

## C. Documentation-only / stale technologies

These items must not be described as current application runtime:

| Item | Evidence of inactivity/staleness |
|---|---|
| Kafka/Kafka UI | Compose services, listener registration, and consumer code are commented; only dependencies/config/factory remain. |
| RabbitMQ | Compose and Nest registration are commented; no active producer/consumer. |
| BullMQ/Bull Board | Packages are declared, but queue module registration is commented and no worker exists. |
| TCP transport | Config/factory branch exists without any registered client or listener. |
| Kong/deck | Files and environment variables remain, but active Compose uses APISIX. |
| AWS SES | Adapter exists but DI selects SMTP unconditionally. |
| Firebase Admin and AWS S3 | Exported library adapters have no application imports. |
| Google sign-in | GoogleAuthModule is wired, but no route/use case calls the injected service. |
| Metrics/OpenTelemetry | Target architecture mentions them; no current runtime SDK/exporter is installed or wired. |
| Frontend/Next.js | `next` exists only as a React Email preview dependency; there is no product frontend application. |
| `apps/api` runtime | Target source builds/tests, but bootstrap is intentionally not called and no route transfers traffic to it. |

## D. Reusable Components

Reuse should mean retaining a focused idea or adapter behind a new boundary, not copying the
legacy service graph wholesale.

1. `PayloadValidationPipe` and DTO decorators are useful starting points, after removing overly
   broad shared-package coupling and reviewing implicit conversion.
2. `AllExceptionFilter`, gRPC-to-HTTP status mapping, and microservice timeout normalization contain
   useful failure-normalization logic; adapt them to the approved problem-details contract.
3. `HttpLoggerMiddleware` already redacts credential-bearing headers and measures request latency;
   adapt it to a propagated correlation context and structured production output.
4. Redis JTI revocation, reset-token TTL concepts, reconnect policy, and compare-and-delete Lua lock
   show useful primitives. Replace `KEYS` pattern deletion and separate cache from security state.
5. MikroORM migration wiring, UUID/timestamp concepts, explicit entity-to-response mapping, and
   repository-backed queries are reusable patterns after domain ownership is corrected.
6. React Email rendering and the SMTP/SES provider abstraction are reusable after rebranding,
   durable delivery, error propagation, retry, and delivery-history support are introduced.
7. APISIX declarative routing and ADC automation can be retained if the approved deployment still
   needs an API gateway; remove identity-claim header trust.
8. The inactive target platform code for validated configuration, problem details, correlation,
   outbox/idempotency, and transaction ports is stronger source material than the corresponding
   legacy catch-all helpers, but still needs database/deployment validation before cutover.

## E. Technical Debt / Overengineering

### High-risk debt

- Authentication is split across auth-service and user-service, forcing a password hash across
  gRPC. Reusing that boundary would preserve a credential-exposure risk and distributed failure
  mode without providing an independent business capability.
- Services trust an APISIX-generated `x-auth-user` header. Direct service reachability can bypass
  cryptographic identity verification unless the network boundary is perfect.
- The legacy `users` migration has no unique email constraint; check-then-insert is race-prone.
- Password-reset mail is non-durable: dispatch is not awaited, provider errors are swallowed, and
  there is no retry, outbox, idempotency, delivery history, or failure signal.
- Authorization is only global `Admin`/`User`; there is no organization membership, tenant scope,
  assignment, ownership, or resource-state enforcement.
- Environment validation is disabled while `.env.example` contains concrete-looking JWT/APISIX
  secrets. There is no production secret-provider boundary.

### Complexity/staleness inappropriate for the current product size

- Three deployable services, APISIX, etcd, ADC, gRPC, shared Redis, and duplicated auth lookups are
  disproportionate to the three implemented capabilities: login, a User record, and reset email.
- `libs/common` and `libs/core` are catch-all libraries that obscure ownership and make every
  service inherit unrelated infrastructure.
- Kafka, RabbitMQ, BullMQ, TCP, Kong, Firebase, S3, Google auth, and inactive SES support increase
  dependency and configuration surface without active use.
- The generic transport factory supports four protocols although only gRPC is active.
- Both global guards invoke the gateway Passport strategy, which can duplicate Redis/user lookups.
- Redis `KEYS` is used for session-pattern deletion; it does not scale safely.
- User profile, credential, role, and a bare `is2faEnabled` flag are combined in one entity with no
  organization model or complete MFA persistence.
- Database debug mode is enabled when `USER_SERVICE_NODE_ENV` is production.
- Swagger is exposed per service, but there is no single versioned external contract.
- CORS is unrestricted at two layers; rate limiting is only commented sample code.
- No dependency health checks, metrics, traces, durable audit, or production-ready readiness probe
  exist.
- Legacy Jest has no unit suites; all three Supertest E2E tests are stale and only target a greeting.
- The notification template retains AI Agent branding and a hard-coded 15-minute statement that can
  drift from configured reset-token TTL.

For a student project, the simplest defensible baseline is one coherent backend deployment with
explicit domain modules and one optional notification worker. Any physical service split should be
earned by deployment, scaling, failure-isolation, or team-ownership evidence.

## F. Proposed Stack Mapping: CURRENT → NEW 6–7 SERVICE ARCHITECTURE

This is a responsibility/source mapping only. The approved P3 architecture is currently a Modular
Monolith with domain modules, not seven independently deployable services. If a 6–7 service
deployment is later required, it needs a new ADR covering transaction, consistency, authorization,
operations, and ownership. The rows below do not approve that split.

| Proposed capability/service | Current source | Reuse/adaptation recommendation | Missing/new work |
|---|---|---|---|
| Identity | `auth-service`; credential/session slices of `user-service`; Redis auth primitives; target Identity source | Keep NestJS/PostgreSQL/MikroORM/Redis concepts; replace hash-over-gRPC, HS256 shared-secret trust, global role, and gateway-header authentication. | Complete approved account/MFA/session/security persistence and runtime adapters; independently verify tokens at ingress/application boundary. |
| Organization | No legacy owner | Reuse only generic validation/error/persistence patterns. Do not move `User.role`; Identity must not own membership/roles. | New Organization, Membership, fixed roles, permission context, invitation, assignment, and strict tenant-scope implementation. |
| Recruitment | No legacy Request/Job owner | No business logic to reuse. NestJS/MikroORM are suitable implementation tools. | New Recruitment Planning and Job ownership/lifecycles. If combined into one deployment, preserve separate module/private-data boundaries. |
| Candidate | Profile-like columns in legacy `User`; no candidate aggregate | Migrate verified identity linkage and selected profile data through an explicit mapping; do not reuse the User entity as Candidate. | New Candidate Profile, resume versions, preferences, consent/privacy, and candidate self-scope. |
| Application | No legacy owner | No legacy business code to reuse; retain Application as a first-class domain regardless of process topology. | New application snapshot, uniqueness/concurrency, pipeline/history, lifecycle, and cross-domain public ports. |
| Interview | No legacy owner | No legacy business code to reuse. | New schedules, rounds, assignments, feedback/scorecards, lifecycle, audit, and notification intents. |
| Notification | `notification-service`; `libs/email-template`; SMTP active; SES inactive; target outbox foundation | Reuse rendering and provider interfaces after rebranding; replace fire-and-forget gRPC with committed intent/outbox and observable delivery state. | Durable worker, idempotent retry, delivery attempts/history, dead-letter/operator recovery, templates owned by Communication. |

Candidate new-process communication should default to versioned HTTP or generated contracts only
where a real process boundary exists. In a Modular Monolith, use public in-process module ports and
the transactional outbox; do not retain gRPC simply because legacy code already has it. If seven
deployables are approved later, reuse the proto/gRPC experience only after removing password-hash
transport, defining ownership, and accepting distributed transaction/observability costs.

## 3. Inventory totals

The technology table contains **71** classified items:

- `Actually used?`: **45 YES**, **11 PARTIAL**, **15 NO**;
- recommendation: **15 KEEP**, **11 KEEP_AND_SIMPLIFY**, **21 ADAPT**, **10 REPLACE**,
  **10 REMOVE**, **4 FUTURE**.

Counts describe inventory rows, not package count. A solution can be `PARTIAL` yet worth keeping,
or currently `NO` yet be required as future platform capability.
