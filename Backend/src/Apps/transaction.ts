import { Hono } from "hono";
import { db } from "../Database/index";
import { GetVersion } from "../../lib";

const transaction = new Hono();

const AllowedCodes = {
    "00x1": {
        price: 10000,
        solde: 1000,
        currency: "TND",
        description: "Payment for 1 month subscription",
    },
    "00x2": {
        price: 20000,
        solde: 2450,
        currency: "TND",
        description: "Payment for 2 month subscription",
    },
    "00x3": {
        price: 30000,
        solde: 5900,
        currency: "TND",
        description: "Payment for 3 month subscription",
    },
    "00xt": {
        price: 1000,
        solde: 10000,
        currency: "TND",
        description: "Test payment (Development only)",
    }
};

transaction.get("/", (c) => c.json({ status: "Transaction alive"+GetVersion() }));

transaction.get("/prices", (c) => {
    const res = AllowedCodes;
    // Delete Test code from production
    // @ts-ignore
    delete res["000t"];
    return c.json(res);
});

export default transaction;

