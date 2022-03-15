export const IS_PROD = process.env.NODE_ENV === 'production';
export const PORT = process.env.PORT || 3000;
export const SESSION_SECRET = process.env.SESSION_SECRET;

export const DATABASE_URL = process.env.DATABASE_URL;

export const REDIS_URL = process.env.REDIS_URL;

export const JWT_SECRET = process.env.JWT_SECRET || '';
export const JWT_EPIRES_IN = '7d';

export const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
