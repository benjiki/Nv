import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { authService } from "@/utils/authService";
import { useQueryClient } from "@tanstack/react-query";

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

const regSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(10, { message: "Phone Number must be at least 10 digits" })
    .max(10, { message: "10 is the max number " }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type RegFormData = z.infer<typeof regSchema>;

const RegForm: React.FC = () => {
  const form = useForm<RegFormData>({
    resolver: zodResolver(regSchema),
  });
  // inside RegForm component
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error);
        return;
      }

      // Store tokens
      queryClient.invalidateQueries(["auth"]);
      toast.success(data.message || "Account created successfully!");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: string[];
        error?: string;
      }>;

      // Log full backend response to the browser console
      console.error("❌ Backend error:", axiosError.response?.data);

      // Pick the most useful message
      const msg =
        axiosError.response?.data?.message || // For Joi or custom message
        axiosError.response?.data?.errors?.join(", ") || // For validation arrays
        axiosError.response?.data?.error || // For your backend "error" field
        "Registration failed"; // fallback

      toast.error(msg);
    },
  });

  const onSubmit = (data: RegFormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormDescription>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...field}
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
  );
};

export default RegForm;
