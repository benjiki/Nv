import Loader from "@/components/Loader";
import { useAccountHolders } from "@/hooks/useAccountHolder";
const AccountHolders = () => {
  const { data, isLoading, isError, error, refetch } = useAccountHolders();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }
  if (!data || data.length === 0) {
    return <h1>no Accounts found</h1>;
  }
  return (
    <div>
      <h1>data check</h1>
      {data?.map((accountHolder) => (
        <div key={accountHolder.id}>{accountHolder.name}</div>
      ))}
    </div>
  );
};

export default AccountHolders;
