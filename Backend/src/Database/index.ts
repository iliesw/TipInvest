import { drizzle } from 'drizzle-orm/neon-http';

// You can specify any property from the node-postgres connection options
export const db = drizzle(process.env.DATABASE_URL);



