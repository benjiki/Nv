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
  return <div className="">Repayment</div>;
};

export default Repayment;
