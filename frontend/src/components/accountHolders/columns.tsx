import type { ColumnDef } from "@tanstack/react-table";
import type { AccountHolder } from "types";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const columns: ColumnDef<AccountHolder>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "accountNumber",
    header: "Acc NO",
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-right text-green-300">Balance</div>,
    cell: ({ row }) => {
      const balanceAmount = parseFloat(row.getValue("balance") ?? 0);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balanceAmount);
      return (
        <div className="text-right text-green-300 font-medium">{formatted}</div>
      );
    },
  },

  {
    accessorKey: "depositsAmount",
    header: () => <div className="text-right text-green-600">Dep Amo</div>,
    cell: ({ row }) => {
      const balanceAmount = parseFloat(row.getValue("depositsAmount") ?? 0);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balanceAmount);
      return (
        <div className="text-right text-green-600 font-medium">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "outstandingDebt",
    header: () => <div className="text-right text-red-600">Debt Amo</div>,
    cell: ({ row }) => {
      const balanceAmount = parseFloat(row.getValue("depositsAmount") ?? 0);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balanceAmount);
      return (
        <div className="text-right text-red-600 font-medium">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "transfersInAmount",
    header: () => <div className="text-right">Tran In</div>,
    cell: ({ row }) => {
      const balanceAmount = parseFloat(row.getValue("transfersInAmount") ?? 0);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balanceAmount);
      return <div className="text-right  font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "transfersOutAmount",
    header: () => <div className="text-right">Tran Out</div>,
    cell: ({ row }) => {
      const balanceAmount = parseFloat(row.getValue("transfersOutAmount") ?? 0);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balanceAmount);
      return <div className="text-right  font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalLoanTaken",
    header: () => <div className="text-right text-red-500">Total Loan</div>,
    cell: ({ row }) => {
      const balanceAmount = parseFloat(row.getValue("depositsAmount") ?? 0);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balanceAmount);
      return (
        <div className="text-right text-red-500 font-medium">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "repaymentsAmount",
    header: () => <div className="text-right">Rep Amo</div>,
    cell: ({ row }) => {
      const repAmount = parseFloat(row.getValue("repaymentsAmount") ?? 0);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(repAmount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original;
      const navigate = useNavigate();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(account.accountNumber)
              }
            >
              Copy Account No
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigate(`/accountholders/edit/${account.id}`);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
