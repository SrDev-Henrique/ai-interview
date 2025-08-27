import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { getUserIdTag } from "@/features/users/dbCache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { auth } from "@clerk/nextjs/server";
import { UsersTable } from "@/drizzle/schema";

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, redirectToSignIn } = await auth();

  return {
    userId,
    redirectToSignIn,
    user: allData && userId != null ? await getUser(userId) : undefined,
  };
}

async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));

  return db.query.UsersTable.findFirst({
    where: eq(UsersTable.id, id),
  });
}
