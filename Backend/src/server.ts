import { serve } from "bun";
import app from "./app";

serve({ fetch: app.fetch, port: 3001 });

console.log("Server running on http://localhost:3001");