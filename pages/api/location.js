import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(req, res) {
	try {
		if (req.method === "POST") {
			const validJSONString = req.body.replace(/'/g, '"');
			const jsonData = JSON.parse(validJSONString);

			const { lat, long, sp, id } = jsonData;

			if (
				lat === "0" ||
				lat === "0.00" ||
				long === "0" ||
				long === "0.00" ||
				sp === "0" ||
				sp === "0.00"
			) {
				return res.status(400).json({ error: "Missing required fields" });
			}

			const existingLocation = await prisma.location.findFirst({
				where: {
					deviceId: id,
				},
			});

			if (existingLocation) {
				const location = await prisma.location.update({
					where: {
						id: existingLocation.id,
					},
					data: {
						speed: parseFloat(sp),
						latitude: parseFloat(lat),
						longitude: parseFloat(long),
					},
				});
				return res.json({ location });
			}

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
