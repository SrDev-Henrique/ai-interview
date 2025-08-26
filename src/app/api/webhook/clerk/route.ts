import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { deleteUser, upsertUser } from "@/features/users/db";
import { env } from "@/data/env/server";
import { revalidateTag } from "next/cache";
import { getUserGlobalTag, getUserIdTag } from "@/features/users/dbCache";

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request, {
      signingSecret: env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const clerkData = event.data;
        const email = clerkData.email_addresses.find(
          (e) => e.id === clerkData.primary_email_address_id
        )?.email_address;
        if (email == null) {
          return new Response("Email não encontrado", { status: 400 });
        }

        await upsertUser({
          id: clerkData.id,
          name: `${clerkData.first_name} ${clerkData.last_name}`,
          email,
          imageUrl: clerkData.image_url,
          createdAt: new Date(clerkData.created_at),
          updatedAt: new Date(clerkData.updated_at),
        });

        revalidateTag(getUserGlobalTag());
        revalidateTag(getUserIdTag(clerkData.id));
        break;
      }
      case "user.deleted":
        {
          if (event.data.id == null) {
            return new Response("ID do usuário não encontrado", {
              status: 400,
            });
          }

          await deleteUser(event.data.id);

          revalidateTag(getUserGlobalTag());
          revalidateTag(getUserIdTag(event.data.id));
        }
        break;
    }
  } catch (err) {
    console.error("Erro ao verificar webhook:", err);
    return new Response("Webhook inválido", { status: 400 });
  }

  return new Response("Webhook processado com sucesso", { status: 200 });
}
