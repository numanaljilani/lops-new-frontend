"use client";
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Login from "@/components/Auth/Login";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = () => {
    console.log("email :", email);
    console.log("password :", password);
    router.push("/dashboard");
    if (email && password) {
      toast(`${email} you have loggedin"`, {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      });

    } else {
      toast(`Please provide the credentials"`, {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      });
    }
  };
  return <Login/>
//   (
// <div className="w-full lg:grid lg:h-[600px] lg:grid-cols-2 xl:min-h-[800px] ">
//       <div className="flex items-center justify-center py-12">
//         <div className="mx-auto grid w-[350px] gap-6">
//           <div className="grid gap-2 text-center">
//             <h1 className="text-3xl font-bold">Login</h1>
//             <p className="text-balance text-muted-foreground">
//               Enter your email below to login to your account
//             </p>
//           </div>
//           <div className="grid gap-4">
//             <div className="grid gap-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="m@example.com"
//                 required
//                 onChange={(e :  React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//               />
//             </div>
//             <div className="grid gap-2">
//               <div className="flex items-center">
//                 <Label htmlFor="password">Password</Label>
//                 <Link
//                   href="/forgot-password"
//                   className="ml-auto inline-block text-sm underline"
//                 >
//                   Forgot your password?
//                 </Link>
//               </div>
//               <Input
//                 id="password"
//                 type="password"
//                 required
//                 onChange={(e :  React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//               />
//             </div>
//             <Button type="submit" className="w-full " onClick={Login}>
//               Login
//             </Button>
//             {/* <Button variant="outline" className="w-full">
//               Login with Google
//             </Button> */}
//           </div>
//           {/* <div className="mt-4 text-center text-sm">
//             Don&apos;t have an account?{" "}
//             <Link href="#" className="underline">
//               Sign up
//             </Link>
//           </div> */}
//         </div>
//       </div>
//       <div className="hidden bg-muted lg:block ">
//         {/* <div > */}
//         <Image
//           src="/login.jpg"
//           alt="Image"
//           width="1920"
//           height="1080"
//           className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
//           loading="lazy"
//         />
//         {/* <img  src="/login.png"  alt="Image" className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"/> */}
//       </div>
//     </div>
//   );
}
