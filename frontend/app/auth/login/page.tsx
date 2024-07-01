"use client";
import { Signin } from "@/components/signin";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const Page = () => {
  return (
    <div className="grid h-screen w-screen place-items-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            // signIn("google", { callbackUrl: "/" });
            signIn("google");
          }}
        >
          Google signin
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            // signIn("github", { callbackUrl: "/" });
            signIn("github");
          }}
        >
          GitHub signin
        </Button>
      </div>
    </div>
  );
};

export default Page;
