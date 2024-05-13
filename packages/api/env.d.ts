declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    APP_MEMORY_CLASS: string;
    MYSQL_HOST: string;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    MYSQL_DATABASE: string;
  }
}
