import mongoose from 'mongoose';

import { DATABASE_URL } from '../config';

export const connectToMongoDB = async() => {
  const connection = await mongoose.connect(`${DATABASE_URL}`);

  console.log(`[MongoDB] сервер: ${connection.connection.host}`);
  console.log(`[MongoDB] порт: ${connection.connection.port}`);
}
