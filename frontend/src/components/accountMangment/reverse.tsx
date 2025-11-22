import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { accountMangementService } from "@/utils/accountManagmentService";
import type { TransactionType } from "types";

interface RevereseProp {
  id: number;
  open: boolean; // control visibility
  type: TransactionType;
  onOpenChange: Dispatch<SetStateAction<boolean>>; // callback when dialog opens/closes
}

const Reverese = ({ id, type, open, onOpenChange }: RevereseProp) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => accountMangementService.reverseTransaction(id, type),
    onSuccess: (res) => {
      toast.success(res.message || "Transaction Reversed");

      queryClient.invalidateQueries({
        queryKey: ["accountTransactions"],
      });
      queryClient.invalidateQueries({ queryKey: ["accountHolders"] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to reverse transaction");
    },
  });

  const handleReverse = () => {
    if (type === "NOT_SET") {
      toast.error("Cannot reverse a transaction with type NOT_SET");
      return;
    }
    mutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            {type} Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-1">
            <p>
              The transaction will be reversed. Are you sure you want to
              proceed?
            </p>
            <p className="text-sm text-red-500">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleReverse} className="bg-red-600">
            Reverse
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Reverese;
