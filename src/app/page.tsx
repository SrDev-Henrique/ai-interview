import { SignInButton, UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "@/components/theme-switcher";

export default function HomePage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center gap-2">
      <ThemeSwitcher />
      <SignInButton />
      <UserButton />
    </div>
  );
}
