import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
	// const session = await getServerSession(req, res, authOptions);

	const { pid } = req.query;

	// if (!session) {
	// 	res.status(401).json({ error: "Not authenticated" });
	// 	return;
	// }
	try {
		if (req.method === "GET") {
			const product = await prisma.product.findUnique({
				where: {
					id: pid,
				},
				include: {
					category: true,
					startup: true,
				},
			});
			return res.json(product);
		} else if (req.method === "PUT") {
			console.log(req.body);
			const { category, ...rest } = req.body;

			// Fetch or create categories by name
			const updatedCategories = await Promise.all(
				category.map(async (cat) => {
					const existingCategory = await prisma.category.findUnique({
						where: {
							name: cat.name,
						},
					});
					if (existingCategory) {
						return { id: existingCategory.id };
					} else {
						const newCategory = await prisma.category.create({
							data: {
								name: cat.name,
							},
						});
						return { id: newCategory.id };
					}
				})
			);

			const product = await prisma.product.update({
				where: {
					id: pid,
				},
				data: {
					name: rest.productName,
					description: rest.productDescription,
					price: rest.price,
					category: {
						connect: updatedCategories,
					},
					image: rest.image,
				},
			});

			return res.json(product);
		} else if (req.method === "DELETE") {
			const product = await prisma.product.delete({
				where: {
					id: pid,
				},
			});
			return res.json(product);
		} else {
			return res.status(405).end();
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
