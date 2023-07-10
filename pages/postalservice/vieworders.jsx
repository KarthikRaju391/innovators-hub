import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import { Button, SIZE } from "baseui/button";
import { fetcher } from "../../lib/fetcher";
import useSWR from "swr";
import { useRouter } from "next/router";
import { getUniqueLocationsForOrder } from "../../lib/getUniqueLocationsForOrder";
import { getUniqueEmailsForOrder } from "../../lib/getUniqueStartupEmails";

function viewmanager() {
	const { data, error, isLoading } = useSWR(
		"/api/postalService/orders",
		fetcher
	);

	const router = useRouter();

	if (isLoading) {
		console.log("orders data loading");
	} else if (error) {
		console.log(error, "orders data error");
	} else {
		console.log(data, "orders data");
	}

	// create a set of startup locations

	const handleCollected = async (orderId) => {
		const res = await fetch(`/api/postalService/orders/${orderId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ deliveryStatus: "Collected" }),
		});

		await res.json();
		router.replace(router.asPath);
	};

	const handleDelivered = async (orderId) => {
		const res = await fetch(`/api/postalService/orders/${orderId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ deliveryStatus: "Delivered" }),
		});
		await res.json();
		router.replace(router.asPath);
	};

	var tblContent = data?.map((order, i) => {
		const uniqueLocations = getUniqueLocationsForOrder(order);
		const uniqueEmails = getUniqueEmailsForOrder(order);
		return (
			<tr key={i} className={`row animate__animated animate__fadeInUp`}>
				{" "}
				<td className="col">
					{uniqueLocations.map((location) => (
						<li className="list-none">{location}</li>
					))}
				</td>{" "}
				<td className="col">
					{order.deliverTo.street1 + ", " + order.deliverTo.city}
				</td>{" "}
				<td className="col">
					{new Date(order.createdAt).toLocaleDateString("en-US", {
						year: "2-digit",
						month: "2-digit",
						day: "numeric",
					})}
				</td>{" "}
				<td className="col">
					{order.products.map((product) => (
						<li className="list-none">
							{product.productName} - {product.productQuantity}
						</li>
					))}
				</td>{" "}
				<td className="col">
					{uniqueEmails.map((email) => (
						<li className="list-none">{email}</li>
					))}
				</td>{" "}
				<td className="col">{order.user.phoneNumber}</td>{" "}
				<td className="col">
					<Button
						onClick={() => handleCollected(order.id)}
						disabled={order.deliveryStatus === "COLLECTED"}
						size={SIZE.compact}
					>
						Collected
					</Button>
				</td>{" "}
				<td className="col">
					<Button
						onClick={() => handleDelivered(product.order.id)}
						disabled={order.deliveryStatus === "DELIVERED"}
						size={SIZE.compact}
					>
						Delivered
					</Button>
				</td>{" "}
			</tr>
		);
	});

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
