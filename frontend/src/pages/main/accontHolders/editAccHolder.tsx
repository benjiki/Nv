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
import { accountHolderService } from "@/utils/accountHolderService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const accountHolderCreateSchema = z.object({
  name: z.string(),
  accountNumber: z.string().trim(),
});
type AccountHolderCreateFormData = z.infer<typeof accountHolderCreateSchema>;

const EditAccHolder = () => {
  const form = useForm<AccountHolderCreateFormData>({
    resolver: zodResolver(accountHolderCreateSchema),
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: accountHolderService.createAccounHolder,
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error);
        return;
      }
      queryClient.refetchQueries({ queryKey: ["accountHolders"] });
      toast.success(data.message || "Account Created ");
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
        "Account Creation failed"; // fallback

      toast.error(msg);
    },
  });

  const onSubmit = (data: AccountHolderCreateFormData) => {
    mutation.mutate(data);
  };
  return (
    <div className="w-full h-screen">
      <div className="w-full flex justify-center mt-20">
        <div className="w-full lg:w-1/3  ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="account holders name"
                        {...field}
                        autoComplete="off"
                        autoCorrect="false"
                        className=""
                      />
                    </FormControl>
                    <FormDescription>
                      Account Holder name is required
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* account Number */}
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Account Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="account holders accNumber"
                        {...field}
                        autoComplete="off"
                        autoCorrect="false"
                        className=""
                      />
                    </FormControl>
                    <FormDescription>
                      Account Holder Acc Number is required
                    </FormDescription>
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

export default EditAccHolder;
