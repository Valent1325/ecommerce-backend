import { createClient } from 'redis';

import { REDIS_URL } from '../config';

export const redisStoreClient = createClient({
  url: `${REDIS_URL}`,
  legacyMode: true,
  database: 1,
});

export const redisClient = createClient({
  url: `${REDIS_URL}`,
  database: 2,
});
