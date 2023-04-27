import { useState } from "react";
import { HiPlusCircle, HiMinusCircle } from "react-icons/hi";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useRouter } from "next/router";

function CartItems(props) {
	const [quantity, setQuantity] = useState(props.data.quantity);
	const router = useRouter();

	async function handleQuantityUpdate(quantity) {
		if (quantity < 1) {
			const res = await fetch(`/api/cart/${props.cartId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					cartItemId: props.data.product.id,
				}),
			});

			await res.json();
			router.replace(router.asPath);
		} else {
			//update request
			const res = await fetch(`/api/cart/${props.cartId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					cartItemId: props.data.product.id,
					quantity: quantity,
				}),
			});
			const data = await res.json();
			setQuantity(data.quantity);
		}
	}

	const deleteItem = async (productId) => {
		const res = await fetch(`/api/cart/${props.cartId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				cartItemId: productId,
			}),
		});

		await res.json();
		router.replace(router.asPath);
	};

	return (
		<div className="flex gap-x-5 items-center justify-around w-[80%] bg-slate-600 rounded-2xl text-slate-200">
			<img
				className="h-[15rem] w-[12rem] object-contain"
				src={props?.data.product?.image && props?.data.product?.image[0]}
				alt="Product Image"
				loading="lazy"
			/>
			<div className="flex flex-wrap justify-between gap-y-2 gap-x-5 items-center w-[60%]">
				<div>
					<p className="break-all">{props.data.product.name}</p>
					<p>{"₹ " + props.data.product.price}</p>
				</div>
				<div className="flex gap-4">
					<HiPlusCircle
						fontSize={"1.5rem"}
						onClick={() => handleQuantityUpdate(quantity + 1)}
					/>
					<p>{quantity}</p>
					<HiMinusCircle
						fontSize={"1.5rem"}
						onClick={() => handleQuantityUpdate(quantity - 1)}
					/>
				</div>
				<div title="Remove item">
					<RiDeleteBin2Fill
						fontSize={"1.5rem"}
						onClick={(e) => deleteItem(props.data.product.id)}
					/>
				</div>
				<p
					className="break-keep cursor-pointer select-none outline outline-offset-2 outline-slate-300 hover:bg-slate-300 hover:text-slate-900 rounded-lg p-.5"
					onClick={() => {
						props.url != undefined || props.url != null
							? router.push(props.url)
							: router.push(router.asPath);
					}}
				>
					View More...
				</p>
			</div>
		</div>
	);
}

export default CartItems;
