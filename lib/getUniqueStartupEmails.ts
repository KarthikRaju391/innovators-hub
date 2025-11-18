export function getUniqueEmailsForOrder(order) {
	const emails = new Set();

	order.products.forEach((product) => {
		const email = product.startup.email;
		emails.add(email);
	});

	return Array.from(emails);
}
