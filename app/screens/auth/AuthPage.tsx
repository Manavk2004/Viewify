"use client";

import * as React from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { email, z } from "zod"
import { router } from "better-auth/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSendEmail } from "@/hooks/sendEmail";




export const emailPasswordSchema = z.object({
  email: z
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters"),
  firstName: z.string(),
  lastName: z.string(),
});

type LoginForm = z.infer<typeof emailPasswordSchema>



function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.649 32.659 29.203 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.96 3.04l5.657-5.657C34.047 6.053 29.298 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917Z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691 12.88 19.51C14.659 15.108 18.964 12 24 12c3.059 0 5.842 1.154 7.96 3.04l5.657-5.657C34.047 6.053 29.298 4 24 4 16.318 4 9.656 8.327 6.306 14.691Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.094 0 9.76-1.957 13.297-5.149l-6.143-5.199C29.117 35.091 26.701 36 24 36c-5.182 0-9.614-3.317-11.282-7.946l-6.525 5.026C9.505 39.557 16.227 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.08 12.08 0 0 1-4.149 5.652h.002l6.143 5.199C36.863 39.248 44 34 44 24c0-1.341-.138-2.651-.389-3.917Z"
      />
    </svg>
  );
}

export default function AuthPage() {
  const [mode, setMode] = React.useState<"login" | "signup">("login");

  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const router = useRouter()


  const sendEmail = useSendEmail()


  const form = useForm<LoginForm>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    }
  })

  async function onGoogle() {
    setPending(true);
    setError(null);
    try {
      await authClient.signIn.social({ provider: "google" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start Google sign in");
    } finally {
      setPending(false);
    }
  }

  async function onEmailPassword(values: LoginForm) {
    console.log("Hello")
    console.log(values)
    setPending(true);
    setError(null);
    try {
      if (mode === "login") {
        const { data, error } = await authClient.signIn.email({
          email: values.email,
          password: values.password,
        });

        if (error) {
          setError(error.message ?? "Invalid email or password");
          return;
        }

        const userId = data?.user?.id;
        if (!userId) {
          setError("Could not determine user after sign in");
          return;
        }

        router.push(`/homepage/${userId}`)
      } else {
        console.log(values)
        await authClient.signUp.email({ 
          name: values.firstName,  
          email: values.email, 
          password: values.password, 
          callbackURL: "/" 
        }, { 
          onSuccess: async () => { 
            const { data, error } = await authClient.getSession()
            const userId = data?.user?.id
            sendEmail.mutate({
              to: "mjkamdar04@gmail.com",
              firstName: "Manav"
            })
            router.push(`/overview/${userId}`)
          }, 
          onError: (err) => console.log("err", err)
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        {/* Left brand / marketing */}
        <div className="relative hidden overflow-hidden border-r border-border bg-card p-10 lg:block">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-foreground">
              <span className="text-sm font-semibold">V</span>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Welcome to</p>
              <h1 className="text-xl font-semibold tracking-tight">Viewify</h1>
            </div>
          </div>

          <div className="mt-10 max-w-md">
            <h2 className="text-3xl font-semibold tracking-tight">
              Analytics that look as good as they perform.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Sign in to manage products, track orders, and monitor KPIs in a
              single dashboard.
            </p>
          </div>

          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-indigo-500/20 blur-3xl" />
          </div>
        </div>

        {/* Right auth card */}
        <div className="flex items-center justify-center p-6">
          <Card className="w-full max-w-md border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl">
                {mode === "login" ? "Sign in" : "Create your account"}
              </CardTitle>
              <CardDescription>
                {mode === "login"
                  ? "Welcome back. Please sign in to continue."
                  : "Get started in seconds. No credit card required."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full border-border bg-muted/40 hover:bg-muted/60"
                onClick={onGoogle}
                disabled={pending}
              >
                <GoogleIcon className="h-4 w-4" />
                Continue with Google
              </Button>

              <div className="relative">
                <Separator className="bg-border" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-background px-2 text-xs text-muted-foreground">
                  or
                </span>
              </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEmailPassword)} className="space-y-3">

                {mode === "signup" && (

                  <div className="space-y-2 flex gap-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-foreground">
                        First Name
                      </label>
                      <Input
                        {...form.register("firstName")}
                        placeholder="Manav"
                        className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-foreground">
                        Last Name
                      </label>
                      <Input
                        {...form.register("lastName")}
                        placeholder="Kamdar"
                        className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                        required
                        />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    {...form.register("email")}
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Input
                    {...form.register("password")}
                    type="password"
                    placeholder="••••••••"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                {error ? (
                  <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                ) : null}

                <Button type="submit" className="w-full" disabled={pending}>
                  {pending
                    ? "Please wait…"
                    : mode === "login"
                      ? "Sign in"
                      : "Create account"}
                </Button>
              </form>
            </Form>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                {mode === "login" ? (
                  <button
                    type="button"
                    className="text-sm font-medium text-foreground underline underline-offset-4"
                    onClick={() => setMode("signup")}
                  >
                    Don’t have an account? Sign up
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-sm font-medium text-foreground underline underline-offset-4"
                    onClick={() => setMode("login")}
                  >
                    Already have an account? Sign in
                  </button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
