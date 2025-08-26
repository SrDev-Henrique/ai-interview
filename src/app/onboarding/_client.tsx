// app/onboarding/_client.tsx
"use client";
import { useEffect, useState } from "react";

export function OnboardingClient({ userId }: { userId: string | null }) {
  const [status, setStatus] = useState<"idle" | "syncing" | "done" | "error">(
    "idle"
  );

  console.log("userId", userId);

  useEffect(() => {
    async function sync() {
      setStatus("syncing");
      try {
        const res = await fetch("/api/sync-user", { method: "POST" });
        if (!res.ok) throw new Error("Sync falhou");
        setStatus("done");
        // opcional: force reload para a versão que agora tem user no DB
        // window.location.replace("/onboarding");
      } catch (err) {
        console.error("sync-user error:", err);
        setStatus("error");
      }
    }

    sync();
  }, []);

  return (
    <div>
      {status === "syncing"
        ? "Finalizando..."
        : status === "done"
        ? "Pronto!"
        : status === "error"
        ? "Erro ao finalizar."
        : null}
    </div>
  );
}
