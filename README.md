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
- **High-resolution PNG export** — download a print-ready poster at any defined dimension

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

## Environment

Check [`.env.example`](./.env.example) for available variables. They are optional for most local work and should not be set during testing unless a specific case requires them.

## Build

```bash
bun run build
```

## Deploy with Docker (Self-Hosting)

### 1) Build and run with Docker Compose

Create `.env` from `.env.example` (or set `APP_PORT` directly in your shell), then run:

```bash
docker compose up -d --build
```

This serves the app on `http://localhost:7200` by default.

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
docker build -t champmaps:latest .
docker run -d --name champmaps -p 7200:80 --restart unless-stopped champmaps:latest
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
