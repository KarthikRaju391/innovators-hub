import prisma from "../../../../lib/prisma";
// import { userRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);

	const { uid } = req.query;

	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}
	try {
		if (req.method === "GET") {
			const user = await prisma.user.findUnique({
				where: {
					id: uid,
				},
				include: {
					entrepreneur: {
						include: {
							startup: true,
						},
					},
					investor: true,
				},
			});
			return res.json(user);
		} else if (req.method === "PUT") {
			const data = req.body;
			const updateUser = await prisma.user.update({
				where: {
					id: uid,
				},
				data: {
					name: data.name,
					bio: data.bio,
					phoneNumber: data.phoneNumber,
					address: {
						street1: data.address.street1,
						street2: data.address.street2,
						city: data.address.city,
						state: data.address.state,
						postalCode: data.address.postalCode,
						country: data.address.country,
					},
					gender: data.gender[0].id,
				},
			});

			return res.json(updateUser);
		} else {
			return res.status(405).end();
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
