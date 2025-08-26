// src/middleware.ts
import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { env } from "./data/env/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/", 
  "/api/webhook(.*)",
]);

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: "1m",
      max: 100,
    }),
  ],
});

export default clerkMiddleware(async (auth, req) => {
  try {
    console.log(">>> middleware cookie:", req.headers.get("cookie"));
  } catch (e) {
    console.error("Erro ao ler cookie no middleware:", e);
  }

  if (isPublicRoute(req)) return;

  try {
    const url = new URL(req.url);
    if (url.searchParams.has("__clerk_db_jwt")) {
      console.log(
        ">>> Clerk callback detected — allowing handshake to complete."
      );
      return;
    }
  } catch (e) {
    console.log("erro", e)
  }

  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    return new Response(null, { status: 403 });
  }

  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
