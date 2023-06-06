import prisma from "./prisma";

export const checkOrderReadiness = async (orderId) => {
	const order = await prisma.order.findUnique({
		where: { id: orderId },
		include: { products: true },
	});

	const allProductsReady = order.products.every(
		(product) => product.readyToShip
	);

	console.log(allProductsReady, "status of all products");
	if (allProductsReady) {
		// All products are ready, update the delivery status of the order
		await prisma.order.update({
			where: { id: orderId },
			data: { deliveryStatus: "READY" },
		});
	}
};
