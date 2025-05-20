# Roadmap: "Observer" NPM Module

## Vision

To create an opinionated, batteries-included NPM module named "Observer" that centralizes observability functionalities (Error Tracking, Web Analytics, Product Analytics, Session Replay) for a tech stack comprising:

*   **Frontend:** SolidJS
*   **Backend:** Fastify with tRPC
*   **Logging/Metrics Infrastructure:** Winston, Loki, Prometheus, Grafana (WLPG)
*   **Session Replay:** rrweb for recording, MinIO for storage

The "Observer" module will provide client-side and server-side components to make instrumenting applications straightforward and consistent.

## Guiding Principles

*   **Opinionated:** Provide clear, well-defined ways to achieve observability for the target stack.
*   **Developer Experience (DX):** Easy to install, configure, and use. Provide hooks, components, and plugins where appropriate.
*   **Modular:** The project uses a monorepo structure (pnpm workspaces) for sub-packages: `@observer/core`, `@observer/client` (for SolidJS), and `@observer/server` (for Fastify/tRPC).
*   **Extensible (where it makes sense):** While opinionated, allow for necessary configurations and customizations.
*   **Comprehensive Documentation:** Essential for adoption and maintenance.

---

## Phase 0: Pre-requisites & Foundational Setup (User's Environment)

*This phase is about ensuring the target environment where "Observer" will be used is ready. The module itself won't set these up but will assume their existence and configurability.*

1.  **WLPG Stack Deployment:**
    *   Ensure Grafana, Loki, and Prometheus are deployed and accessible.
    *   Document recommended basic configurations for each (e.g., Loki data retention, Prometheus scrape intervals).
2.  **MinIO Deployment:**
    *   Ensure MinIO (or an S3-compatible object storage) is deployed and accessible.
    *   Document requirements for bucket creation and access credentials.
3.  **Winston Setup in Host Applications:**
    *   The module should ideally integrate with or provide utilities for an existing Winston logger instance in both client (Node.js context for SSR/dev) and server applications.
    *   Define how "Observer" will receive or configure the Winston instance it should use, especially for routing its logs to Loki. (e.g. user passes their configured Winston instance, or Observer provides a pre-configured one based on env vars).

---

## Phase 1: "Observer" Project Setup & Core Module Structure

1.  **Project Initialization:**
    *   [x] Chose a monorepo structure using pnpm workspaces.
    *   [x] Initialize the project with TypeScript.
    *   [x] Setup ESLint, Prettier, and other linting/formatting tools.
    *   [x] Setup a testing framework (e.g., Vitest, Jest).
2.  **`@observer/core` Package:**
    *   [ ] Define common TypeScript types (e.g., for events, configuration options).
    *   [ ] Develop a centralized configuration mechanism:
        *   How users will provide URLs (Loki, Observer backend endpoint, MinIO), API keys, service names, environment (dev/prod), etc.
        *   Support for environment variables and/or programmatic configuration.
        *   Schema validation for configuration (e.g., using Zod).
    *   [ ] Basic utility functions (e.g., UUID generation, environment detection).
3.  **`@observer/client` Package (for SolidJS):**
    *   [ ] Initial setup for a SolidJS library/utility package.
    *   [ ] Build process (e.g., Vite library mode, tsup).
4.  **`@observer/server` Package (for Fastify/tRPC):**
    *   [ ] Initial setup for a Fastify plugin / tRPC middleware package.
    *   [ ] Build process.
5.  **Initial Documentation Structure:**
    *   [x] Setup a documentation system (e.g., VitePress, Docusaurus, or just Markdown files).
    *   [ ] Outline main sections: Introduction, Setup, Configuration, API Reference for each module, Recipes/Examples.

---

## Phase 2: Enhanced Error Tracking

1.  **`@observer/client` (SolidJS):**
    *   [ ] Develop a SolidJS error boundary component or utility to capture rendering errors.
    *   [ ] Implement global error handlers for:
        *   `window.onerror` (unhandled script errors)
        *   `window.onunhandledrejection` (unhandled promise rejections)
    *   [ ] Function to manually capture errors (`observer.captureException(error, context)`).
    *   [ ] Enrich client-side errors with:
        *   User agent, URL, timestamp.
        *   Session ID, User ID (if available through configuration/integration).
        *   Stack trace (ensure it's properly serialized).
    *   [ ] Mechanism to send captured errors to a configurable backend endpoint provided by `@observer/server`.
2.  **`@observer/server` (Fastify/tRPC):**
    *   [ ] Create a Fastify plugin that exposes an endpoint (e.g., `/api/observer/errors`) to receive client-side errors.
    *   [ ] Validate incoming error payloads.
    *   [ ] Integrate with Winston: Use the configured Winston instance to log received client-side errors to Loki. Ensure structured logging with all relevant fields.
    *   [ ] Develop tRPC middleware to automatically capture and log errors occurring within tRPC procedures.
        *   Enrich with tRPC path, input (optionally sanitizing sensitive data).
    *   [ ] Fastify error handling hook to capture general server-side errors.
    *   [ ] Utility to manually capture server-side errors (`observer.captureServerException(error, context)`).
    *   [ ] Ensure server-side logs include trace IDs if available from Fastify/tRPC.
3.  **Winston Integration:**
    *   [ ] Ensure both client-originated and server-originated errors are logged with consistent, queryable fields in Loki (e.g., `level`, `message`, `stack_trace`, `error_type`, `source: 'client' | 'server'`, `url`, `user_agent`, `session_id`, `user_id`, `trpc_path`).
4.  **Documentation:**
    *   [ ] How to set up error tracking in SolidJS.
    *   [ ] How to set up error tracking in Fastify/tRPC.
    *   [ ] Example LogQL queries for common error analysis in Grafana.

---

## Phase 3: Web & Product Analytics Core

1.  **`@observer/core`:**
    *   [ ] Define standard event structures for page views and custom product events.
    *   [ ] Utilities for managing `visitor_id` (long-term, e.g., via localStorage) and `session_id` (short-term, e.g., via sessionStorage or cookie).
2.  **`@observer/client` (SolidJS):**
    *   [ ] **Page View Tracking:**
        *   Automatic page view tracking on route changes (integration with `solid-router` or manual trigger).
        *   Capture: URL, referrer, document title, screen dimensions, language.
    *   [ ] **Custom Event Tracking:**
        *   `observer.track('eventName', { /* properties */ })` function.
        *   Consider SolidJS-specific helpers (e.g., a directive or hook to track clicks).
    *   [ ] Batching mechanism: Collect events and send them periodically or when a certain number is reached to the backend.
    *   [ ] Associate events with `visitor_id`, `session_id`, and `user_id` (if available).
3.  **`@observer/server` (Fastify/tRPC):**
    *   [ ] Create a Fastify plugin exposing an endpoint (e.g., `/api/observer/events`) to receive analytics events from the client.
    *   [ ] Validate incoming event payloads.
    *   [ ] Use Winston to log received analytics events to Loki with structured fields (e.g., `event_type: 'page_view' | 'custom_event'`, `event_name`, `url`, `session_id`, `visitor_id`, `user_id`, `properties: { ... }`).
    *   [ ] Allow server-side tracking of events if needed: `observer.trackServerEvent('eventName', { /* properties */ }, { userId, sessionId })`.
4.  **Documentation:**
    *   [ ] How to set up page view and custom event tracking.
    *   [ ] Best practices for naming events and properties.
    *   [ ] Example LogQL queries for analytics (e.g., unique visitors, top pages, event counts, simple funnels).
    *   [ ] Guidance on creating basic analytics dashboards in Grafana.

---

## Phase 4: Session Replay (rrweb + MinIO)

1.  **`@observer/client` (SolidJS):**
    *   [ ] Integrate `rrweb` for recording:
        *   Provide a simple API to initialize and start/stop recording (`observer.sessionReplay.start()`, `observer.sessionReplay.stop()`).
        *   Configurable `rrweb` options (e.g., sampling rate, masking sensitive inputs). Default sensible masking.
    *   [ ] Logic to buffer `rrweb` events.
    *   [ ] Mechanism to periodically send batches of `rrweb` events (e.g., gzipped) to a dedicated server endpoint.
        *   Associate batches with `session_id`.
    *   [ ] Handle `rrweb` errors during recording.
2.  **`@observer/server` (Fastify/tRPC):**
    *   [ ] Create a Fastify plugin with an endpoint (e.g., `/api/observer/replay-events`) to receive `rrweb` event batches.
        *   Handle potentially large gzipped payloads.
    *   [ ] MinIO Integration:
        *   Configure MinIO client (endpoint, bucket, accessKey, secretKey) via `@observer/core` config.
        *   Logic to store received `rrweb` event batches in MinIO.
            *   Organize by `session_id` (e.g., `bucket/replays/{session_id}/{timestamp_or_sequence}.json.gz`).
    *   [ ] Logging Session Metadata to Loki:
        *   When a session replay starts (or first batch of events is received): log `event_type: 'session_replay_started'`, `session_id`, `user_id`, `initial_url`, `start_time`.
        *   Log errors encountered during server-side processing of replay data.
        *   (Optional) Log session end or periodic heartbeats.
3.  **`@observer/client` or Example Application (Replayer):**
    *   [ ] (Stretch Goal for V1, or provide as an example) Develop a basic UI component (SolidJS) or standalone page that can:
        *   Take a `session_id`.
        *   Fetch the corresponding `rrweb` events from MinIO (via a new secure server endpoint in `@observer/server`).
        *   Use `rrweb-player` to replay the session.
4.  **Documentation:**
    *   [ ] How to set up session replay recording.
    *   [ ] Configuration options for `rrweb` and MinIO.
    *   [ ] How to find and (manually at first) replay sessions (e.g., by `session_id` found in Loki error logs).
    *   [ ] Security considerations (masking, access to replay data).

---

## Phase 5: Prometheus Integration

1.  **`@observer/server` (Fastify/tRPC):**
    *   [ ] Develop a Fastify plugin to expose a `/metrics` endpoint compatible with Prometheus.
    *   [ ] Use a library like `prom-client`.
    *   [ ] Expose default metrics:
        *   HTTP request counts, durations, status codes (often provided by Fastify plugins like `fastify-metrics`).
        *   tRPC procedure call counts, durations, success/error rates.
    *   [ ] Expose "Observer"-specific metrics:
        *   Number of errors captured (client/server).
        *   Number of analytics events processed.
        *   Number of session replay events ingested/batches processed.
    *   [ ] Provide utilities for users to define and register their own custom application metrics.
2.  **Documentation:**
    *   [ ] How to enable and configure the `/metrics` endpoint.
    *   [ ] List of default metrics exposed.
    *   [ ] How to add custom Prometheus metrics.
    *   [ ] Example Prometheus scrape configuration.
    *   [ ] Example Grafana dashboard setup for these metrics.

---

## Phase 6: Tooling, Developer Experience (DX), and Documentation Refinement

1.  **SolidJS Enhancements (`@observer/client`):**
    *   [ ] Explore SolidJS-specific utilities:
        *   Context provider for easy access to Observer client instance.
        *   Hooks (`useObserver()`, `useTrackEvent()`).
        *   Higher-Order Components or directives for declarative tracking.
2.  **Fastify/tRPC Enhancements (`@observer/server`):**
    *   [ ] Refine Fastify plugins and tRPC middleware for ease of use and robustness.
    *   [ ] Consider decorators if they simplify usage for certain patterns.
3.  **Comprehensive Documentation:**
    *   [ ] **Installation & Setup Guide:** Detailed steps for each package.
    *   [ ] **Configuration Reference:** All available options and their defaults.
    *   [ ] **API Documentation:** For all public functions, components, hooks.
    *   [ ] **Recipes/Tutorials:**
        *   Setting up basic error tracking.
        *   Tracking user sign-up funnel.
        *   Finding session replays associated with an error.
        *   Building a basic analytics dashboard in Grafana.
    *   [ ] **Troubleshooting Guide.**
4.  **Example Project:**
    *   [ ] Create a simple SolidJS + Fastify/tRPC example application that fully integrates all features of "Observer".
    *   [ ] Include Docker Compose setup for WLPG + MinIO for easy local testing of the example.
5.  **Testing Strategy:**
    *   [ ] Unit tests for core logic, utilities, and individual components.
    *   [ ] Integration tests for client-server interactions (e.g., event sending/receiving).
    *   [ ] End-to-end tests for the example application (optional but highly valuable).
6.  **Performance Considerations:**
    *   [ ] Analyze client-side bundle size impact.
    *   [ ] Optimize event batching and transmission.
    *   [ ] Ensure server-side processing is efficient.

---

## Phase 7: Packaging & Publishing

1.  **NPM Package Configuration:**
    *   [ ] Configure `package.json` for each package (`@observer/core`, `@observer/client`, `@observer/server`).
    *   [ ] Define main entry points, types entry points, module formats (ESM, CJS if needed).
    *   [ ] Manage dependencies and peer dependencies correctly.
2.  **Build and Release Process:**
    *   [ ] Script for building all packages.
    *   [ ] Versioning strategy (e.g., SemVer).
    *   [ ] Automated process for publishing to NPM (e.g., using GitHub Actions).
    *   [ ] Changelog generation.
3.  **Community & Feedback:**
    *   [ ] Setup a GitHub repository.
    *   [ ] Define contribution guidelines.
    *   [ ] Create issue templates.

---

## Post V1.0 / Future Considerations

*   **Advanced Analytics Querying:** Investigate if helper utilities or a DSL can be built on top of LogQL for common product analytics queries, or if direct integration/export to an OLAP DB (like ClickHouse) should be a supported path for advanced users.
*   **Sampling Configuration:** More sophisticated client-side sampling for analytics and session replay.
*   **Data Privacy & Compliance:** Tools/guides for GDPR, CCPA (e.g., easy data export/deletion hooks, more granular PII masking).
*   **Alerting Integration:** Provide guidance or utilities for setting up alerts in Grafana based on Observer data.
*   **OpenTelemetry (OTel) Integration:** Explore aligning with or integrating OTel standards for broader compatibility.
*   **Feature Flags Integration:** Connect analytics/error tracking to feature flag usage.
*   **Performance Tracing:** Deeper integration for performance monitoring (though Prometheus covers some of this).

This roadmap is comprehensive and ambitious. Remember to break it down into smaller, manageable tasks and iterate. Good luck with building "Observer"!