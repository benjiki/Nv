import { columns } from "@/components/accountMangment/columns";
import { DataTable } from "@/components/accountMangment/data-table";
import { DataTablePagination } from "@/components/DataTablePagination";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccountManager } from "@/hooks/useAccountManager";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const AccountMangement = () => {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [status, setStatus] = useState<"REPAID" | "PENDING" | "NOT_SET">(
    "NOT_SET"
  );
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<
    "TRANSFER" | "REPAYMENT" | "LOAN" | "DEPOSIT" | "NOT_SET"
  >("NOT_SET");

  const [page, setPage] = useState(0); // zero-based page index
  const [pageSize, setPageSize] = useState(10);

  // Debounce the inputs (wait 500ms after typing stops)
  const [debouncedSender] = useDebounce(sender, 500);
  const [debouncedReceiver] = useDebounce(receiver, 500);
  const [debouncedStatus] = useDebounce(status, 500);
  const [debouncedAmount] = useDebounce(amount, 500);
  const [debouncedType] = useDebounce(type, 500);

  const { data, isLoading } = useAccountManager({
    sender: debouncedSender,
    receiver: debouncedReceiver,
    status: debouncedStatus !== "NOT_SET" ? debouncedStatus : undefined,
    type: debouncedType !== "NOT_SET" ? debouncedType : undefined,
    amount: debouncedAmount,
    page: page + 1,
    limit: pageSize,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }
  if (!data || !data.data) {
    return <h1>no Transactions found</h1>;
  }
  return (
    <div className="">
      <div className="my-4 flex flex-row gap-4 flex-wrap items-center w-full">
        {/* Sender filter */}
        <Input
          type="text"
          placeholder="Filter by Sender"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          className="border-2 w-fit"
        />

        {/* Receiver filter */}
        <Input
          type="text"
          placeholder="Filter by Receiver"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="border-2 w-fit"
        />

        {/* Type filter */}
        <Select
          value={type}
          onValueChange={(value) =>
            setType(
              value as "TRANSFER" | "REPAYMENT" | "LOAN" | "DEPOSIT" | "NOT_SET"
            )
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NOT_SET">All Types</SelectItem>
            <SelectItem value="TRANSFER">TRANSFER</SelectItem>
            <SelectItem value="REPAYMENT">REPAYMENT</SelectItem>
            <SelectItem value="LOAN">LOAN</SelectItem>
            <SelectItem value="DEPOSIT">DEPOSIT</SelectItem>
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={status}
          onValueChange={(value) =>
            setStatus(value as "REPAID" | "PENDING" | "NOT_SET")
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NOT_SET">All Status</SelectItem>
            <SelectItem value="REPAID">REPAID</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={data.data} />
      <DataTablePagination
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={data.total || 0} // total rows from backend
      />
    </div>
  );
};

export default AccountMangement;
