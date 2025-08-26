// app/api/sync-user/route.ts
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import { NextResponse } from "next/server";
import { auth, clerkClient as _clerkClient } from "@clerk/nextjs/server";
import { upsertUser } from "@/features/users/db";
import { revalidateTag } from "next/cache";
import { getUserGlobalTag, getUserIdTag } from "@/features/users/dbCache";

type ClerkEmail = {
  id: string;
  email_address: string;
};

async function resolveClerkClient() {
  // _clerkClient pode ser:
  //  - função async: await _clerkClient()
  //  - promise: await _clerkClient
  //  - objeto já resolvido: _clerkClient
  if (typeof _clerkClient === "function") {
    return await (_clerkClient as unknown as () => Promise<any>)();
  }

  if (
    typeof _clerkClient === "object" &&
    typeof (_clerkClient as Promise<any>).then === "function"
  ) {
    return await (_clerkClient as unknown as Promise<any>);
  }

  return _clerkClient;
}

export async function POST() {
  // auth() precisa ser awaited no App Router
  const authRes = await auth();
  const userId = authRes.userId;

  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // resolve clerk client de forma segura para qualquer versão/forma de export
  const client = await resolveClerkClient();

  // agora use o client resolvido
  const clerkUser = await client.users.getUser(userId);

  // tipagem segura para emails (sem any)
  const emails = clerkUser.email_addresses as ClerkEmail[] | undefined;
  const email =
    emails?.find((e) => e.id === clerkUser.primary_email_address_id)
      ?.email_address ??
    emails?.[0]?.email_address ??
    "";

  await upsertUser({
    id: clerkUser.id,
    name: `${clerkUser.first_name ?? ""} ${clerkUser.last_name ?? ""}`.trim(),
    email,
    imageUrl: clerkUser.profile_image_url ?? "",
    createdAt: new Date(clerkUser.created_at),
    updatedAt: new Date(clerkUser.updated_at),
  });

  // revalida cache (pode falhar em dev)
  try {
    revalidateTag(getUserGlobalTag());
    revalidateTag(getUserIdTag(userId));
  } catch (err: unknown) {
    console.warn("revalidateTag falhou (provavelmente em dev):", String(err));
  }

  return NextResponse.json({ ok: true });
}
