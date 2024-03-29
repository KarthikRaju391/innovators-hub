import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";
import { Accordion, Panel } from "baseui/accordion";
import { Button, SIZE, SHAPE } from "baseui/button";
import { makeSerializable } from "../../../lib/util";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

function orders({ products }) {
	const router = useRouter();
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
		router.replace(router.asPath);
	};

	return (
		<>
			<LoginHeader />
			<BackButton />
			<p className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				Orders
			</p>
			<div className="mb-[3rem] w-3/4 mx-auto pb-[3rem] md:mb-[1rem] md:pb-[1rem] animate__animated animate__fadeInUp">
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
								<p>
									Location:{" "}
									{product.order.deliverTo.street1 +
										", " +
										product.order.deliverTo.city}
								</p>
							</div>
							<Button
								onClick={() => handleParcelReady(product.id)}
								size={SIZE.compact}
								disabled={product.readyToShip}
								shape={SHAPE.pill}
							>
								{product.readyToShip ? "Ready" : "Parcel Ready"}
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
