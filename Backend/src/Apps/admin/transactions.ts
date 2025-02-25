import { Hono } from "hono";
import { db } from "../../Database/index";
import { transactionTable } from "../../Database/schema";
import { eq } from "drizzle-orm";
import { adminAuth } from "../../Middleware/auth";

const adminTransactions = new Hono();

adminTransactions.use("*", adminAuth);

adminTransactions.get("/", async (c) => {
  const allTransactions = await db.select().from(transactionTable);
  return c.json(allTransactions);
});

adminTransactions.get("/:id", async (c) => {
  const id = c.req.param("id");
  const transaction = await db.select().from(transactionTable).where(eq(transactionTable.id, id));
  if (!transaction.length) return c.json({ error: "Transaction not found" }, 404);
  return c.json(transaction[0]);
});

adminTransactions.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(transactionTable).where(eq(transactionTable.id, id));
  return c.json({ message: "Transaction deleted" });
});

export default adminTransactions;
