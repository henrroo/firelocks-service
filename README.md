# firelocks-service

Small TypeScript service that exposes a REST endpoint and proxies it to the Fireblocks **Create Transaction** API.

## Stack

- Node.js + TypeScript
- Express
- Axios
- JWT (RS256) for Fireblocks auth
- Jest + Supertest for tests

## Prerequisites

- Node 18+
- A Fireblocks API key and API secret (private key in PEM format)

## Setup

```bash
git clone <your-repo-url>
cd firelocks-service
npm install
cp .env.example .env
# Edit .env and set FIREBLOCKS_API_KEY and FIREBLOCKS_PRIVATE_KEY
