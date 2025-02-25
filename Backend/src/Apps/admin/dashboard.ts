import { Hono } from "hono";
import { db } from "../../Database/index";
import { userTable, realestateTable, transactionTable } from "../../Database/schema";
import { adminAuth } from "../../Middleware/auth";
import { count } from 'drizzle-orm';

const adminDashboard = new Hono();

adminDashboard.use("*", adminAuth);

adminDashboard.get("/stats", async (c) => {
    const userCount = await db.select({ count: count() }).from(userTable);
    const realEstateCount = await db.select({ count: count() }).from(realestateTable);
    const transactionCount = await db.select({ count: count() }).from(transactionTable);

    return c.json({
        users: userCount[0].count,
        listings: realEstateCount[0].count,
        transactions: transactionCount[0].count,
    });
});

export default adminDashboard;
