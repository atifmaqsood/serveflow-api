# Permissions Matrix

Permissions are capability keys, not hard-coded role checks. Default roles are templates and organizations may create restricted custom roles.

| Capability | Owner | Branch manager | Cashier | Kitchen | Inventory manager | Accountant |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `organizations.manage` | ✓ | — | — | — | — | — |
| `branches.manage` | ✓ | limited | — | — | — | — |
| `users.manage` | ✓ | branch | — | — | — | — |
| `roles.manage` | ✓ | — | — | — | — | — |
| `devices.pair` | ✓ | ✓ | — | — | — | — |
| `catalog.read` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `catalog.manage` | ✓ | ✓ | — | — | — | — |
| `catalog.publish` | ✓ | ✓ | — | — | — | — |
| `orders.create` | ✓ | ✓ | ✓ | — | — | — |
| `orders.update_open` | ✓ | ✓ | ✓ | — | — | — |
| `orders.confirm` | ✓ | ✓ | ✓ | — | — | — |
| `orders.cancel_unprepared` | ✓ | ✓ | ✓ | — | — | — |
| `orders.cancel_prepared` | ✓ | ✓ | approval | — | — | — |
| `orders.override_price` | ✓ | ✓ | approval | — | — | — |
| `orders.discount_within_limit` | ✓ | ✓ | configured | — | — | — |
| `orders.void` | ✓ | ✓ | approval | — | — | ✓ |
| `orders.refund` | ✓ | ✓ | approval | — | — | ✓ |
| `payments.take` | ✓ | ✓ | ✓ | — | — | — |
| `payments.refund` | ✓ | ✓ | approval | — | — | ✓ |
| `shifts.open_own` | ✓ | ✓ | ✓ | — | — | — |
| `shifts.close_own` | ✓ | ✓ | ✓ | — | — | — |
| `shifts.review_variance` | ✓ | ✓ | — | — | — | ✓ |
| `cash_movements.create` | ✓ | ✓ | configured | — | — | — |
| `kitchen.transition` | ✓ | ✓ | — | ✓ | — | — |
| `inventory.manage` | ✓ | ✓ | — | — | ✓ | — |
| `stock.adjust` | ✓ | approval | — | — | ✓ | — |
| `reports.sales` | ✓ | ✓ | own shift | — | — | ✓ |
| `reports.cost_margin` | ✓ | configured | — | — | ✓ | ✓ |
| `audit.read` | ✓ | branch | — | — | — | ✓ |
| `exports.create` | ✓ | configured | — | — | — | ✓ |

## Enforcement rules

- Permission checks always include organization and branch scope.
- “Approval” means another authorized user supplies an approval credential; it is not the cashier temporarily changing roles.
- Approval records include requester, approver, action, target, reason, time and device.
- Cashier limits for discount, refund and cash movement are policy values, not separate roles.
- Users cannot approve their own restricted request unless an explicit owner policy permits it.
- Cost, margin, payroll and customer exports are treated as sensitive data.
- Endpoint tests must include denied, wrong-branch and wrong-organization cases.
