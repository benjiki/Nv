import { useAuth } from "@/hooks/useAuth";

const Home: React.FC = () => {
  const { data: user, isLoading } = useAuth();

  if (isLoading) return <div>Loading user...</div>;
  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.phoneNumber}</h1>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p>You are not logged in</p>
      )}
    </div>
  );
};

export default Home;
