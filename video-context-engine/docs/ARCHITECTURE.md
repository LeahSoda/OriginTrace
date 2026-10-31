# Architecture

Browser UI (`frontend/`, Vite on port 5173) → `/api` Vite development proxy → Express API (`backend/`, port 3001) → FFmpeg sampled frames → optional Meta Model API (Muse Spark) image analysis → optional Tavily web discovery → heuristic evidence ranking → JSON report.

- `POST /api/analyze` accepts multipart `video` or text `url`.
- `GET /api/health` reports whether optional service credentials exist.
- URL input **does not fetch the video** and cannot reconstruct visual context by itself. Upload an authorized copy.
- Dates from search results are not guaranteed publication or recording dates. Earliest retrieved dated page ≠ first web appearance.
- Source-domain heuristic and chronological proximity are **not** a fact-check verdict. Corroboration is unimplemented (zero).
- Never expose API keys to the frontend. User uploads are deleted after each request.
- Before production add auth, rate limiting, file signature verification, scanning, structured error handling, and legally compliant media ingestion.
