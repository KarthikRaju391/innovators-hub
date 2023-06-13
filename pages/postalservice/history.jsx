import { useRouter } from "next/router";
import { useState } from "react";
import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import { fetcher } from "../../lib/fetcher";
import useSWR from "swr";
import Loading from "../../components/Loading";

function adminhistory() {
	// get orders and postal service data
	const {
		data: orders,
		error,
		isLoading: orderIsLoading,
	} = useSWR("/api/postalService/orders", fetcher);

	const {
		data: postalService,
		error: postalServiceError,
		isLoading: postalServiceIsLoading,
	} = useSWR("/api/postalService", fetcher);

	const [orderCollected, setOrderCollected] = useState(false);
	const [orderDelivered, setOrderDelivered] = useState(false);

	if (orderIsLoading || postalServiceIsLoading) return <Loading />;

	// var data = [
	//     {email: 'a@g.co', date: "27-02-2023", action: "Collected"},
	//     {email: 'b@g.co', date: "27-01-2023", action: "Delivered"},
	//     {email: 'c@g.co', date: "27-12-2022", action: "Access Granted"},
	//     {email: 'd@g.co', date: "27-11-2022", action: "Access Revoked"},
	//     {email: 'e@g.co', date: "27-10-2022", action: "Collected"},
	// ]

	var data = [];

	orders?.forEach((order) => {
		data.push({
			email: order.startup.email,
			date: order.order.updatedAt,
			action: order.order.deliveryStatus,
		});
	});
	postalService?.forEach((user) => {
		data.push({
			email: user.email,
			date: user.updatedAt,
			action: user.accessType,
		});
	});

	data?.sort((a, b) => {
		const dateA = new Date(a.updatedAt);
		const dateB = new Date(b.updatedAt);
		return dateA.getTime() - dateB.getTime();
	});

	var tblContent = data?.map((e, i) => (
		<tr key={i} className={`row animate__animated animate__fadeInUp`}>
			{" "}
			<td className="col">{e.email}</td>{" "}
			<td className="col">
				{new Date(e.date).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</td>{" "}
			<td className="col">{e.action}</td>{" "}
		</tr>
	));
	return (
		<>
			<LoginHeader />
			<BackButton />
			<p className="select-none mt-[1rem] pt-[1rem] text-3xl cursor-default text-center">
				History
			</p>

			{data?.length > 0 ? (
				<div className="mx-4 overflow-x-auto">
					<table className="mx-auto mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
						<thead>
							<tr className="animate__animated animate__fadeInUp">
								<th>Email</th>
								<th>Date</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>{tblContent}</tbody>
					</table>
				</div>
			) : (
				<p className="mt-2 cursor-default text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
					No History Yet
				</p>
			)}
		</>
	);
}

export default adminhistory;
