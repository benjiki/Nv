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

import { useState } from "react";
import Delete from "./delete";

/** Helper to format numbers as USD currency */
const formatCurrency = (value: unknown) => {
  const amount = parseFloat((value as string) || "0");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/** Right-aligned cell wrapper with optional additional classes */
const RightAlignedCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`text-right font-medium ${className}`}>{children}</div>;

/** Actions menu component */
const AccountActions = ({ account }: { account: AccountHolder }) => {
  const navigate = useNavigate();
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
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(account.accountNumber)}
        >
          Copy Account No
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate(`/accountholders/edit/${account.id}`)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setDeleteDialogOpen(true);
          }}
        >
          <p className="text-red-600">Delete</p>
        </DropdownMenuItem>
        <Delete
          id={account.id}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/** Configuration for all currency columns */
const currencyColumnsConfig = [
  { key: "balance", label: "Balance", className: "text-green-300" },
  { key: "depositsAmount", label: "Dep Amo", className: "text-green-600" },
  { key: "outstandingDebt", label: "Debt Amo", className: "text-red-600" },
  { key: "transfersInAmount", label: "Tran In", className: "" },
  { key: "transfersOutAmount", label: "Tran Out", className: "" },
  { key: "totalLoanTaken", label: "Total Loan", className: "text-red-500" },
  { key: "repaymentsAmount", label: "Rep Amo", className: "" },
];

/** Generate column definitions for currency columns */
const currencyColumnDefs: ColumnDef<AccountHolder>[] =
  currencyColumnsConfig.map(({ key, label, className }) => ({
    accessorKey: key,
    header: () => <div className={`text-right ${className}`}>{label}</div>,
    cell: ({ row }) => (
      <RightAlignedCell className={className}>
        {formatCurrency(row.getValue(key))}
      </RightAlignedCell>
    ),
  }));

/** Main columns array */
export const columns: ColumnDef<AccountHolder>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "accountNumber",
    header: "Acc NO",
  },
  ...currencyColumnDefs,
  {
    id: "actions",
    cell: ({ row }) => <AccountActions account={row.original} />,
  },
];
