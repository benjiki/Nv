import { authService } from "@/utils/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(10, { message: " Phone Number must be at least 10 digits " })
    .max(10, { message: "10 is the max number" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error);
        return;
      }
      queryClient.refetchQueries({ queryKey: ["auth"] });
      toast.success(data.message || "Login Success");
      navigate("/");
    },

    onError: (error) => {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: string[];
        error?: string;
      }>;

      console.log("❌ Backend error:", axiosError.response?.data);
      // Pick the most useful message
      const msg =
        axiosError.response?.data?.message || // For Joi or custom message
        axiosError.response?.data?.errors?.join(", ") || // For validation arrays
        axiosError.response?.data?.error || // For your backend "error" field
        "Login failed"; // fallback

      toast.error(msg);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 🔹 Foreground (form) */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="backdrop-blur-lg bg-white/20 p-10 rounded-xl shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Phone Number 🤙
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phone number"
                        {...field}
                        autoComplete="off"
                        autoCorrect="false"
                        className="border-0 border-b-2 border-muted-foreground rounded-none focus-visible:ring-0 focus:border-primary"
                      />
                    </FormControl>
                    <FormDescription className="text-secondary-foreground">
                      We'll use your phone number to verify your account.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Password 🔑
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                        className="border-0 border-b-2 border-muted-foreground rounded-none focus-visible:ring-0 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
