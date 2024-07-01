import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  userId: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().max(100, {}),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {}),
  image: z.string(),
});

// Step 2: Profile Setup Component
const ProfileSetupStep = ({
  initProfile,
  onProfileComplete,
}: {
  initProfile: any;
  onProfileComplete: (profileData: any) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initProfile.name ?? "",
      email: initProfile.email ?? "",
      image: initProfile.image ?? "/user-alt-1.svg",
      userId: "",
      bio: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    onProfileComplete(values);
  }

  return (
    <div className="w-full p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex w-full items-center sm:flex-col sm:justify-center md:justify-between lg:flex-row lg:justify-between">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:w-full md:w-full lg:w-[40%] xl:w-[40%]">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      // readOnly={initProfile.name && initProfile.name !== ""}
                      disabled={initProfile.name && initProfile.name !== ""}
                      type="text"
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="sm:w-full md:w-full lg:w-[40%] xl:w-[40%]">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      // readOnly={initProfile.email && initProfile.email !== ""}
                      disabled={initProfile.email && initProfile.email !== ""}
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex w-full flex-col items-center sm:justify-center md:flex-row md:justify-between lg:justify-between">
            <div className="flex flex-col items-start justify-start space-y-2 sm:w-full md:w-[40%]">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your user id"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name everyone can see.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>About you</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your user id"
                        {...field}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      Your bio will be shown on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full items-center sm:flex-col sm:justify-center md:flex-row md:justify-start">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile picture</FormLabel>
                      <FormControl>
                        <div className="flex w-full items-center sm:flex-col sm:justify-center md:flex-row md:justify-evenly">
                          <div className="size-[150px] flex-none overflow-hidden rounded-full bg-foreground object-fill">
                            <Image
                              src={field.value}
                              alt="profile pic"
                              width={150}
                              height={150}
                              className="object-center"
                            />
                          </div>
                          <div className="m-auto p-4">
                            <Input
                              className="hidden"
                              type="url"
                              placeholder="Enter image url"
                              {...field}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your profile picture will be shown on your profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="sm:w-full md:w-[40%]">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter password for your account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please confirm your password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileSetupStep;
