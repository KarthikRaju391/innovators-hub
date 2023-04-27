import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "50mb",
		},
	},
};

export default async function handle(req, res) {
	try {
		if (req.method === "GET") {
			const { cursor } = req.query;

			const take = 1;

			const where = cursor
				? { createdAt: { lt: new Date(parseInt(cursor)) } }
				: {};

			const products = await prisma.product.findMany({
				take,
				where,
				orderBy: { id: "desc" },
				include: {
					category: true,
					startup: true,
				},
			});

			const nextCursor =
				products.length > 0
					? products[products.length - 1].createdAt.getTime()
					: null;

			return res.json({ products, cursor: nextCursor });
		} else if (req.method === "POST") {
			const session = await getServerSession(req, res, authOptions);

			if (!session) {
				res.status(401).json({ error: "Not authenticated" });
				return;
			}
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
