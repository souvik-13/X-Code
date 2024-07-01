import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import Image from "next/image";
import { FaChrome, FaGithub } from "react-icons/fa6";

// Step 1: Authentication Component
const AuthenticationStep = ({
  onNext,
}: {
  onNext: (method: string, email?: string) => void;
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-auto flex-wrap items-center sm:justify-center md:justify-center xl:justify-between",
      )}
    >
      {/* left part */}
      <div className="p-5">
        <Image
          src={"/ill_1.svg"}
          width={600}
          height={600}
          alt="placeholder"
          className="m-auto aspect-square overflow-hidden rounded-xl md:w-[600px] lg:order-last"
          priority
        />
      </div>
      <div className="flex-1 p-5 sm:mx-5 md:mx-12 lg:mx-16">
        <Card>
          <CardContent className="space-y-8 py-2">
            <div>
              <p className="text-sm">
                Already have an account?
                <Link href="/auth/signin">
                  <Button variant={"link"}>Sign in -&gt;</Button>
                </Link>
              </p>
            </div>
            <Separator />
            <div className="w-full text-center">
              <span className="w-full text-base">Sign up with</span>
              <div className="my-2 flex w-full flex-wrap items-center justify-evenly">
                <Button
                  variant={"secondary"}
                  className="sm:w-full md:w-[40%]"
                  onClick={() => onNext("google")}
                >
                  <FaChrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button
                  variant={"secondary"}
                  className="sm:w-full md:w-[40%]"
                  onClick={() => onNext("github")}
                >
                  <FaGithub className="mr-2 h-4 w-4" />
                  Github
                </Button>
              </div>
            </div>
            <Separator />
            <div className="w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  // @ts-ignore
                  onNext("email", e.target.email.value);
                }}
                className="w-full space-y-4"
              >
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/auth/forgotpass" className="text-sm">
              forgot password?
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthenticationStep;
