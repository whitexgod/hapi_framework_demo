import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  JWT_SECRET: process.env.JWT_SECRET,
  DB_URI: process.env.DB_URI,
};
