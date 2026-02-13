const { NODE_ENV = 'development', JWT_SECRET: ENV_JWT_SECRET } = process.env;

export const JWT_SECRET =
  ENV_JWT_SECRET ||
  (NODE_ENV === 'production'
    ? (() => {
        throw new Error('JWT_SECRET must be set in production');
      })()
    : 'dev-secret');

export const NODE_ENVIRONMENT = NODE_ENV;
