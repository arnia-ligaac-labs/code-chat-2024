declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    APP_MEMORY_CLASS: string;
    DYNAMODB_ENDPOINT: string;
    DYNAMODB_TABLE_MESSAGES: string;
    MYSQL_HOST: string;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    MYSQL_DATABASE: string;
  }
}
