import Joi from 'joi';

export const environmentSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  API_PREFIX: Joi.string().default('api/v1'),
  APP_NAME: Joi.string().default('ServeFlow API'),
  APP_VERSION: Joi.string().default('0.1.0'),
  SWAGGER_ENABLED: Joi.boolean().truthy('true').falsy('false').default(true),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
  REDIS_URL: Joi.string()
    .uri({ scheme: ['redis', 'rediss'] })
    .required(),
  CORS_ORIGINS: Joi.string().default('http://localhost:4200'),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'log', 'debug', 'verbose').default('log'),
});
