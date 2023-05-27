import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import { Button } from "baseui/button";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { useState } from "react";
import { makeSerializable } from "../../../../lib/util";
import CartItems from "../../../../components/CartItems";
import Link from "next/link";

function Products({ cart }) {
	const [load1, setLoad1] = useState(false);

	const buyAllHandler = async () => {
		// all the items in the list should be added to the order list
		setLoad1(true);
		const items = cart.quantities.map((i) => i.productId);
		console.log(items);
		setLoad1(false);
	};

	return (
		<>
			<BackButton />
			<LoginHeader />
			<div className="mt-4">
				<h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>
				{cart && cart.quantities.length > 0 ? (
					<div>
						<div className="w-3/4 mx-auto">
							<div>
								{cart.quantities.map((i) => {
									return (
										<CartItems
											key={i.product.id}
											data={i}
											cartId={cart.id}
											url={`/user/purchase/cart/${i.productId}`}
										/>
									);
								})}
							</div>
						</div>
						<div className="w-3/4 mx-auto flex justify-between items-center border-t-2 mt-4 py-4">
							<h1 className="text-3xl font-bold">Subtotal</h1>
							{/* <button onClick={clearCart}>Clear Cart</button> */}
							<h2 className="text-2xl font-semibold">
								₹{cart.totalCost.toFixed(2)}
							</h2>
						</div>
						<div className="flex justify-center w-full">
							<button
								// onClick={handleOrder}
								className="w-3/4 bg-gray-800 hover:bg-gray-700 py-4 text-xl text-slate-200"
							>
								Place Order
								{/* {ordered ? "Order placed successfully!!" : "Place Order"} */}
							</button>
						</div>
					</div>
				) : (
					<div className="text-center mx-auto">
					<Link
						href={`/products`}
						className="select-none my-[.5rem] text-3xl cursor-default py-[30vh] h-[60vh] cursor-pointer"
					>
						Nothing in cart, <span className="text-blue-400 underline underline-offset-[.5rem]">continue shopping</span>
					</Link>
					</div>
				)}
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
	return {
		props: {
			cart: makeSerializable(cart),
		},
	};
}

export default Products;
