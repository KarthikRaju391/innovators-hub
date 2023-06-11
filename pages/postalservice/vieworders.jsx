import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import { Button, SIZE } from "baseui/button";
import { fetcher } from "../../lib/fetcher";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useState } from "react";

function viewmanager() {
	const { data, error, isLoading } = useSWR(
		"/api/postalService/orders?deliveryStatus=Ready",
		fetcher
	);

	const [orderCollected, setOrderCollected] = useState(false);
	const [orderDelivered, setOrderDelivered] = useState(false);

	const router = useRouter();

	if (isLoading) {
		console.log("orders data loading");
	} else if (error) {
		console.log(error, "orders data error");
	} else {
		console.log(data, "orders data");
	}

	const handleCollected = async (orderId) => {
		setOrderCollected(true);
		const res = await fetch(`/api/postalService/orders/${orderId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ deliveryStatus: "Collected" }),
		});

		const data = await res.json();
		router.replace(router.asPath);
	};

	const handleDelivered = async (orderId) => {
		setOrderDelivered(true);
		const res = await fetch(`/api/postalService/orders/${orderId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ deliveryStatus: "Delivered" }),
		});
		const data = await res.json();
		router.replace(router.asPath);
	};

	var tblContent = data?.map((product, i) => (
		<tr key={i} className={`row animate__animated animate__fadeInUp`}>
			{" "}
			<td className="col">{product.startup.location}</td>{" "}
			<td className="col">{product.order.deliverTo}</td>{" "}
			<td className="col">
				{new Date(product.order.createdAt).toLocaleDateString()}
			</td>{" "}
			<td className="col">{product.productName}</td>{" "}
			<td className="col">{product.startup.email}</td>{" "}
			<td className="col">{product.order.user.phoneNumber}</td>{" "}
			<td className="col">
				<Button
					onClick={() => handleCollected(product.order.id)}
					disabled={
						orderCollected || product.order.deliveryStatus === "Collected"
					}
					size={SIZE.compact}
				>
					Collected
				</Button>
			</td>{" "}
			<td className="col">
				<Button
					onClick={() => handleDelivered(product.order.id)}
					disabled={
						orderDelivered || product.order.deliveryStatus === "Delivered"
					}
					size={SIZE.compact}
				>
					Delivered
				</Button>
			</td>{" "}
		</tr>
	));

	return (
		<>
			<LoginHeader />
			<BackButton />
			<p className="select-none mt-[1rem] pt-[1rem] text-3xl cursor-default text-center">
				View Orders
			</p>

			{data?.length > 0 ? (
				<div className="mx-4 overflow-x-auto">
					<table className="mx-auto mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
						<thead>
							<tr className="animate__animated animate__fadeInUp">
								<th>From</th>
								<th>To</th>
								<th>Date</th>
								<th>Product Name</th>
								<th>Startup Contact</th>
								<th>Customer Contact</th>
								<th>Collection</th>
								<th>Delivery</th>
							</tr>
						</thead>
						<tbody>{tblContent}</tbody>
					</table>
				</div>
			) : (
				<p className="mt-2 cursor-default text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
					{isLoading
						? "Loading..."
						: data.length === 0
						? "No Orders Yet"
						: "Error"}{" "}
				</p>
			)}
		</>
	);
}

export default viewmanager;

// var data = [
// 	{
// 		startupAddress: "Bangalore",
// 		customerAddress: "Manglore",
// 		date: "27-02-2023",
// 		productName: "Hand Pump",
// 		startupPhone: "8489531221",
// 		customerPhone: "6362232130",
// 	},
// 	{
// 		startupAddress: "Bangalore",
// 		customerAddress: "Tumkur",
// 		date: "27-01-2023",
// 		productName: "Books",
// 		startupPhone: "7654329843",
// 		customerPhone: "9844722941",
// 	},
// 	{
// 		startupAddress: "Bangalore",
// 		customerAddress: "Hampi",
// 		date: "27-12-2022",
// 		productName: "Phone",
// 		startupPhone: "9596232453",
// 		customerPhone: "9038541752",
// 	},
// 	{
// 		startupAddress: "Bangalore",
// 		customerAddress: "Bellari",
// 		date: "27-11-2022",
// 		productName: "Laptop",
// 		startupPhone: "8489531221",
// 		customerPhone: "6362232130",
// 	},
// 	{
// 		startupAddress: "Bangalore",
// 		customerAddress: "Dharwad",
// 		date: "27-10-2022",
// 		productName: "Charger",
// 		startupPhone: "8489531221",
// 		customerPhone: "6362232130",
// 	},
// ];

// data?.sort((a, b) => {
// 	const dateA = new Date(a.date.split("-").reverse().join("-"));
// 	const dateB = new Date(b.date.split("-").reverse().join("-"));
// 	return dateA.getTime() - dateB.getTime();
// });
