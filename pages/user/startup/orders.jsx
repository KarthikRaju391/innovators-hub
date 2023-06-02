import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";
import { Accordion, Panel } from "baseui/accordion";
import { Button, SIZE, SHAPE } from "baseui/button";
import { makeSerializable } from "../../../lib/util";
import { getSession } from "next-auth/react";

function orders({ orders }) {
	var currentTheme;
	currentTheme =
		typeof window !== "undefined"
			? JSON.parse(localStorage.getItem("theme"))
			: 1;

	console.log(orders, "orders");

	// get user data & place them in data variable at line14

	const data = [
		{
			productName: "Product 1",
			productId: "1",
			orders: [
				{ name: "Customer 1", pieces: "1", orderId: "1" },
				{ name: "Customer 2", pieces: "2", orderId: "2" },
			],
		},
		{
			productName: "Product 2",
			productId: "2",
			orders: [
				{ name: "Customer 1", pieces: "1", orderId: "3" },
				{ name: "Customer 2", pieces: "2", orderId: "4" },
			],
		},
		{
			productName: "Product 3",
			productId: "3",
			orders: [
				{ name: "Customer 1", pieces: "1", orderId: "5" },
				{ name: "Customer 2", pieces: "2", orderId: "6" },
			],
		},
	];

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
								onClick={() => console.log(order.id)}
								size={SIZE.compact}
								shape={SHAPE.pill}
							>
								{" "}
								Parcel Ready{" "}
							</Button>
						</Panel>
					))}

					{/* onChange={({ expanded }) => console.log(expanded)} */}
					{/* {orders.products.map((product) => (
						<Panel title={product.productName} key={product.productId}>
							{product.orders.map((order) => (
								<div
									key={order.orderId}
									className="flex gap-4 items-center mt-1 pt-1"
								>
									<p>Name: {order.name}</p>
									<p>Pieces Ordered: {order.pieces}</p>
									<Button
										onClick={() => console.log(order.orderId)}
										size={SIZE.compact}
										shape={SHAPE.pill}
									>
										{" "}
										Parcel Ready{" "}
									</Button>
								</div>
							))}
						</Panel>
					))} */}
				</Accordion>
			</div>
		</>
	);
}

export default orders;

export async function getServerSideProps(context) {
	const session = await getSession(context);
	const ordersApi = await fetch(
		`${process.env.NEXT_APP_URL}/api/startup/${session.user.startupId}/orders`,
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
