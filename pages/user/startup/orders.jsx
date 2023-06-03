import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";
import { Accordion, Panel } from "baseui/accordion";
import { Button, SIZE, SHAPE } from "baseui/button";
import { makeSerializable } from "../../../lib/util";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { Status } from "@prisma/client";

function orders({ orders }) {
	const [parcelReady, setParcelReady] = useState(false);
	const { data: session } = useSession();
	var currentTheme;
	currentTheme =
		typeof window !== "undefined"
			? JSON.parse(localStorage.getItem("theme"))
			: 1;

	// get user data & place them in data variable at line14

	const handleParcelReady = async (orderId) => {
		const res = await fetch(
			`/api/startup/${session.user.startupId}/order/${orderId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		await res.json();
		setParcelReady(true);
	};

	return (
		<>
			<LoginHeader />
			<BackButton />
			<h2 className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				Orders
			</h2>
			<div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem] animate__animated animate__fadeInUp">
				<Accordion
					accordion
					overrides={{
						Header: {
							style: ({ $theme }) => ({
								backgroundColor: currentTheme ? "#eeeeee" : "#292929",
							}),
						},
					}}
				>
					{orders.map((order) => (
						<Panel
							title={`Order ID: ${order.id}`}
							key={order.id}
							// expanded={expandedOrderId === order.orderId}
							// onClick={() => handlePanelClick(order.orderId)}
						>
							{order.products.map((product) => (
								<div>
									<div key={product.productId}>
										<p>{product.productName}</p>
										<p>{product.productPrice}</p>
										<p>{product.productQuantity}</p>
									</div>
								</div>
							))}
							<div>
								<p>Order Total: {order.orderCost}</p>
								<p>Deliver to: {order.user.name}</p>
								<p>Location: {order.deliverTo}</p>
							</div>
							<Button
								onClick={() => handleParcelReady(order.id)}
								size={SIZE.compact}
								disabled={parcelReady || order.deliveryStatus === "READY"}
								shape={SHAPE.pill}
							>
								{parcelReady || order.deliveryStatus === "READY"
									? "Ready"
									: "Parcel Ready"}
							</Button>
						</Panel>
					))}
				</Accordion>
			</div>
		</>
	);
}

export default orders;

export async function getServerSideProps(context) {
	const session = await getSession(context);
	const ordersApi = await fetch(
		`${process.env.NEXT_APP_URL}/api/startup/${session.user.startupId}/order`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: context.req.headers.cookie,
			},
		}
	);

	const orders = await ordersApi.json();

	return {
		props: {
			orders: makeSerializable(orders),
		},
	};
}
