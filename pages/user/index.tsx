import { useRouter } from 'next/router';

const UserDashboard = () => {
  const router = useRouter();

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default UserDashboard;