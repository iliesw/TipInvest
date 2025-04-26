import { Hono } from "hono";
import { GetVersion } from "../../../lib";
import agencyProperties from "./properties";
import agencyDashboard from "./dashboard";
import { cors } from "hono/cors";

const agency = new Hono();
agency.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Register agency routes
agency.route("/properties", agencyProperties);
agency.route("/dashboard", agencyDashboard);

agency.get("/", async (c) => {
  return c.json({ message: "Agency API Up " + GetVersion() });
});

export default agency;