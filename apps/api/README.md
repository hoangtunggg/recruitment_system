# Target API skeleton — inactive

**State:** `TARGET_SKELETON_INACTIVE`  
**Legacy state:** `LEGACY_ACTIVE`

This inactive target application establishes approved Modular Monolith boundaries and
P6 technical foundation. Its entry point deliberately does not invoke a listener; it
has no controllers/routes or domain workflow, and imports no legacy application, gRPC
contract, repository, or database model. APISIX and all legacy services continue
unchanged.

The future application is organized as `modules/<domain>/{api,application,domain,
infrastructure}`. `platform/*` is reserved for narrow technical infrastructure; it is
not a generic business `common` or `core` package.

P6 configuration is target-only and requires the `TARGET_*` values shown in
`.env.example`. The only migration is an additive technical `outbox` foundation; it is
not executed at startup and remains subject to the documented backup/restore gate.
