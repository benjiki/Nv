import { columns } from "@/components/accountHolders/columns";
import { DataTable } from "@/components/accountHolders/data-table";
import { DataTablePagination } from "@/components/DataTablePagination";
import Loader from "@/components/Loader";
import { useAccountHolders } from "@/hooks/useAccountHolder";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const AccountHolders = () => {
  // isError, error, refetch
  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [page, setPage] = useState(0); // zero-based page index
  const [pageSize, setPageSize] = useState(10);
  // Debounce the inputs (wait 500ms after typing stops)
  const [debouncedName] = useDebounce(name, 500);
  const [debouncedAccountNumber] = useDebounce(accountNumber, 500);

  const { data, isLoading } = useAccountHolders({
    name: debouncedName,
    accountNumber: debouncedAccountNumber,
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
  if (!data) {
    return <h1>no Accounts found</h1>;
  }
  return (
    <div>
      <h1>Account Holders</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Filter by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1"
        />
        <input
          type="text"
          placeholder="Filter by account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="border px-2 py-1"
        />
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

export default AccountHolders;
