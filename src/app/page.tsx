import ThemeSwitcher from "@/components/theme-switcher";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center gap-2">
      <ThemeSwitcher />
      <SignInButton />
      <UserButton />
    </div>
  );
}
