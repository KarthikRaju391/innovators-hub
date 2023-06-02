import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(req, res) {
	// const session = await getServerSession(req, res, authOptions);

	// if(!session) {
	//     res.status(401).json({ error: "Not authenticated" });
	//     return;
	// }
	// fetch ('/api/location', {
	//     method: 'POST',
	//     headers: {
	//         'Content-Type': 'application/json'
	//     },
	//     body: JSON.stringify({
	//         latitude: latitude,
	//         longitude: longitude
	//     })
	// })

	try {
		if (req.method === "POST") {
			const { lat, long, sp, id } = req.body;

			const location = await prisma.location.create({
				data: {
					deviceId: id,
					speed: sp,
					latitude: lat,
					longitude: long,
				},
			});
			return res.json(location);
		}
	} catch (err) {
		console.log(err);
	}
}
