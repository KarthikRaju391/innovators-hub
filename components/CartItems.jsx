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
		<div className="border-t-2 py-8">
			<div className="flex flex-col md:flex-row items-center mx-auto">
				<div className="md:w-1/4">
					<img
						className="object-cover"
						src={props?.data.product?.image && props?.data.product?.image[0]}
						alt={props?.data.product?.name}
					/>
				</div>
				<div className="md:w-1/2 mx-auto flex flex-col justify-center items-center">
					<h1 className="text-2xl">{props.data.product.name}</h1>
					<h2 className="text-xl font-bold">
						${props.data.product.price * quantity}
					</h2>
					<h3 className="font-semibold mt-4">Quantity: {quantity}</h3>
				</div>
				<div>
					<div className="flex justify-between items-center gap-2">
						<button
							className="border-2 border-gray-800 px-2 rounded-md flex text-2xl font-semibold"
							onClick={() => handleQuantityUpdate(quantity + 1)}
						>
							+
						</button>
						<button
							className="border-2 border-gray-800 px-2 rounded-md flex text-2xl font-semibold"
							onClick={() => handleQuantityUpdate(quantity - 1)}
						>
							-
						</button>
					</div>
					<button
						className="mt-8 bg-red-500 hover:bg-red-600 px-4 py-2 text-slate-100"
						onClick={() => deleteItem(props.data.product.id)}
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	);
}

export default CartItems;
