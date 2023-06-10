import prisma from "../../../../../lib/prisma";
import { userRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);

	const { uid } = req.query;

	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}

	const existingStartup = await prisma.entrepreneur.findUnique({
		where: {
			userId: uid,
		},
	});

	try {
		if (req.method === "POST") {
			const {
				name,
				email,
				description,
				location,
				website,
				panNumber,
				gstNumber,
				businessType,
				businessCategory,
				subCategory,
			} = req.body;

			if (existingStartup?.startupId) {
				// put request
				const updatedStartup = await prisma.startup.update({
					where: {
						id: existingStartup.startupId,
					},
					data: {
						name,
						email,
						description,
						location: {
							street1: location.street1,
							street2: location.street2,
							city: location.city,
							state: location.state,
							postalCode: location.postalCode,
							country: location.country,
						},
						website,
						panNumber,
						gstNumber,
						businessType: businessType,
						businessCategory: businessCategory,
						businessSubCategory: subCategory,
					},
				});

				return res.json(updatedStartup);
			} else {
				const startup = await prisma.startup.create({
					data: {
						name,
						description,
						location: {
							street1: location.street1,
							street2: location.street2,
							city: location.city,
							state: location.state,
							postalCode: location.postalCode,
							country: location.country,
						},
						email,
						website,
						panNumber,
						gstNumber,
						businessType: businessType,
						businessCategory: businessCategory,
						businessSubCategory: subCategory,
						entrepreneur: {
							create: {
								user: {
									connect: {
										id: uid,
									},
								},
							},
						},
					},
					include: {
						entrepreneur: {
							include: {
								user: true,
							},
						},
					},
				});

				// make a linked account
				const linkedAccount = await fetch(
					"https://api.razorpay.com/v2/accounts",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Basic ${Buffer.from(
								`${process.env.KEY_ID}:${process.env.KEY_SECRET}`
							).toString("base64")}`,
						},
						body: JSON.stringify({
							email,
							phone: startup.entrepreneur.user.phoneNumber,
							type: "route",
							legal_business_name: name,
							business_type: businessType,
							contact_name: startup.entrepreneur.user.name,
							profile: {
								category: businessCategory,
								subcategory: subCategory,
								addresses: {
									registered: {
										street1: location.street1,
										street2: location.street2,
										city: location.city,
										state: location.state,
										postal_code: location.postalCode,
										country: location.country,
									},
								},
							},
							legal_info: {
								pan: panNumber,
								gst: gstNumber,
							},
						}),
					}
				).then((res) => res.json());

				if (linkedAccount.error) {
					throw new Error(linkedAccount.error.description);
				} else {
					await prisma.startup.update({
						where: {
							id: startup.id,
						},
						data: {
							linkedAccountId: linkedAccount.id,
						},
					});

					await prisma.user.update({
						where: {
							id: uid,
						},
						data: {
							role: {
								push: userRole.ENTREPRENEUR,
							},
						},
					});
				}

				return res.json(startup);
			}
		} else if (req.method === "DELETE") {
			const { investor } = req.query;

			const deletedStartup = await prisma.startup.delete({
				where: {
					id: existingStartup.startupId,
				},
			});

			await prisma.user.update({
				where: {
					id: uid,
				},
				data: {
					role: {
						set:
							investor === "true"
								? [userRole.USER, userRole.INVESTOR]
								: [userRole.USER],
					},
				},
			});
			return res.json(deletedStartup);
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
