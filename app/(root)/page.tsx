"use client";
import Link from "next/link";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const user = useAppStore((s) => s.user);
  const isAuthed = !!user;
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <h1 className="text-3xl font-semibold">Starter Template</h1>
        </div>

        <h2 className="text-2xl md:text-3xl font-medium">
          Next.js + Firebase starter
        </h2>
        <p className="mt-3 text-muted-foreground">
          Auth-ready boilerplate. Connect your backend and deploy to Cloudflare
          Pages.
        </p>

        {isAuthed && (
          <div className="mt-8 max-w-md mx-auto text-left">
            <div className="card-border">
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-2">Account</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    {user?.name ?? "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    {user?.email ?? "—"}
                  </p>
                </div>
                <div className="mt-4">
                  <SignOutButton />
                </div>
              </div>
            </div>
          </div>
        )}

        {!isAuthed && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/sign-in"
              className="btn px-6 py-3 rounded-md bg-primary text-primary-foreground"
            >
              Sign In
            </Link>
            <Link href="/sign-up" className="btn px-6 py-3 rounded-md border">
              Create an Account
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function SignOutButton() {
  const signOut = useAppStore((s) => s.signOut);
  return (
    <Button className="btn" onClick={() => signOut()}>
      Sign out
    </Button>
  );
}
