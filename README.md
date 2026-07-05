# Image Cataloging

A serverless web app that catalogs images in three AI-powered layers:

1. **Objects** — image classification labels with confidence (`@cf/microsoft/resnet-50`)
2. **Describe** — natural-language caption (`@cf/meta/llama-3.2-11b-vision-instruct`)
3. **Concepts** — abstract themes and ideas (same vision model + `@cf/baai/bge-base-en-v1.5` embeddings)

Built on [Cloudflare Workers](https://workers.cloudflare.com/) with Workers AI, D1, and optional R2 storage.

**Live demo:** https://image-des.mahsatorabi515.workers.dev

## Architecture

```
Upload image → Worker API
  ├─ Layer 1: ResNet-50 image classification (objects)
  ├─ Layer 2+3: Llama Vision (description + concepts)
  └─ BGE embeddings → D1 database (semantic search)
```

## Project structure

| Path | Purpose |
|------|---------|
| `src/index.ts` | HTTP routes, UI, and API handlers |
| `src/catalog.ts` | Three-layer AI pipeline |
| `schema.sql` | D1 database schema |
| `wrangler.jsonc` | Cloudflare bindings (AI, D1, R2) |

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare account](https://dash.cloudflare.com/) (free tier works)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Install

```bash
npm install
npx wrangler login
npx wrangler d1 create image-catalog
```

Copy the `database_id` from the output into `wrangler.jsonc`.

### Database

```bash
npm run db:migrate:local    # local dev
npm run db:migrate:remote   # production
```

### Run locally

```bash
npm run dev
```

Open http://localhost:8787

### Deploy

```bash
npm run deploy
```

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Upload UI |
| `POST` | `/api/catalog` | Upload image, run all 3 layers |
| `GET` | `/api/catalog/:id` | Get a catalog entry |
| `GET` | `/api/search?q=...` | Semantic search |

## Free tier

Workers AI includes **10,000 neurons/day** free. See [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/).

## License

MIT
