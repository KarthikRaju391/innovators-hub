import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import { Button } from "baseui/button";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { useState } from "react";
import { makeSerializable } from "../../../../lib/util";
import CartItems from "../../../../components/CartItems";

function Products({ cart }) {
	const [load1, setLoad1] = useState(false);

	const buyAllHandler = async () => {
		const res = await fetch(`/api/cart/`);
		const cartData = await res.json();
		// all the items in the list should be added to the order list
		setLoad1(true);
		var items = cartData.quantities.map((i) => {
			return { productId: i.productId, quantity: i.quantity };
		});

		const res1 = await fetch(`/api/order/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(items),
		});
		const data = await res1.json();
		console.log(data);

		setLoad1(false);
	};

	return (
		<>
			<BackButton />
			<LoginHeader />
			<h2 className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">
				Cart Items
			</h2>
			<div className="flex justify-center flex-wrap gap-4 grid-cols-2 mb-[2rem]">
				{cart ? (
					cart.quantities.map((i) => {
						return (
							<CartItems
								key={i.product.id}
								data={i}
								cartId={cart.id}
								url={`/user/purchase/cart/${i.productId}`}
							/>
						);
					})
				) : (
					<h2 className="select-none my-[.5rem] text-3xl cursor-default text-center py-[30vh] h-[60vh] ">
						Hey!!! I'm Empty Here
					</h2>
				)}
			</div>
			{/* <p
				onClick={loadMore}
				className="select-none cursor-pointer mt-2 pt-2 text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]"
			>
				Load More...
			</p> */}
			<div className="flex justify-center gap-5 mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
				<Button
					onClick={buyAllHandler}
					isLoading={load1}
					overrides={{
						BaseButton: {
							style: ({ $theme }) => ({
								backgroundColor: $theme.colors.positive400,
							}),
						},
					}}
					startEnhancer={<FaMoneyCheckAlt style={{ fontSize: "1.5rem" }} />}
				>
					Purchase All Items In Cart
				</Button>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const res = await fetch(`${process.env.NEXT_APP_URL}/api/cart`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Cookie: context.req.headers.cookie,
			"Cache-Control": "no-cache",
		},
	});

	const cart = await res.json();

	console.log(cart);
	return {
		props: {
			cart: makeSerializable(cart),
		},
	};
}

export default Products;
