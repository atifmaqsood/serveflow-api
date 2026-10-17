# ServeFlow Pilot Product Requirements

## Pilot assumption

The first implementation targets a single-branch café/QSR with one or more POS terminals and one kitchen station. The architecture remains multi-tenant and multi-branch, but advanced dine-in, inventory and online-ordering workflows are not MVP blockers.

This assumption must be confirmed with the first pilot customer before Phase 2 is locked.

## Pilot users

- Owner: configures the business and reviews all reports.
- Branch manager: opens/closes business activity, approves exceptions and manages staff/menu availability.
- Cashier: operates an assigned register and takes payment.
- Kitchen operator: prepares and completes routed tickets.

## Required vertical slice

1. An owner creates an organization, branch, manager and cashier.
2. An authorized device is paired with the branch and register.
3. A manager publishes a menu containing categories, products, variants and modifiers.
4. A cashier opens a shift with an opening float.
5. The cashier creates, edits and confirms an order.
6. The server calculates prices, discounts, charges and taxes.
7. A KOT reaches the correct station or uses printer fallback.
8. The cashier records one or more payments and finalizes the sale idempotently.
9. A receipt is produced and the order appears in history/reports.
10. The cashier closes the shift and records counted cash; the manager reviews variance.

## P0 functional requirements

### Identity and scope

- Login, token/session rotation and logout.
- Secure PIN unlock on a previously paired device.
- Organization, branch, device and register scope derived on the server.
- Role/permission enforcement for every protected endpoint.
- Audit events for privileged and financial actions.

### Menu

- Draft and published menu versions.
- Categories, products, variants and required/optional modifier groups.
- Branch-specific price and manual availability.
- Integer-minor-unit prices and tax group assignment.

### Orders

- Dine-in reference, takeaway and delivery types; the QSR pilot optimizes takeaway.
- Draft, held, confirmed, preparing, ready, completed and cancelled lifecycle.
- Notes, quantities, modifier selections and item removal before confirmation.
- Server-calculated totals and immutable finalized snapshots.
- Search by order number, customer phone and date.
- Manager-approved discount, void and refund with reason.

### Payments and shifts

- Cash, card and configurable manual tenders.
- Split payment and cash change calculation.
- Idempotent payment recording and finalization.
- Opening float, pay-in, pay-out, close count and variance.
- X summary during a shift and final Z summary on close.

### Kitchen and print

- Station routing and real-time ticket updates.
- New, accepted, preparing, ready and completed kitchen states.
- Receipt and KOT output with retry/fallback visibility.
- Sale remains saved when printing fails; the failure is surfaced for reprint.

### Reporting

- Sales, tax, payment, discount, refund and shift summaries.
- Filters by business date, branch, register and employee where authorized.
- Drill-down from totals to underlying orders.

## Non-functional acceptance criteria

- Duplicate finalize/payment requests with the same idempotency key do not duplicate a sale or payment.
- A user from organization A cannot read or mutate organization B data in automated tests.
- Monetary calculations are deterministic and use no binary floating-point persistence.
- Every completed, cancelled, voided or refunded transaction is attributable to an actor and reason where required.
- A failed external integration can be retried without reconstructing the sale.
- Backup/restore and failed-job recovery have documented runbooks before pilot launch.
- POS shows online, offline/pending, printing and synchronization states.

## Out of scope for the first vertical slice

- Full reservations and visual floor editor.
- Recipe-based inventory and purchasing.
- Loyalty/gift cards.
- Customer self-ordering and rider dispatch.
- Third-party accounting/delivery integrations.
- Payroll and full general ledger.
