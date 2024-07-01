"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const page = () => {
  return (
    <div className="grid h-screen w-screen place-items-center">
      <Button
        variant={"destructive"}
        onClick={() => {
          signOut({ callbackUrl: "/" });
        }}
      >
        Sign out
      </Button>
    </div>
  );
};

export default page;
