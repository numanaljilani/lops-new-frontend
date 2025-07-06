"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/errors/ErrorMessage";
import {
  LayoutDashboard,
  LockKeyhole,
  Info,
  LifeBuoy,
  User,
  Briefcase,
  Building2,
} from "lucide-react";
import {
  useProfileMutation,
  useChangePasswordMutation,
} from "@/redux/query/authApi";
import { setUser } from "@/redux/slice/profileSlice";
import { toast } from "sonner";

type SettingSection =
  | "profile"
  | "password"
  | "about"
  | "support"
  | "employee"
  | "company";

const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default function SettingsPage() {
  const user = useSelector((state: any) => state.user.user);
  const [activeSection, setActiveSection] = useState<SettingSection>("profile");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const dispatch = useDispatch();
  const [profileApi, { data, isSuccess, error, isError }] =
    useProfileMutation();
  const [
    changePassword,
    {
      isLoading: isPasswordLoading,
      isSuccess: isPasswordSuccess,
      isError: isPasswordError,
      error: passwordError,
    },
  ] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const getProfileDetails = async () => {
    const res = await profileApi({});
    console.log(res, "PROFILE API");
  };

  useEffect(() => {
    getProfileDetails();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser({ ...data.user, ...data.employee }));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isPasswordSuccess) {
      toast.success("Password changed successfully!");
      setShowPasswordForm(false);
      reset();
    }
    if (isPasswordError && passwordError) {
      const errorMessage =
        (passwordError as any)?.data?.message ||
        "Failed to change password. Please try again.";
      toast.error(errorMessage);
    }
  }, [isPasswordSuccess, isPasswordError, passwordError, reset]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  const onPasswordSubmit = async (data: any) => {
    try {
      const res = await changePassword({
        password: data.password,
        confirm_password: data.confirm_password,
      }).unwrap();
      console.log(res, "Password change response");
    } catch (err) {
      // Error is handled by useEffect
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{user?.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <p className="font-medium">
                    {user?.currency} {user?.salary}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{user?.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{user?.contact}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{user?.description}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Information</h3>
              {user.company.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >

                     
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Company Name
                      </p>
                      <p className="font-medium">{data?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">{data?.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{data?.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">
                        {data?.status}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">About</p>
                      <p className="font-medium">{data?.about}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "password":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <p className="text-muted-foreground">
              Password last updated:{" "}
              {new Date(user.updatedAt).toLocaleDateString()}
            </p>
            <Button
              variant="secondary"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </Button>
            {showPasswordForm && (
              <form
                onSubmit={handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <ErrorMessage message={errors.password.message} />
                  )}
                </div>
                <div>
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    {...register("confirm_password")}
                  />
                  {errors.confirm_password && (
                    <ErrorMessage message={errors.confirm_password.message} />
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || isPasswordLoading}
                >
                  {isSubmitting || isPasswordLoading
                    ? "Submitting..."
                    : "Update Password"}
                </Button>
              </form>
            )}
          </div>
        );
      case "about":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">About</h3>
            <p>Application version: 1.0.0</p>
            {/* Add more about information here */}
          </div>
        );
      case "support":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Support</h3>
            <p>Contact our support team for assistance.</p>
            {/* Add support form or contact information here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <Card className="w-full md:w-64 flex-shrink-0">
          <CardContent className="p-4 space-y-2">
            <Button
              variant={activeSection === "profile" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>

            <Button
              variant={activeSection === "password" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("password")}
            >
              <LockKeyhole className="mr-2 h-4 w-4" />
              Password
            </Button>

            {user.employee && (
              <>
                <Button
                  variant={activeSection === "employee" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("employee")}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Employment
                </Button>

                <Button
                  variant={activeSection === "company" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("company")}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Company
                </Button>
              </>
            )}

            <Separator className="my-2" />

            <Button
              variant={activeSection === "about" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("about")}
            >
              <Info className="mr-2 h-4 w-4" />
              About
            </Button>

            <Button
              variant={activeSection === "support" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("support")}
            >
              <LifeBuoy className="mr-2 h-4 w-4" />
              Support
            </Button>
          </CardContent>
        </Card>

        {/* Content Area */}
        <Card className="flex-1">
          <CardHeader>
            <h2 className="text-xl font-semibold capitalize">
              {activeSection.replace("-", " ")}
            </h2>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}
