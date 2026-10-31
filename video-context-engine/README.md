# OriginTrace — Video Context Engine

An evidence-led viral video context research prototype. Separate **Vite frontend** + **Express backend** in npm workspaces.

## 1. Install Node.js and npm (macOS)

Use the official Node.js LTS installer at https://nodejs.org/en/download, then restart Terminal. npm is bundled with Node.js.

Alternatively, with Homebrew installed: `brew install node`.

Check both installations:

```bash
node --version
npm --version
```

Recommended: Node.js 22 LTS or newer compatible release (minimum `>=20.19.0`).

## 2. Install this project's dependencies

From the **project root** (`video-context-engine/`):

```bash
npm install
cp .env.example .env
npm run dev
```

Visit http://localhost:5173 (frontend). Backend: http://localhost:3001. The Vite proxy forwards frontend `/api/*` requests to Express.

You can also run each process separately, using two terminals in the root directory:

```bash
npm run dev:frontend
npm run dev:backend
```

## 3. Optional analysis configuration

Edit `video-context-engine/.env` with `MODEL_API_KEY` from the [Meta Model API dashboard](https://dev.meta.ai/) and optionally `TAVILY_API_KEY` for evidence search. Set `META_MODEL=muse-spark-1.3` (the default), or another model available to your account that supports images and structured output. **Never commit `.env`.** Credentials are read only by Express; never put them in frontend code or `VITE_*` variables. Restart the backend after changing configuration. Install FFmpeg for uploaded video frame extraction:

```bash
brew install ffmpeg
ffmpeg -version
```

Without credentials the UI/API still starts, but results show limited evidence. With an authorized video upload + FFmpeg + Meta Model API key, the backend samples up to five frames at approximately five-second intervals for visual description, derives search terms, and uses Tavily if configured for web results.

The backend sends sampled JPEGs to `https://api.meta.ai/v1/chat/completions` using bearer authentication, base64 `image_url` blocks, and a strict JSON schema. It preserves the existing analysis response fields and returns limited results with warnings when Meta is unavailable, refuses, or returns invalid/incomplete output. `/api/health` reports whether a Meta key is configured; it does not verify access. No audio is analyzed. A request times out after 60 seconds and is not automatically retried.

Implementation references: Meta's [Chat Completions reference](https://dev.meta.ai/docs/api-reference/chat-completions/create-chat-completion), [image understanding](https://dev.meta.ai/docs/image-understanding), and [structured output](https://dev.meta.ai/docs/structured-output) documentation (checked October 30, 2026). Your account needs Model API access to the selected model; an OpenAI or Facebook Graph API token will not work. Sending an uploaded video for analysis can incur Meta usage charges; Tavily search may also incur charges. Local checks and mocked tests require no API credentials and make no paid calls.

**Known limitations:** An Instagram/TikTok URL alone is not downloaded, searched, or interpreted. The earliest dated *retrieved* source is not proof of the original video or the first upload. Search indexes may omit publication dates. The ranking score is a transparent **heuristic** of domain class (50%), date proximity (30%), and corroboration (20%); corroboration currently remains 0, not a measured finding. The system does not perform reverse-video matching or validate individual factual claims yet.

## Directory structure

```text
video-context-engine/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.js
│   │   ├── styles.css
│   │   └── components/
│   └── public/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── routes/analysis.js
│   └── services/
│       ├── videoAnalyzer.js
│       ├── sourceDiscovery.js
│       └── evidenceRanking.js
├── data/samples/
├── docs/ARCHITECTURE.md
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Commands

- `npm run dev` — both frontend and backend
- `npm run dev:frontend` — frontend only
- `npm run dev:backend` — backend only
- `npm run test -w backend` — offline integration tests with mocked provider responses
- `npm run check` — syntax checks
- `npm run build -w frontend` — production frontend assets

The backend is a development API; production serving/deployment is not configured.
