# Research Surveys → IRNOS integration

The public survey remains at `insightrecoverynetwork.com`. IRNOS is the staff-facing operational system of record.

## Website deployment variables

- `IRN_OS_SURVEY_BASE_URL=https://irnos.online/api/integrations/website/surveys`
- `IRN_SURVEY_SERVICE_API_KEY=<same long random value in both deployments>`
- `SURVEY_HASH_SALT=<separate long random value used only for duplicate flagging>`

## IRNOS deployment variables

- `IRN_SURVEY_SERVICE_API_KEY=<same value as the website>`
- `IRN_WEBSITE_SURVEY_CONTROL_ENDPOINT=https://www.insightrecoverynetwork.com/api/integrations/irnos/surveys/status`

## Delivery and recovery

The website stores every response locally before attempting delivery. Delivery is idempotent by submission token and website response ID. A background worker synchronises definitions and retries undelivered responses every five minutes, including responses collected before this integration was deployed.

Do not delete the website survey tables. They are the delivery outbox and safety copy. IRNOS exposes response review, exclusion/restoration, notes, status control and CSV export to users with `research:view` / `research:manage` permissions.

## Deployment order

1. Deploy IRNOS code and apply `migrations/20260721_research_surveys.sql` through the guarded additive migration runner.
2. Configure the shared service key and website control endpoint in IRNOS.
3. Deploy the website code with the IRNOS base URL, the same service key and a persistent survey hash salt.
4. Confirm the survey definition appears in IRNOS, then confirm existing response counts reconcile.
5. Submit one labelled internal test response, verify it in IRNOS and exclude it from analysis.

Unknown IRNOS `/api/*` routes now return JSON `404`; the website also rejects non-JSON or malformed acknowledgements, preventing false-positive deliveries.
