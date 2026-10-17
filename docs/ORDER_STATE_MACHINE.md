# Order State Machine

## Order states

```text
                         ┌───────────┐
              ┌─────────▶│ CANCELLED │
              │          └───────────┘
              │
DRAFT ──▶ HELD/OPEN ──▶ CONFIRMED ──▶ PREPARING ──▶ READY ──▶ SERVED/DISPATCHED ──▶ COMPLETED
  │          │               │             │           │               │
  └──────────┴───────────────┴─────────────┴───────────┴───────────────┘
                 cancellable according to permission and kitchen/payment state

COMPLETED ──▶ PARTIALLY_REFUNDED ──▶ REFUNDED
    │
    └────────▶ VOIDED (exceptional same-day correction, policy controlled)
```

`HELD` is an open order with no kitchen commitment. `CONFIRMED` creates kitchen work. Payment status is tracked independently because restaurants may pay before or after preparation.

## Allowed transitions

| From | To | Required conditions |
|---|---|---|
| Draft | Held | At least one valid line |
| Draft/Held | Confirmed | Valid prices/taxes, branch open, items available, version matches |
| Confirmed | Preparing | Kitchen accepts ticket or policy auto-accepts |
| Preparing | Ready | All required kitchen items are ready |
| Ready | Served/Dispatched | Service or dispatch acknowledgement |
| Any active state | Cancelled | Permission; reason; payment reversal if any; kitchen notified if confirmed |
| Served/Dispatched | Completed | Required payment balance is zero, unless authorized pay-later |
| Completed | Partially refunded | Refund is positive and below refundable balance |
| Completed/Partially refunded | Refunded | Refunds equal refundable balance |
| Completed | Voided | Manager permission, configured time window, reason and reversal records |

## Independent state dimensions

Do not overload one order status with every subsystem state.

- Payment: unpaid, partially paid, paid, partially refunded, refunded, failed.
- Fulfilment: not started, confirmed, preparing, ready, served/dispatched, completed.
- Fiscal: not required, pending, accepted, rejected, needs review.
- Print: not requested, queued, printed, failed.
- Sync: local pending, synchronized, conflict, needs review.

## Invariants

- Only the server calculates authoritative totals.
- Confirmed lines preserve product/variant/modifier names and price/tax snapshots.
- Completed orders are not edited in place.
- Cancellation, void and refund are distinct business events.
- Every transition records previous state, new state, actor, device, timestamp, reason and correlation ID.
- Repeated commands with one idempotency key return the original outcome.
- Updates to an active order require its current version.
- Kitchen cancellation/re-fire is an event; deleting a line cannot erase what the kitchen saw.
- Business date is derived using branch policy/timezone and stored on finalization.

## Conflict behavior

- If the submitted version is stale, return `409 ORDER_VERSION_CONFLICT` and the current version.
- If a line becomes unavailable before confirmation, return affected line IDs and keep the order editable.
- If payment succeeded but client acknowledgement was lost, idempotent retry returns the existing payment.
- If fiscal submission is unavailable, follow branch policy: queue a pending record or block finalization; never pretend it was accepted.
