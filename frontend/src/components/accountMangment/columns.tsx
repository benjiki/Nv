import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import type { AccountManagment } from "types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";

import Reverese from "./reverse";

const formatCurrency = (value: unknown) => {
  const amount = parseFloat((value as string) || "0");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
const RightAlignedCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`text-right font-medium ${className}`}>{children}</div>;

/** Actions menu component */
const AccountActions = ({ accManage }: { accManage: AccountManagment }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
        <DropdownMenuSeparator />
        {accManage.status !== "REVERSED" ? (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setDeleteDialogOpen(true);
              }}
            >
              <p className="text-purple-500">Reverse</p>
            </DropdownMenuItem>

            <Reverese
              id={accManage.id}
              type={accManage.type}
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            />
          </>
        ) : (
          <p className="text-gray-600">can not reverse</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const currencyColumnsConfig = [
  {
    key: "interestRate",
    label: "Interest Rate",
    className: (row: any) =>
      cn(
        row.interestRate < 20 && "text-green-500",
        row.interestRate >= 20 && row.interestRate <= 50 && "text-orange-500",
        row.interestRate > 50 && "text-red-500"
      ),
  },

  {
    key: "amount",
    label: "Amount",
    className: (row: any) =>
      cn(row.type === "LOAN" ? "text-red-500" : "text-green-500"),
  },

  {
    key: "remainingDebt",
    label: "RM DEBT",
    className: (row: any) => {
      const amount = row.amount;
      const remaining = row.remainingDebt;

      const percentPaid = ((amount - remaining) / amount) * 100;

      return cn(
        percentPaid >= 80
          ? "text-green-500"
          : percentPaid >= 50
          ? "text-yellow-500"
          : "text-red-500"
      );
    },
  },

  {
    key: "type",
    label: "Type",
    className: (row: any) =>
      cn(
        row.type === "TRANSFER" && "text-gray-500",
        row.type === "REPAYMENT" && "text-green-500",
        row.type === "LOAN" && "text-red-600",
        row.type === "DEPOSIT" && "text-green-500",
        row.type === "NOT_SET" && "text-gray-500"
      ),
  },

  {
    key: "status",
    label: "Status",
    className: (row: any) =>
      cn(
        row.status === "REPAID" && "text-green-600",
        row.status === "PENDING" && "text-yellow-500",
        row.status === "REVERSED" && "text-purple-700",
        row.status === "COMPLETED" && "text-green-600"
      ),
  },
];

const currencyColumnDefs: ColumnDef<AccountManagment>[] =
  currencyColumnsConfig.map(({ key, label, className }) => ({
    accessorKey: key,

    // Header — className is NOT row-dependent
    header: () => (
      <div className={cn("text-right", className({}))}>{label}</div>
    ),

    // Cell — className needs row data
    cell: ({ row }) => {
      const raw = row.getValue(key) as string | number | null;
      const rowData = row.original;

      let display = raw ?? "";

      if (key === "amount") {
        display = formatCurrency(raw);
      }

      if (key === "interestRate") {
        // Show 0.12 → "0.12%"
        const num = parseFloat(raw as any);
        display = isNaN(num) ? "" : `${num}%`;
      }

      return (
        <RightAlignedCell className={cn(className(rowData))}>
          {display}
        </RightAlignedCell>
      );
    },
  }));

export const columns: ColumnDef<AccountManagment>[] = [
  {
    accessorKey: "sender",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sender
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "receiver",
    header: "Receiver",
  },
  ...currencyColumnDefs,
  {
    id: "actions",
    cell: ({ row }) => <AccountActions accManage={row.original} />,
  },
];
