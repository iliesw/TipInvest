"use client";

import Head from "next/head";
import { Suspense } from "react";
import "./../../public/assets/css/fonts.css";
import "./../../public/assets/css/globals.css";
import { Loader2 } from "lucide-react";



export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <html>
      <Head>
        <title>Tips Invest</title>
      </Head>
      <body className="antialiased">
        <Suspense
          fallback={
            <div className="w-screen h-screen flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <main>{children}</main>
        </Suspense>
      </body>
    </html>
  );
}
