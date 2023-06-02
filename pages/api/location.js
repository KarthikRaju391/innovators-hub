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
			const validJSONString = req.body.replace(/'/g, '"');
			const jsonData = JSON.parse(validJSONString);

			const { lat, long, sp, id } = jsonData;

			const location = await prisma.location.create({
				data: {
					deviceId: id,
					speed: parseFloat(sp),
					latitude: parseFloat(lat),
					longitude: parseFloat(long),
				},
			});
			return res.json({ location });
		}
	} catch (err) {
		console.log(err);
	}
}
