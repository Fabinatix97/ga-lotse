## Direction structure

- `sw/` service-worker code
- `sw/inspection` service-worker code specific to inspections
- `common/` code shared between service-worker and main thread (mostly message definitions)

## Files of note

- `sw/config.ts`: Global configuration
- `sw/index.ts`: Declaration of routes
- `sw/StripRscRequestPlugin.ts`: Important hack to preload Next.js RSCs

## Handling api request by service worker when offline

GET requests are answered from the cache.

Individual handlers for DELETE, PATCH, POST, PUT do two things:

- Store the request in a queue, so they may be replayed to the server when online.
- Manipulate the stored cache objects, so subsequent GET requests answer with the updated data.
