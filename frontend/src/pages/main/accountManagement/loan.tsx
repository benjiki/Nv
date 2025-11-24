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
import { useAccountHolders } from "@/hooks/useAccountHolder";
import { accountMangementService } from "@/utils/accountManagmentService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AxiosError } from "axios";

const LoanSchema = z.object({
  lenderId: z.number(),
  borrowerId: z.number(),
  amount: z.number(),
  interestRate: z.number().optional(),
});

type LoanData = z.infer<typeof LoanSchema>;

const Loan = () => {
  const { data, isLoading } = useAccountHolders();
  const form = useForm<LoanData>({
    resolver: zodResolver(LoanSchema),
    defaultValues: {
      lenderId: undefined,
      borrowerId: undefined,
      amount: undefined,
      interestRate: 0,
    },
  });
  const lenderId = form.watch("lenderId");
  const borrowerId = form.watch("borrowerId");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: LoanData) =>
      accountMangementService.loanTransaction(values),

    onSuccess: (res) => {
      toast.success(res.message || "Loaned successfully");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

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
              {/*  SELECT */}
              <FormField
                control={form.control}
                name="lenderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lender Account</FormLabel>

                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <SelectTrigger className="w-auto">
                        <SelectValue placeholder="Select account holder" />
                      </SelectTrigger>

                      <SelectContent>
                        {data.data.map((holder) => (
                          <SelectItem
                            key={holder.id}
                            value={String(holder.id)}
                            disabled={holder.id === borrowerId}
                          >
                            {holder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="borrowerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Borrower Account</FormLabel>

                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <SelectTrigger className="w-auto">
                        <SelectValue placeholder="Select account holder" />
                      </SelectTrigger>

                      <SelectContent>
                        {data.data.map((holder) => (
                          <SelectItem
                            key={holder.id}
                            value={String(holder.id)}
                            disabled={holder.id === lenderId}
                          >
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
                    <FormLabel>Loan Amount</FormLabel>
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
                    <FormDescription>Enter the amount to Loan</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate</FormLabel>
                    <FormControl>
                      <NumericFormat
                        thousandSeparator=","
                        allowNegative={false}
                        placeholder="Enter interest rate"
                        autoComplete="off"
                        value={field.value ?? ""}
                        suffix="%"
                        onValueChange={(values) => {
                          field.onChange(values.floatValue ?? undefined);
                        }}
                        customInput={Input}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the interest rate (in %)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {mutation.isPending ? "Processing…" : "LOAN"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Loan;
