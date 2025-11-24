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
import { NumericFormat } from "react-number-format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useAccountHolders } from "@/hooks/useAccountHolder";
import { accountMangementService } from "@/utils/accountManagmentService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "@/components/Loader";
import type { AxiosError } from "axios";

// ---------- FIXED SCHEMA ----------
const depositSchema = z.object({
  userId: z.number(),
  amount: z.number().min(1),
});

type DepositData = z.infer<typeof depositSchema>;

const Deposit = () => {
  const { data, isLoading } = useAccountHolders();

  const form = useForm<DepositData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      userId: undefined,
      amount: undefined,
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: DepositData) =>
      accountMangementService.depositTransaction(values),

    onSuccess: (res) => {
      toast.success(res.message || "Deposit successful");
      queryClient.invalidateQueries({ queryKey: ["accountManagment"] });
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

  // ---------- LOADING ----------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  // ---------- NO DATA ----------
  if (!data || !data.data || data.data.length === 0) {
    return <h1>No account holders found</h1>;
  }

  return (
    <div className="w-full h-screen">
      <div className="w-full flex justify-center mt-20">
        <div className="w-full lg:w-1/3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
              className="flex flex-col gap-4"
            >
              {/* USER SELECT */}
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder</FormLabel>

                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <SelectTrigger className="w-auto">
                        <SelectValue placeholder="Select account holder" />
                      </SelectTrigger>

                      <SelectContent>
                        {data.data.map((holder) => (
                          <SelectItem key={holder.id} value={String(holder.id)}>
                            {holder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AMOUNT INPUT */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit Amount</FormLabel>
                    <FormControl>
                      {/* <Input
                        {...field}
                        placeholder="Enter amount"
                        autoComplete="off"
                      /> */}
                      <NumericFormat
                        thousandSeparator=","
                        allowNegative={false}
                        placeholder="Enter amount"
                        autoComplete="off"
                        value={field.value ?? ""}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue ?? undefined);
                        }}
                        customInput={Input}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the amount to deposit
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {mutation.isPending ? "Processing…" : "Deposit"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
