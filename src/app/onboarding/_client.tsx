// app/onboarding/_client.tsx
"use client";

import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUser } from "@/features/users/actions";

export function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter()

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const user = await getUser(userId)
      if(user == null) return

      router.replace("/app")
      clearInterval(intervalId)
    }, 250)

    return () => clearInterval(intervalId)
  }, [userId, router])


  return <Loader2Icon className="size-14 animate-spin" />;
}
