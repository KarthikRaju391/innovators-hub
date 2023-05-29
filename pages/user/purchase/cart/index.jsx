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
