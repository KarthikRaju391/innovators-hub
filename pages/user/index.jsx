import dynamic from "next/dynamic";
import React from "react";
import Loading from "../../components/Loading";

const UserDashboard = dynamic(() => import("../../components/Dashboard"), {
	loading: () => <Loading />,
	ssr: false,
});

function Dashboard() {
	return <UserDashboard />;
}

export default Dashboard;
