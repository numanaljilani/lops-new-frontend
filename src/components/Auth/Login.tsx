import Image from "next/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/redux/query/authApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {
  setAccessToken,
  setRefreshToken,
  setUser,
} from "@/redux/slice/profileSlice";

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

  const [loginApi, { data, isSuccess, error, isError, isLoading }] =
    useLoginMutation();

  const dispatch = useDispatch();
  async function onSubmit(data: any) {
    const res = await loginApi(data);
  }

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      dispatch(setAccessToken(data.accessToken));
      dispatch(setRefreshToken(data.refreshToken));
      dispatch(setUser({...data.user , ...data.employee}));

      router.push("/dashboard");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.log(error);
      toast( error?.data?.message || "Please provide the credentials", {
        description: error?.data?.message,
      });
    }
  }, [isError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Sign In
              </h1>
              <p className="text-sm text-gray-500">
                Access your account with your credentials
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  } focus:outline-none focus:ring-2 transition-colors text-gray-900 placeholder-gray-400`}
                  {...register("email", {
                    required: { value: true, message: "Email is required." },
                  })}
                />
                {errors.email && (
                  <p
                    className="text-xs text-red-500"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.email.message?.toString()}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  } focus:outline-none focus:ring-2 transition-colors text-gray-900 placeholder-gray-400`}
                  {...register("password", {
                    minLength: {
                      value: 4,
                      message: "Password must be at least 4 characters.",
                    },
                    required: {
                      value: true,
                      message: "Password is required.",
                    },
                  })}
                />
                {errors.password && (
                  <p
                    className="text-xs text-red-500"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.password.message?.toString()}
                  </p>
                )}
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors font-medium"
              >
                {isSubmitting ||
                  (isLoading && (
                    <LoaderCircle
                      className="mr-2 animate-spin"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ))}
                Sign In
              </button>
            </form>
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
        {/* Image Section */}
        <div className="hidden lg:block w-full lg:w-1/2 relative">
          <Image
            src="/login.jpg"
            alt="Login illustration"
            width={1920}
            height={1080}
            priority
            className="h-full w-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
            <h2 className="text-white text-xl font-semibold">
              Securely Access Your Dashboard
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
