# Target technical platform boundary

Only technical capabilities approved by P3 belong here: configuration, HTTP,
persistence, security, observability, and testing. No recruitment entity, permission,
workflow, or domain policy may be placed in this tree. P6 implements only reusable,
fail-closed technical foundations; P7 introduces domain behavior through its owners.

The transactional outbox is a neutral technical foundation under persistence. It does
not own Communication delivery decisions or Governance audit records.
