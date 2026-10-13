# P4 Technical Debt Classification

**Status:** RECORDED  
**Scope:** P4 Closure static runtime-reference inspection; no source changes.

| Map ID | Component | Current responsibility and runtime references | Action / target owner | Prerequisite and validation/removal condition |
|---|---|---|---|---|
| P4-MIG-029 | `libs/core/src/http/**` | Axios wrapper/module; no static application consumer found | DELETE; no approved target integration owner | Re-run import scan after dependencies install; build/typecheck prove no consumer; deployment inventory clear. |
| P4-MIG-030 | Swagger/docs helpers | Swagger decorator used in auth and all app controllers | REFACTOR to `platform/http/openapi` | Target OpenAPI route/security contract and generated-doc validation. |
| P4-MIG-031 | HTTP logger | Registered in all three current app modules | REFACTOR to `platform/observability/http` | Validate correlation and redaction; target logger installed before removal. |
| P4-MIG-032 | File validation pipe | Definition only in static scan; no caller found | DELETE; no target file capability | Re-run scan/build/typecheck; P1 scope remains without upload capability. |
| P4-MIG-033 | Error utility | Used by HTTP logger and exception filter | REFACTOR to `platform/http` and `platform/observability` | Problem-details and redaction tests; all imports migrated. |
| P4-MIG-034 | Log utilities | Winston/bootstrap utilities used by all three current apps | REFACTOR to `platform/observability` | API/worker structured-log, trace/correlation and redaction validation. |
| P4-MIG-035 | RRULE utility | Definition only in static scan; no caller found | DELETE; recurrence is not in approved P1/P3 scope | Re-run scan/build/typecheck; no approved recurrence owner/caller. |

`DELETE` items are conditional retirements based on static-reference evidence plus
future build/deployment validation—not merely the absence of a target equivalent.

## Baseline debts observed during enablement

| ID | Severity | Evidence | Required disposition |
|---|---|---|---|
| TD-P4-001 | HIGH | `pnpm lint` exits 1 with existing Oxlint findings in auth, user, and notification services | Preserve as baseline; resolve only in an authorized code-quality task, not to obtain P5 permission. |
| TD-P4-002 | HIGH | `pnpm test` exits 1 because every service Jest configuration has zero unit-test matches | Create characterization/unit coverage before Identity/Communication cutover; P5 skeleton may start with this explicit comparison rule. |
| TD-P4-003 | HIGH | Auth/User/Notification E2E all fail before assertions because SuperTest namespace imports are non-callable and ts-jest reports TS151002; Notification also imports a nonexistent module | Quarantine as `E2E-STALE-001`–`003`; repair only by an authorized test-only task and replace with scoped characterization suites. |
| TD-P4-004 | MEDIUM | Migration check cannot load DB configuration because `.env` lacks `dbName`/`clientUrl`; Docker/DB tools are absent | Supply non-secret local environment and run the non-destructive migration/connectivity/restore gate before any data migration. |
