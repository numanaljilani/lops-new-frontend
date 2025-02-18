import Image from "next/image";
import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "../ui/button";

import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

export default function Login() {
  const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(LoginSchema) });
  console.log(errors);
  async function onSubmit(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    router.push("/dashboard");
    console.log("data submited", data, errors);
  }

  return (
    <div className="w-full h-screen overflow-hidden flex justify-center items-center shadow-lg px-5">
      <div className=" md:w-[75%] lg:w-[75%] px-4 md:p-0 lg:p-0 sm:p-0 lg:grid lg:grid-cols-2 rounded-md overflow-hidden shadow-2xl shadow-blue-200">
        <div className="flex-1">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email below to login to your account.
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    className={
                      errors.email &&
                      "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/30"
                    }
                    placeholder="m@example.com"
                    {...register("email", {
                      required: { value: true, message: "Email is required." },
                    })}
                  />
                  {errors.email && (
                    <p
                      className="mt-1 text-xs text-destructive"
                      role="alert"
                      aria-live="polite"
                    >
                      {errors?.email?.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="grid gap-2 mt-2 ">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    className={
                      errors.password &&
                      "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/30"
                    }
                    {...register("password", {
                      minLength: {
                        value: 4,
                        message: "password should be greater then 4 charector.",
                      },
                      required: {
                        value: true,
                        message: "Password is required.",
                      },
                    })}
                  />
                  {errors.password && (
                    <p
                      className="mt-1 text-xs text-destructive"
                      role="alert"
                      aria-live="polite"
                    >
                      {errors?.password?.message?.toString()}
                    </p>
                  )}
                </div>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full mt-4"
                >
                  {isSubmitting && (
                    <LoaderCircle
                      className="-ms-1 me-2 animate-spin"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                  Login
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="hidden sm:block border w-full h-full overflow-hidden">
          <Image
            src="/login.jpg"
            alt="Image"
            width="1920"
            height="1080"
            priority
            className="h-[80vh] object-fill dark:brightness-[0.2] dark:grayscale"
            // loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

// <div className="space-y-2">
//   <Label htmlFor="input-06">Input with error</Label>
//   <Input
//     id="input-06"
//     className="border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/30"
//     placeholder="Email"
//     type="email"
//     defaultValue="invalid@email.com"
//   />
//   <p className="mt-2 text-xs text-destructive" role="alert" aria-live="polite">
//     Email is invalid
//   </p>
// </div>
