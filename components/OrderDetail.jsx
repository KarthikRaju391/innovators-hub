import React from "react";
import { Button } from "baseui/button";
import { useRouter } from "next/router";

const OrderDetail = ({ order, history = false }) => {
	const router = useRouter();

	const handleOrderDelete = async () => {
		const res = await fetch(`/api/order/${order.id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.status === 200) {
			router.back();
		}
	};

	return (
		<div className="text-left w-1/2 mx-auto">
			<div className="flex flex-col gap-y-2">
				{history && <h2 className="text-xl text-center font-semibold">
					Delivered on{" "}
					{new Date(order.updatedAt).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</h2>}
				<h3 className="text-2xl font-semibold">Products</h3>
				<ul className="mb-8">
					{order.products.map((product) => (
						<li
							className="cursor-pointer flex justify-between"
							key={product.id}
						>
							<div className="flex flex-col items-start">
								<p
									onClick={() => router.push(`/products/${product.productId}`)}
									className="text-xl font-bold hover:opacity-70"
								>
									{product.productName}
								</p>
								<p
									onClick={() =>
										router.push(`/user/startup/${product.startup.id}`)
									}
									className="opacity-70 hover:opacity-100"
								>
									By {product.startup.name}
								</p>
							</div>
							<div className="flex flex-col items-end">
								<p className="text-lg font-semibold">
									₹ {product.productPrice}
								</p>
								<p className="opacity-70">Qty:{product.productQuantity}</p>
							</div>
						</li>
					))}
				</ul>
				<hr />
				<div className="flex justify-between items-center">
					<h3 className="text-xl font-semibold mt-2">Order Total:</h3>
					<p className="text-xl">₹ {order.orderCost}</p>
				</div>
				<Button onClick={handleOrderDelete} className="mt-4">
					{history ? "Delete Order History" : "Cancel Order"}
				</Button>
			</div>
		</div>
	);
};

export default OrderDetail;
