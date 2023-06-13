import dynamic from "next/dynamic";
import React from "react";

const UserDashboard = dynamic(() => import("../../components/Dashboard"), {
	loading: () => <p className="text-center">Loading...</p>,
	ssr: false,
});

function Dashboard() {
	return <UserDashboard />;
}

export default Dashboard;
