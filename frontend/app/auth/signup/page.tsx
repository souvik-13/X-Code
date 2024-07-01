"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import StepIndicator from "@/components/signup/setp-indicator";
import AuthenticationStep from "../../../components/signup/step1";
import CompletionScreen from "@/components/signup/step3";
import ProfileSetupStep from "@/components/signup/step2";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  // const [step, setStep] = useState(1);
  const [authMethod, setAuthMethod] = useState("");
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [image, setImage] = useState("");
  const { status, data: session, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(status);
    if (status === "authenticated") {
      console.log("Redirecting to /~")
      router.push("/~");
    }
  }, [status]);

  const handleAuthNext = async (method: string, email?: string) => {
    if (method === "email" && !email) return;
    await signIn(method).then(() => {
      setAuthMethod(method);
    });
  };

  // const handleProfileComplete = (profileData: any) => {
  //   console.log("Signup Complete with:", authMethod, profileData);
  //   setStep(3);
  //   // Redirect user or show completion message
  // };

  return (
    <div
      className={cn(
        "relative flex h-screen w-screen flex-col items-center justify-center gap-5 overflow-y-auto overflow-x-hidden",
        "bg-img-3 bg-cover bg-center bg-no-repeat",
      )}
    >
      {/* <div className="w-full">
        <StepIndicator currentStep={step} />
      </div> */}

      <div
        className="container my-4 overflow-y-auto overflow-x-hidden rounded-lg backdrop-blur-sm"
        style={{ scrollbarWidth: "none" }}
      >
        <AuthenticationStep onNext={handleAuthNext} />
        {/* {step === 1 && <AuthenticationStep onNext={handleAuthNext} />} */}
        {/* {step === 2 && (
          <ProfileSetupStep
            initProfile={{ name, email, image, authMethod }}
            onProfileComplete={handleProfileComplete}
          />
        )}
        {step === 3 && <CompletionScreen />} */}
      </div>
    </div>
  );
}
