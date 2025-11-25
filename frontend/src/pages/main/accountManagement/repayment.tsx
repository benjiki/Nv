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
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountMangementService } from "@/utils/accountManagmentService";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoanRepayment } from "@/hooks/useAccountManager";
import type { AxiosError } from "axios";

const RepaymentSchema = z.object({
  loanId: z.number(),
  payerId: z.number(),
  amount: z.number(),
});

type RepaymentData = z.infer<typeof RepaymentSchema>;

const Repayment = () => {
  const { data, isLoading } = useLoanRepayment();

  const form = useForm<RepaymentData>({
    resolver: zodResolver(RepaymentSchema),
    defaultValues: {
      loanId: undefined,
      payerId: undefined,
      amount: undefined,
    },
  });
  const selectedLenderId = form.watch("payerId");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: RepaymentData) =>
      accountMangementService.repaymentTransaction(values),
    onSuccess: (res) => {
      toast.success(res.message || "Repayment successful");
      form.reset({
        loanId: undefined,
        payerId: undefined,
        amount: undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["accountTransactions"] });
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

  if (!data || data.length === 0) {
    return <h1>No loans found</h1>;
  }
  const lenderLoans = selectedLenderId
    ? data.filter((loan) => loan.senderid === selectedLenderId)
    : [];

  Array.from(
    new Map(data.map((loan) => [loan.senderid, loan.sender])).values()
  );

  return (
    <div className="w-full h-screen">
      <div className="w-full flex justify-center mt-20">
        <div className="w-full lg:w-1/3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
              className="flex flex-col gap-4"
            >
              {/* SELECT: Lender Account */}
              <FormField
                control={form.control}
                name="payerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lender Account</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <SelectTrigger className="w-auto">
                        <SelectValue placeholder="Select lender" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          new Map(
                            data.map((loan) => [loan.senderid, loan.sender])
                          ).entries()
                        ).map(([id, name]) => (
                          <SelectItem key={id} value={String(id)}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SELECT: Loan to Repay */}
              <FormField
                control={form.control}
                name="loanId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan to be repaid</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        const selectedLoan = data.find(
                          (loan) => loan.id === Number(val)
                        );
                        field.onChange(Number(val));

                        // Prefill amount
                        form.setValue(
                          "amount",
                          selectedLoan?.remainingDebt ??
                            Number(selectedLoan?.amount) ??
                            undefined
                        );

                        // Optionally set payerId automatically
                        if (selectedLoan) {
                          form.setValue("payerId", selectedLoan.senderid);
                        }
                      }}
                      value={field.value ? String(field.value) : ""}
                    >
                      <SelectTrigger className="w-auto">
                        <SelectValue placeholder="Select loan" />
                      </SelectTrigger>
                      <SelectContent>
                        {lenderLoans.map((loan) => (
                          <SelectItem key={loan.id} value={String(loan.id)}>
                            {`${loan.receiver} - TAmount: ${loan.amount} - RAmount: ${loan.remainingDebt}`}
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
                    <FormDescription>Enter the amount to repay</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {mutation.isPending ? "Processing…" : "REPAY"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Repayment;
