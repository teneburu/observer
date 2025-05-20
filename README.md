# 👁 Observer

This is the monorepo for the "Observer" NPM module, a batteries-included solution for centralized observability (Error Tracking, Web Analytics, Product Analytics, Session Replay).

## Vision

To provide an opinionated observability solution for tech stacks including SolidJS, Fastify with tRPC, and a logging/metrics infrastructure based on Winston, Loki, Prometheus, and Grafana (WLPG), with session replay using rrweb and MinIO.

## Structure

This project uses pnpm workspaces and is structured as follows:

- `packages/core`: Core utilities, types, and configuration.
- `packages/client`: Client-side library for SolidJS applications.
- `packages/server`: Server-side library for Fastify/tRPC applications.

## Getting Started

1.  Ensure you have `pnpm` installed (`npm install -g pnpm`).
2.  Clone the repository.
3.  Run `pnpm install` in the root directory to install all dependencies and link workspace packages.

See the [ROADMAP.md](ROADMAP.md) for the project plan and [CHANGELOG.md](CHANGELOG.md) for the history of changes. 