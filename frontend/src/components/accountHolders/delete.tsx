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
import { accountHolderService } from "@/utils/accountHolderService";

interface DeleteProp {
  id: number;
  open: boolean; // control visibility
  onOpenChange: Dispatch<SetStateAction<boolean>>; // callback when dialog opens/closes
}

const Delete = ({ id, open, onOpenChange }: DeleteProp) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => accountHolderService.deleteAccountHolder(id),
    onSuccess: (res) => {
      toast.success(res.message || "Account deleted");
      queryClient.invalidateQueries({ queryKey: ["accountHolders"] });
      queryClient.invalidateQueries({ queryKey: ["accountHoldersStats"] });
      onOpenChange(false); // close dialog after deletion
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-1">
            <p>
              The account holder will be permanently deleted from the system. if
              the account is associated with any transactions, the account will
              be <b className="text-orange-400">soft deleted</b>.
            </p>
            <p className="text-sm text-red-500">Do you want to proceed ?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutation.mutate()}
            className="bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
