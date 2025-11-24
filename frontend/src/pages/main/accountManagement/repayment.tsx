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
import { useAccountHolders } from "@/hooks/useAccountHolder";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountMangementService } from "@/utils/accountManagmentService";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RepaymentSchema = z.object({
  loanId: z.number(),
  payerId: z.number(),
  amount: z.number(),
});

type RepaymentData = z.infer<typeof RepaymentSchema>;

const Repayment = () => {
  const { data, isLoading } = useAccountHolders();
  const form = useForm<RepaymentData>({
    resolver: zodResolver(RepaymentSchema),
    defaultValues: {
      loanId: undefined,
      payerId: undefined,
      amount: undefined,
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: RepaymentData) =>
      accountMangementService.repaymentTransaction(values),
    onSuccess: (res) => {
      toast.success(res.message || "Repayment successfully");
      queryClient.invalidateQueries({ queryKey: ["accountManagment"] });
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
                name="payerId"
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

              <FormField
                control={form.control}
                name="loanId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan to be repaied</FormLabel>

                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <SelectTrigger className="w-auto">
                        <SelectValue placeholder="Select account holder" />
                      </SelectTrigger>

                      <SelectContent>
                        {data.data.map((loan) => (
                          <SelectItem key={loan.id} value={String(loan.id)}>
                            {loan.amount}
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

export default Repayment;
