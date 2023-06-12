import prisma from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}

	const { tnxId } = req.query;

	if (req.method === "GET") {
		const venture = await prisma.transaction.findUnique({
			where: {
				id: tnxId,
			},
			include: {
				venture: {
					include: {
						project: {
							include: {
								startup: {
									include: {
										entrepreneur: {
											include: {
												user: true,
											},
										},
									},
								},
							},
						},
						investor: {
							include: {
								user: true,
							},
						},
					},
				},
			},
		});

		return res.json(venture);
	}
}
