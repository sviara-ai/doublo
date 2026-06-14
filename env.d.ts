declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_ONLINE_ENABLED?: string;
      EXPO_PUBLIC_API_URL?: string;
    }
  }
}

export {};
