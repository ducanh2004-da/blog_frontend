// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BACKEND_URL: string;
  readonly VITE_SOME_FLAG?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
