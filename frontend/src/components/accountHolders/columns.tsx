import type { ColumnDef } from "@tanstack/react-table";
import type { AccountHolder } from "types";

export const columns: ColumnDef<AccountHolder>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
    header: "Tran In",
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
    header: "Tran Out",
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
];
