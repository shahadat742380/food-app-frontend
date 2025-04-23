"use client";

// ** Import Core Packages
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ** Import Third-Party Packages
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

// ** Import Components
import Logo from "@/assets/logo";
import loginImg from "@/assets/images/login.webp";
import { IcoApple, IcoGoogle } from "@/assets/icon";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// ** Import Validation Schema and API
import { loginSchema } from "@/schemas";
import { authClient } from "@/lib/auth-client";

const HomePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember_me: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const { email, password } = values;

      const { error } = await authClient.signIn.email(
        { email, password },
        {
          onRequest: () => console.log("Request initiated..."),
          onSuccess: () => {
            // toast.success("Sign-in successful.");
            router.push("/");
            console.log("Sign-in successful.");
          },
          onError: (ctx) => {
            console.error(ctx.error);
            throw new Error(ctx.error.message || "An error occurred.");
          },
        }
      );

      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      // toast.error("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <header className="bg-primary py-2 px-5 flex justify-center items-center shadow-sm">
        <Logo />
      </header>
      <section className="px-5 max-w-md mx-auto pb-10">
        <div className="flex justify-center mt-8 mb-6">
          <Image
            src={loginImg}
            alt="login"
            height={135}
            width={129}
            className="object-contain"
          />
        </div>
        <div>
          <Typography
            variant="Medium_H4"
            className="text-foreground block text-center"
          >
            Login to your Account
          </Typography>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
              <div className="space-y-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          className="h-12"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="h-12"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 cursor-pointer right-3"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between mt-8">
                <FormField
                  control={form.control}
                  name="remember_me"
                  render={({ field }) => (
                    <FormItem className="flex items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-5 w-5 border-primary border-2"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 capitalize cursor-pointer !font-normal text-foreground text-base ml-2">
                        Remember Me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Typography
                  variant="Medium_H6"
                  className="capitalize cursor-pointer text-primary text-base hover:underline"
                >
                  Forgot password?
                </Typography>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-8 h-12 text-xl"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="flex items-center justify-center gap-4 my-8">
          <div className="w-full">
            <Separator />
          </div>
          <div>
            <Typography
              variant="Regular_H6"
              className="text-muted-foreground block whitespace-nowrap"
            >
              or continue with
            </Typography>
          </div>
          <div className="w-full">
            <Separator />
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" className="!px-12 h-12" disabled={loading}>
            <IcoGoogle />
          </Button>
          <Button variant="outline" className="!px-12 h-12" disabled={loading}>
            <IcoApple />
          </Button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
