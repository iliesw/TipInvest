import { Hono } from "hono";
import { GetVersion } from "../../../lib";
import agencyProperties from "./properties";
import agencyDashboard from "./dashboard";

const agency = new Hono();

// Register agency routes
agency.route("/properties", agencyProperties);
agency.route("/dashboard", agencyDashboard);

agency.get("/", async (c) => {
  return c.json({ message: "Agency API Up " + GetVersion() });
});

export default agency;