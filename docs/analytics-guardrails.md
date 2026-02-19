# Analytics Guardrails (GTM + dataLayer + GA4)

## Do not change these placements
- Keep `window.dataLayer = window.dataLayer || [];` before GTM script in `<head>`.
- Keep GTM `<noscript>` iframe as the first element in `<body>`.
- Keep GTM container ID aligned in both places (`GTM-KP36HMH5`).

## Event tracking contract
- Use `window.trackEvent("event_name", {...})` for custom events.
- Attach interaction tracking with:
  - `data-analytics-event="event_name"`
  - `data-analytics-label="optional_label"`
  - `data-analytics-section="section_name"` on a parent section
- Avoid binding analytics to CSS classes; classes can change with redesigns.

## GA4 mapping in GTM
- GA4 Event tag should read:
  - Event name from `{{Event}}`
  - Parameters from dataLayer keys (`event_label`, `section`, `page_title`, `page_path`, `analytics_version`)
- Validate in GTM Preview + GA4 DebugView after major UI changes.

## Release checklist
1. Open GTM Preview and verify `portfolio_page_ready` fires on page load.
2. Click each tracked element and verify `portfolio_case_click` with correct `event_label`.
3. Confirm events arrive in GA4 DebugView.
