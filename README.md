![](./public/assets/banner.jpg)

# ChampMaps

[![Bun Badge](https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff&style=for-the-badge)](https://bun.sh)
[![Vite Badge](https://img.shields.io/badge/Vite-9135FF?logo=vite&logoColor=fff&style=for-the-badge)](https://vitejs.dev)
[![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge)](https://react.dev/)
[![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TypeScript Badge](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=fff&style=for-the-badge)](https://www.typescriptlang.org)
[![OpenStreetMap Badge](https://img.shields.io/badge/OpenStreetMap-7EBC6F?logo=openstreetmap&logoColor=fff&style=for-the-badge)](https://www.openstreetmap.org)
[![MapLibre Badge](https://img.shields.io/badge/MapLibre-000?logo=maplibre&logoColor=fff&style=for-the-badge)](https://maplibre.org/)
[![GitHub Badge](https://img.shields.io/badge/GitHub-fff?logo=github&logoColor=000&style=for-the-badge)](https://github.com/Champ-Deep/ChampMaps)
[![Cloudflare Badge](https://img.shields.io/badge/Cloudflare-F38020?logo=cloudflare&logoColor=fff&style=for-the-badge)](https://www.cloudflare.com)
[![Docker Badge](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=for-the-badge)](https://www.docker.com)

> Note: ChampMaps is still in development. Every feedback is appreciated. This is a for-fun, open-source project, and community contributions are very welcome.

## Features

- **Custom city map posters** for any location in the world, powered by real OpenStreetMap data
- **Smart geocoding** — search for any city or region by name, or enter coordinates manually
- **Rich theme system** — choose from dozens of curated themes or build your own custom color palette
- **Detailed map layers** — roads, water bodies, parks, and building footprints with per-layer styling
- **Typography controls** — set city/country display labels and load any Google Fonts family
- **High-resolution export** — download a print-ready poster as PNG, PDF, or SVG at any defined dimension
- **Contacts API** — connect an external contact database to display all contacts as themed markers on the map, with automatic address geocoding

## Contacts API

ChampMaps includes a built-in REST API server that lets you connect any external contact database or CRM. The API accepts contact records, geocodes their addresses via Nominatim, and renders them as themed markers on the map.

### Quick Start

```bash
# Start the API server (port 7201 by default)
bun run api

# Start the frontend (port 5173 by default)
bun run dev
```

In the UI, open the **Contact Map** section in the settings panel, enter `http://localhost:7201`, and click **Connect**.

### Importing Contacts

```bash
# Import contacts with address fields (geocoded automatically)
curl -X POST http://localhost:7201/api/contacts \
  -H 'Content-Type: application/json' \
  -d '[
    {"name": "Jane Doe", "company": "Acme", "city": "Berlin", "country": "Germany"},
    {"name": "John Smith", "email": "john@example.com", "address": "350 Fifth Avenue, New York, NY"}
  ]'

# Import contacts with pre-resolved coordinates (no geocoding needed)
curl -X POST http://localhost:7201/api/contacts \
  -H 'Content-Type: application/json' \
  -d '[{"name": "HQ Office", "lat": 48.8566, "lon": 2.3522}]'
```

### API Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/api/contacts` | Import one or more contacts (accepts a single object or an array) |
| `GET` | `/api/contacts` | List all contacts with their geocode status |
| `GET` | `/api/contacts/:id` | Get a single contact by ID |
| `DELETE` | `/api/contacts/:id` | Remove a single contact |
| `DELETE` | `/api/contacts` | Remove all contacts |
| `POST` | `/api/contacts/geocode` | Re-geocode all pending or failed contacts |
| `GET` | `/api/health` | Health check |

### Contact Input Fields

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `name` | string | yes | Display name |
| `email` | string | no | Email address |
| `phone` | string | no | Phone number |
| `company` | string | no | Company name |
| `lat` | number | no | Latitude (skips geocoding if both lat/lon are provided) |
| `lon` | number | no | Longitude |
| `address` | string | no | Full address string for geocoding |
| `street` | string | no | Street address |
| `city` | string | no | City |
| `state` | string | no | State or region |
| `country` | string | no | Country |
| `zip` | string | no | Postal code |
| `id` | string | no | External ID (auto-generated if omitted) |

The API uses **smart fallback**: if `lat` and `lon` are both present, they are used directly. Otherwise, the address fields (`address`, or `street`/`city`/`state`/`country`/`zip`) are geocoded via Nominatim.

## Data Providers and Mapping Stack

- **Map data**: [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)
- **Tiles**: [OpenMapTiles](https://openmaptiles.org/)
- **Tile hosting**: [OpenFreeMap](https://openfreemap.org/)
- **Geocoding**: [Nominatim](https://nominatim.openstreetmap.org/)
- **Map renderer**: [MapLibre](https://maplibre.org/)

## User Interface

![](./public/assets/screenshots/Web_UI.png)

## Showcase

All showcase images are stored in `public/assets/showcase/`.

### Featured Examples

<p align="center">
  <img src="./public/assets/showcase/showcase_1.png" alt="Featured showcase example 1" width="100%" />
  <img src="./public/assets/showcase/showcase_2.png" alt="Featured showcase example 2" width="100%" />
</p>

## Run

```bash
bun install
bun run dev
```

To also start the Contacts API server:

```bash
bun run api
```

## Environment

Check [`.env.example`](./.env.example) for available variables. They are optional for most local work and should not be set during testing unless a specific case requires them.

Key environment variables for the Contacts API:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `CONTACTS_API_PORT` | `7201` | Port for the Contacts API server |
| `VITE_CONTACTS_API_URL` | (empty) | URL the frontend uses to connect to the Contacts API |

## Build

```bash
bun run build
```

## Deploy with Docker (Self-Hosting)

Docker Compose runs two services: the frontend (Nginx on port 7200) and the Contacts API server (Bun on port 7201). Nginx proxies `/api/` requests to the API service automatically.

### 1) Build and run with Docker Compose

Create `.env` from `.env.example` (or set `APP_PORT` directly in your shell), then run:

```bash
docker compose up -d --build
```

This serves the app on `http://localhost:7200` and the Contacts API on `http://localhost:7201` by default.

To change the exposed host port:

- Linux/macOS:

```bash
APP_PORT=80 docker compose up -d --build
```

- PowerShell:

```powershell
$env:APP_PORT=80
docker compose up -d --build
```

### 2) Stop the deployment

```bash
docker compose down
```

### 3) Optional: build and run without Compose

```bash
# Frontend
docker build -t champmaps:latest .
docker run -d --name champmaps -p 7200:80 --restart unless-stopped champmaps:latest

# Contacts API
docker build -f Dockerfile.api -t champmaps-api:latest .
docker run -d --name champmaps-api -p 7201:7201 --restart unless-stopped champmaps-api:latest
```

## Contributing

> The contribution guidelines are meant to keep ChampMaps easy to extend, review, and maintain over time. They are here to support a durable architecture, not to add unnecessary friction.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

- Branch from `dev` and target `dev` only. Do not open PRs against `main`.
- Fill out the pull request template completely when you open a PR.
- Keep contributions clean, modular, and aligned with the existing architecture.
- Avoid hard-coded values when constants, configuration, or reusable abstractions are more appropriate.
- AI-assisted coding is allowed, but submissions must be reviewed, refined, and intentionally engineered before review.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Champ-Deep/ChampMaps&type=Date)](https://star-history.com/#Champ-Deep/ChampMaps&Date)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Trademark

The **ChampMaps™** name, logo, and branding assets are trademarks of the project owner.</br>
The MIT license grants you the right to use the code, but it does **not** grant any rights to use the project's name or branding for your own commercial purposes or hosted services.</br>
See [TRADEMARK.md](./TRADEMARK.md) for details.
