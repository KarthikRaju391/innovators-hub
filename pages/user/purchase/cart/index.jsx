import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import { Button } from "baseui/button";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { makeSerializable } from "../../../../lib/util";
import CartItems from "../../../../components/CartItems";
import { useSession } from "next-auth/react";

function Products({ cart }) {
	const [load1, setLoad1] = useState(false);
	const { data: session } = useSession();

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		document.body.appendChild(script);
	}, []);

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
		const orderRes = await res1.json();

		var options = {
			key: process.env.KEY_ID, // Enter the Key ID generated from the Dashboard
			amount: orderRes.orderCost, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
			currency: "INR",
			name: "Innovators Hub", //your business name
			description: "Test Transaction",
			// image: "https://example.com/your_logo",
			order_id: orderRes.transaction.razorpayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
			handler: async function (response) {
				// payment success modal

				// cart clear
				await fetch(`/api/cart/`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(cartData.id),
				});

				const razorpayResponse = {
					orderId: orderRes.id,
					razorpay_payment_id: response.razorpay_payment_id,
					razorpay_order_id: response.razorpay_order_id,
					razorpay_signature: response.razorpay_signature,
				};

				const validation = await fetch(`/api/order/`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(razorpayResponse),
				});

				if (validation) {
					alert("Payment Successful");
					window.location.reload();
				} else {
					alert("Payment Failed");
				}
			},
			prefill: {
				name: session.user.name, //your customer's name
				email: session.user.email, //your customer's email
				contact: session.user.contact, //Provide the customer's phone number for better conversion rates
			},
			theme: {
				color: "#3399cc",
			},
		};

		var rzp1 = new Razorpay(options);
		rzp1.on("payment.failed", async function (response) {
			alert(response.error.code);
			alert(response.error.description);
			alert(response.error.source);
			alert(response.error.step);
			alert(response.error.reason);
			alert(response.error.metadata.order_id);
			alert(response.error.metadata.payment_id);
			await fetch(`/api/order/`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ orderId: orderRes.id }),
			});
		});

		rzp1.open();

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
							className="select-none my-[.5rem] text-3xl py-[30vh] h-[60vh] cursor-pointer"
						>
							Nothing in cart,{" "}
							<span className="text-blue-400 underline underline-offset-[.5rem]">
								continue shopping
							</span>
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

	console.log(cart);
	return {
		props: {
			cart: makeSerializable(cart),
		},
	};
}

export default Products;
