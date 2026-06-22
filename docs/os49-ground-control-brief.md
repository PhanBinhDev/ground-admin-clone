# OS49 — "Ground Control" super-admin dashboard + Vitals health score
### Build brief · v3 (final — grounded in the consolidated production schema)

Attached alongside this brief: `os49-ground-control.html` — a working prototype on mock data. It is the reference for both the **visual design** and the **scoring logic**. The JS functions `gate()`, `rawScore()`, `vitals()` and `band()` are the canonical formula — port them as-is. All companies/numbers in it are fictional.

---

## 0. Confirmed architecture

Everything runs on **one Supabase project** (`club49-system`, eu-central-1, "SMALL"). Auth and all 5 apps live here. Data is separated by **schema**, not by project:

- `public` — Mission Control
- `operations` — Ops Grid
- `strategic` — Strategic Base
- `payments` — billing, plans, subscriptions, invoices (shared across apps)

The standalone Mission Control / Operations Grid / Strategic Base projects are **legacy** — ignore them. Because it's one database with one `auth.users`, cross-app joins are trivial: every app's `user_id` references the same `auth.users.id`. This removes the cross-project sync that an earlier version of this brief assumed. (The US-region concern is also gone — this project is in the EU.)

---

## 1. Where it lives

- Not a separate product or domain. An extra item in the existing **Mission Control header menu** (alongside Dashboard / Bookkeeping / Profit Protector / Mission Control), reached via the normal login. Tibor already logs in almost daily to monitor CLUB49 cash and KPIs; this sits in the same place.
- The menu item renders **only if the logged-in user has the `os49_admin` role**. Hiding the tab is cosmetic — every data call must verify the role **server-side**, because this surface reads **across all customer accounts** (cross-tenant) and exposes contact data, ARR and churn risk. A user without the tab must still be blocked at the API level.

---

## 2. Central data layer — the one real build in phase 1

The score reads from many schemas, but it should not query 10 tables live. Build **one central, append-only events table** that every app writes a standardised row to, and Ground Control reads only from there. Model it on the table Ops Grid already has (`operations.events`), but add the two fields that table is missing — `account_id` and `app`:

```
public.os49_events           -- or its own schema, e.g. core.events
  ├─ event_id     bigint identity
  ├─ account_id   uuid        -- the owning customer account (see note below)
  ├─ user_id      uuid        -- auth.users.id of the actor (admin or employee)
  ├─ app          text        -- 'mission_control' | 'ops_grid' | 'strategic_base'
  ├─ event_type   text
  ├─ occurred_at  timestamptz default now()
  └─ payload      jsonb
```

> **account_id resolution.** An account = the customer organisation (the owner/admin), and employees' events must roll up to it. Use the existing team/company tables to map any `user_id` → owning account: `public.team_members.admin_id` (MC), `operations.grid_members` / grid owner (Ops), `strategic.companies.owner_id` + `strategic.company_employees` (Strat). `payments.accounts` (1:1 with `auth.users`) is the billing identity to anchor on. Confirm the canonical account key with the team.

### Event types Ground Control consumes — status per app
Legend: ✅ already emitted/derivable · ⚠️ exists as data, needs an emit · ❌ missing, must be built

**Mission Control** (`public`)
- ⚠️ `user_login` — `auth.users.last_sign_in_at` / `user_platforms.last_access_at`
- ⚠️ `kpi_updated` — `metric_results` only timestamps creation today; add an emit on *update* too
- ⚠️ `transaction_uploaded` — `transactions.created_at`; emit on insert
- ⚠️ `ai_advisor_used` — `ai_advisor_analyses` stores one summary row per user per month, not per interaction; emit per interaction if we want true adoption frequency
- ⚠️ `grip_score_snapshot` — `grip_score_history` already stores monthly score + pillars; mirror to events
- ❌ `profit_protector_viewed` — not tracked; low priority

**Ops Grid** (`operations`)
- ✅ `user_login`, `onboarding_completed`, `create_grid` — already in `operations.events`
- ❌ `sop_completed` — **missing as an event.** Lives only in `operations.sop_owner` (`status`, `deadline`). Add an emit on check-off with `payload: { on_time, is_critical, grid_id }`. **Highest-priority gap** — this is the daily team habit and the core anti-churn signal.

**Strategic Base** (`strategic`)
- ✅ `plan_created` — `strategic.activity_metadata` already emits `year_plan_completed` / `quarter_plan_completed` (incl. `is_employee_plan`); map through
- ✅ `app_opened` — `strategic.user_platforms` (enum)

**All apps**
- ⚠️ Standardise `app_opened` from each schema's `user_platforms`.

### Account master data — mostly already exists in `payments`
Good news: the `payments` schema already holds most of it. Don't rebuild — read/derive:

- **Tier / which apps** — `payments.plans.app_slugs[]` + `is_bundle` + `hierarchy_score`. The Core bundle and the single-layer plans already exist here. (This answers the open "where does tier live" question — it's already modelled.)
- **Seats granted** — `payments.plans.included_seats_per_app` (**default 9 per app** — confirm 9 vs 6) + `payments.subscription_seats.extra_seats` (the €50/seat upsell; table exists, currently 0 rows).
- **Renewal / billing period** — `payments.subscriptions.current_period_end`, `billing_interval`, `status` (`active|suspended|canceled|…`), `cancel_at_period_end`.
- **Contact details** — `payments.accounts` (`email`, `billing_name`, `billing_phone`, company, address).
- **ARR / MRR** — **derivable, not stored.** MRR = active subscriptions → plan price (`price_monthly_cents`, or `price_yearly_cents/12`) + extra-seat charges, normalised to monthly; ARR = MRR × 12. Expose as a view.
- **Active seat utilisation** — **must be computed**: distinct active users per app (from events) ÷ (`included_seats_per_app` + `extra_seats`).
- **CS owner** — new field, set in the dashboard.

---

## 3. Scoring logic — port exactly from the HTML

Four dimensions, each 0–100, then weighted:

- **Ritme 30%** — recurring loops: weekly `kpi_updated` (MC), weekly `sop_completed` (Ops), transaction-upload cadence (MC). `public.user_streaks` is a ready-made cadence signal.
- **Verankering 30%** — active seats ÷ granted seats, AND breadth beyond the admin: distinct active users, employees completing SOPs, number of active KPI owners (`mission_metrics.owner`).
- **Adoptie 20%** — of the apps/features the account is entitled to, how many are actively used (`app_opened` across owned apps, `ai_advisor_used`, `plan_created`; `profit_protector_viewed` low).
- **Resultaat 20%** — Grip Score trend (`grip_score_history`), targets-met trend (`mission_metrics.status` green/orange/red), existence of year/quarter plans (`strategic.year_plans` / `quarter_plans`) and role/100-day plans.

**Formula:**
```
raw   = ritme*0.30 + verank*0.30 + adoptie*0.20 + result*0.20      // 0–100
gate(days_since_last_meaningful_action):
         <=3 → 1.0 | <=7 → 0.9 | <=14 → 0.75 | <=30 → 0.55 | >30 → 0.4
vitals = round(raw * gate)
```
Bands: `>=70` green · `40–69` amber · `<40` red.
**Purple (ambassador)** = `vitals >= 70` AND ≥1 advocacy signal (review, referral, NPS promoter, case-study consent, active on CLUB49). Purple is an overlay on green, not a score band.

**Entitlement normalization:** compute each dimension only from the apps the account owns (read entitlement from `payments.plans.app_slugs`). If a dimension has no inputs, drop it and renormalise weights across the rest. A single-layer account is never penalised for lacking the others.

**Config, not constants:** weights and gate thresholds go in a versioned `score_config` table. Because `os49_events` is append-only we can **recompute history** when we tune them. Store a periodic Vitals snapshot per account (daily or on event) for trend history.

---

## 4. Push messages
```
push_messages(id, account_id, body, created_by, status, created_at, seen_at)
  status: queued | seen | dismissed
```
On next login, if a queued message exists for that account, show it as a dismissible overlay over their dashboard; mark seen/dismissed. In-app only.

---

## 5. Front-end
Replicate the attached HTML on real data: fleet-status bar, band/tier/search filters, account table, multi-select, CSV export of selected contacts, and the detail drawer ("how this is calculated" with dimensions + visible recency-gate multiplier, contact block, seat usage, per-app adoption, ambassador signals, telemetry timeline). Dark operator theme, super-admin only.

---

## 6. Access control — managed by Tibor
- One role: `os49_admin` — full access (vitals, churn list, contact, ARR, exit data, push, export). No tiered variant; consistent with OS49's full-transparency culture.
- Tibor assigns/revokes it from a "Team-toegang" panel, picking from existing users. `os49_admin` is an **additional** grant on top of a normal account.
- Add `os49_roles(user_id, role, granted_by, granted_at)`.
- Note: this gates **cross-tenant customer data**. Public transparency about OS49's *own* numbers is separate and doesn't change that **customer** contact/churn/ARR data stays behind the login + server-side role check (AVG/GDPR).

---

## 7. Suggested phasing
1. **Central `os49_events` table** (with `account_id` + `app`) + account→user resolution. Wire emits that exist (`operations.events`, `strategic.activity_metadata`), add missing ones — **`sop_completed` first**, then the MC emits. Backfill where feasible. Add `payments`-derived views for tier, seats, ARR/MRR, renewal.
2. **Config-driven score engine** (`score_config`) + periodic Vitals snapshot per account.
3. **Ground Control UI** on real data (replicate HTML), in the MC header, `os49_admin`-gated server-side.
4. **Push messages + CSV export + filters + Team-toegang panel.**

---

## 8. Open questions
1. **Seats: 9 or 6 included per app?** `payments.plans.included_seats_per_app` defaults to 9; Tibor expected admin + 5. Confirm — it's the denominator of the Verankering dimension.
2. **Canonical account key:** should `os49_events.account_id` anchor on `payments.accounts.id`, or on the owner's `auth.users.id`? And what's the agreed way to map an employee `user_id` to its owning account across all three schemas?
3. Within one DB with shared `auth.users`, is `os49_user_id` on `profiles` still needed, or is `auth.users.id` the single identity going forward?
