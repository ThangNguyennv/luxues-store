/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ANOTHER_VAR: string
  // Add all your env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}