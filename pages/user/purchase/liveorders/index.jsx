import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
// import ProductCard from "../../../../components/ProductCard";
import { Button, SIZE, SHAPE } from "baseui/button";
import { useState } from "react";
import { makeSerializable } from "../../../../lib/util";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { usePageLoading } from "../../../../lib/usePageLoading";
import Loading from "../../../../components/Loading";

function Products({ orders, initialCursor }) {
	const router = useRouter();
	const { isPageLoading } = usePageLoading();
	const { data: session } = useSession();

	const [cursor, setCursor] = useState(initialCursor);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [isAllLoaded, setIsAllLoaded] = useState(false);
	const [loadedOrders, setLoadedOrders] = useState(orders);

	const loadMoreOrders = async () => {
		if (isLoadingMore || isAllLoaded) return;
		setIsLoadingMore(true);

		const res = await fetch(
			`/api/users/${session?.user.id}/orders?delivered=false&cursor=${cursor}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const data = await res.json();

		setCursor(data.cursor);

		if (data.orders.length === 0) {
			setIsAllLoaded(true);
		} else {
			setLoadedOrders([...loadedOrders, ...data.orders]);
		}

		setIsLoadingMore(false);
	};

	var tblContent =
		loadedOrders?.length > 0 &&
		loadedOrders.map((order) => (
			<tr key={order.id} className="row animate__animated animate__fadeInUp">
				{" "}
				<td className="col">
					{new Date(order.createdAt).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</td>
				<td className="col">
					{order.products.map((product) => (
						<li className="list-none" key={product.id}>
							{product.productName}
						</li>
					))}
				</td>
				<td className="col">
					{order.products.map((product) => (
						<li className="list-none" key={product.id}>
							{product.startup.name}
						</li>
					))}
				</td>
				<td className="col">
					{order.products.map((product) => (
						<li className="list-none" key={product.id}>
							{product.productQuantity}
						</li>
					))}
				</td>
				<td className="col">₹{order.orderCost}</td>
				<td className="col">{order.deliveryStatus}</td>
				<td className="col">{order.deliverTo.street1}</td>
				<td className="col">
					<Button
						onClick={() => router.push(`/user/purchase/liveorders/${order.id}`)}
						size={SIZE.mini}
						shape={SHAPE.pill}
					>
						Track
					</Button>
				</td>{" "}
			</tr>
		));

	if (isPageLoading) return <Loading />;

	return (
		<>
			<BackButton />
			<LoginHeader />
			<p className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">
				Live Orders
			</p>

			<div>
				{loadedOrders?.length > 0 ? (
					<div className="mx-4 overflow-x-auto">
						<table className="mx-auto mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
							<thead>
								<tr className="animate__animated animate__fadeInUp">
									<th>Ordered On</th>
									<th>Products</th>
									<th>Startups</th>
									<th>Quantity</th>
									<th>Total Cost</th>
									<th>Delivery Status</th>
									<th>Deliver To</th>
									<th>Track Products</th>
								</tr>
							</thead>
							<tbody>{tblContent}</tbody>
						</table>
					</div>
				) : (
					<p className="mt-2 cursor-default text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
						No Orders Yet
					</p>
				)}
				{!isAllLoaded && loadedOrders.length > 0 && (
					<div className="flex justify-center">
						<Button
							onClick={loadMoreOrders}
							disabled={isLoadingMore}
							overrides={{
								BaseButton: {
									style: ({ $theme }) => ({
										borderRadius: $theme.sizing.scale600,
									}),
								},
							}}
							startEnhancer={
								<MdKeyboardArrowDown style={{ fontSize: "1.5rem" }} />
							}
						>
							{isLoadingMore ? "Loading..." : "Load More"}
						</Button>
					</div>
				)}
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);

	const res = await fetch(
		`${process.env.NEXT_APP_URL}/api/users/${session.user.id}/orders?delivered=false`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: context.req.headers.cookie,
			},
		}
	);

	const data = await res.json();

	return {
		props: {
			orders: makeSerializable(data.orders),
			initialCursor: makeSerializable(data.cursor),
		},
	};
}

export default Products;
