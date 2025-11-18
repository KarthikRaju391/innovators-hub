import { useState } from "react";
import { useRouter } from "next/router";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
}

interface CartItemsProps {
    data: {
        quantity: number;
        product: Product;
    };
    cartData: {
        quantities: Array<{
            productId: string;
            quantity: number;
            product: Product;
        }>;
        totalCost: number;
    };
    setTotalCost: (cost: number) => void;
    setCartData: (data: any) => void;
    handleSave: (data: any) => void;
}

function CartItems(props: CartItemsProps) {
	const [quantity, setQuantity] = useState(props.data.quantity);
	const router = useRouter();

	function calculateTotalCost(quantities: Array<{ quantity: number; product: Product }>): number {
		return quantities.reduce((total: number, currentItem) => {
			const product = currentItem.product;
			if (product) {
				return total + currentItem.quantity * product.price;
			}
			return total;
		}, 0);
	}

	function updateCartData(productId: string, updatedQuantity: number): void {
		const newCartData = { ...props.cartData };
		const quantityIndex = newCartData.quantities.findIndex(
			(q) => q.productId === productId
		);

		if (quantityIndex !== -1) {
			newCartData.quantities[quantityIndex].quantity = updatedQuantity;
			props.setTotalCost(calculateTotalCost(newCartData.quantities));
			newCartData.totalCost = calculateTotalCost(newCartData.quantities);

			props.setCartData(newCartData);
			props.handleSave(newCartData);
		}
	}

	function handleQuantityUpdate(quantity: number): void {
		const productId = props.data.product.id;
		if (quantity < 1) {
			return;
		} else if (quantity === 1) {
			// ... code to handle deletion
			setQuantity(1);
			updateCartData(productId, 1);
		} else {
			// ... code to handle update
			setQuantity(quantity);
			updateCartData(productId, quantity);
		}
	}
	const deleteItem = (productId: string) => {
		const updatedQuantities = props.cartData.quantities.filter(
			(i) => i.productId !== productId
		);
		const updatedTotalCost = calculateTotalCost(updatedQuantities);
		props.setTotalCost(updatedTotalCost);
		const newCartData = {
			...props.cartData,
			quantities: updatedQuantities,
			totalCost: updatedTotalCost,
		};
		props.setCartData(newCartData);
		props.handleSave(newCartData);
	};

	return (
		<div className="border-t-2 py-8">
			<div className="flex flex-col md:flex-row items-center mx-auto">
				<div className="md:w-1/4">
					<img
						className="object-cover"
						width={200}
						src={props?.data.product?.image && props?.data.product?.image[0]}
						alt={props?.data.product?.name}
					/>
				</div>
				<div className="md:w-1/2 mx-auto flex flex-col justify-center items-center">
					<h1 className="text-2xl">{props.data.product.name}</h1>
					<h2 className="text-xl font-bold">
						₹{props.data.product.price * quantity}
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
