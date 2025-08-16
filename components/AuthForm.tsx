"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "@/components/FormFields";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z.string().min(3, "Name must be at least 3 characters")
        : z.string().optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const signUpWithEmail = useAppStore((s) => s.signUpWithEmail);
  const signInWithEmail = useAppStore((s) => s.signInWithEmail);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;
        const result = await signUpWithEmail({ name: name!, email, password });

        if (!result?.ok) {
          toast.error(result?.message ?? "Failed to create account");
          return;
        }

        toast.success("Account created successfully!");
        router.push("/");
      } else {
        const { email, password } = values;

        const result = await signInWithEmail({ email, password });

        if (!result?.ok) {
          toast.error(result?.message ?? "Signed in failed");
          return;
        }

        toast.success("Signed in successfully!");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("There was an error. Please try again.");
    }
  }

  const isSignIn = type === "sign-in";
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full min-h-dvh flex items-center justify-center px-4">
      <div className="card-border w-full max-w-md">
        <div className="flex flex-col gap-6 card py-12 px-8">
          <div className="flex flex-row gap-2 justify-center">
            <h2 className="text-primary-100 font-bold text-2xl">
              Starter Template
            </h2>
          </div>

          <h3 className="text-center text-muted-foreground">
            Welcome to your Next.js + Firebase starter
          </h3>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 mt-4 form"
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="John Doe"
                />
              )}
              <FormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="john.doe@example.com"
                type="email"
              />
              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              />

              <Button className="btn" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isSignIn
                    ? "Signing In..."
                    : "Creating..."
                  : isSignIn
                  ? "Sign In"
                  : "Create an Account"}
              </Button>
            </form>
          </Form>

          <p className="text-center">
            {isSignIn ? "No account yet?" : "Have an account already?"}
            <Link
              href={!isSignIn ? "/sign-in" : "/sign-up"}
              className=" font-bold text-user-primary ml-1"
            >
              {!isSignIn ? " Sign in" : " Sign up"}{" "}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
