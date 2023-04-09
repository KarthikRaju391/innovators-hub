import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}
	try {
		if (req.method === "GET") {
			const products = await prisma.product.findMany({
				include: {
					category: true,
				},
			});
			return res.json(products);
		} else if (req.method === "POST") {
			const startup = await prisma.entrepreneur.findUnique({
				where: {
					userId: session.user.id,
				},
				select: {
					startupId: true,
				},
			});

			const {
				productName,
				productDescription,
				productBuild,
				quality,
				price,
				category,
				images,
			} = req.body;
			const productImages = images.filter((image) => {
				if (image) {
					return image;
				}
			});
			// console.log(productImages);
			const productPrice = Number(price);
			const product = await prisma.product.create({
				data: {
					name: productName,
					description: productDescription,
					price: productPrice,
					image: {
						set: productImages,
					},
					category: {
						connectOrCreate: {
							where: {
								name: category,
							},
							create: {
								name: category,
							},
						},
					},
					startup: {
						connect: {
							id: startup.startupId,
						},
					},
				},
				include: {
					category: true,
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
