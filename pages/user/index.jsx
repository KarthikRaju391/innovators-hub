import dynamic from "next/dynamic";

const UserDashboard = dynamic(() => import("../../components/Dashboard"), {
	loading: () => <p>Loading...</p>,
	ssr: false,
});

function Dashboard() {
	return <UserDashboard />;
}

export default Dashboard;
