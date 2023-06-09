import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";
import { Accordion, Panel } from "baseui/accordion";
import { Button, SIZE, SHAPE } from "baseui/button";
import { makeSerializable } from "../../../lib/util";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";

function orders({ products }) {
	const [parcelReady, setParcelReady] = useState(false);
	const { data: session } = useSession();

	var currentTheme;
	currentTheme =
		typeof window !== "undefined"
			? JSON.parse(localStorage.getItem("theme"))
			: 1;

	// get user data & place them in data variable at line14

	const handleParcelReady = async (productId) => {
		const res = await fetch(
			`/api/startup/${session.user.startupId}/order/${productId}`,
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

	console.log(products)

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
					{products.map((product) => (
						<Panel
							title={product.productName}
							key={product.id}
							// expanded={expandedOrderId === order.orderId}
							// onClick={() => handlePanelClick(order.orderId)}
						>
							<div>
								<p>Quantity: {product.productQuantity}</p>
								<p>Price: {product.productPrice}</p>
								<p>Deliver to: {product.order.user.name}</p>
								<p>Location: {product.order.deliverTo}</p>
							</div>
							<Button
								onClick={() => handleParcelReady(product.id)}
								size={SIZE.compact}
								disabled={parcelReady || product.readyToShip}
								shape={SHAPE.pill}
							>
								{parcelReady || product.readyToShip ? "Ready" : "Parcel Ready"}
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

	const products = await ordersApi.json();

	return {
		props: {
			products: makeSerializable(products),
		},
	};
}
