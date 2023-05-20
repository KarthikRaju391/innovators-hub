import prisma from "../../../lib/prisma";
import { userRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);

	console.log(session);
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
				},
			});
			return res.json(user);
		} else if (req.method === "PUT") {
			const data = req.body;
			const updatedRole = data.type;
			const prevRole = session.user.role.slice(1);

			console.log(updatedRole, prevRole);

			if (updatedRole[0] && updatedRole[1] && prevRole.length === 0) {
				const updatedUser = await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						name: data.name,
						bio: data.bio,
						phoneNumber: data.phoneNumber,
						address: data.address,
						gender: data.gender[0].id,
						panNumber: data.ppanNumber,
						role: {
							set: [userRole.USER, userRole.INVESTOR, userRole.ENTREPRENEUR],
						},
						entrepreneur: {
							connectOrCreate: {
								create: {
									startup: {
										connectOrCreate: {
											create: {
												name: data.startupName,
												location: data.startupAddress,
												panNumber: data.startupPanNumber,
												gstNumber: data.gstin,
											},
											where: {
												panNumber: data.startupPanNumber,
											},
										},
									},
								},
								where: {
									userId: uid,
								},
							},
						},
					},
					include: {
						entrepreneur: true,
					},
				});
				return res.json(updatedUser);
			} else if (prevRole.length === 2 && !updatedRole[0] && !updatedRole[1]) {
				const updatedUser = await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						name: data.name,
						bio: data.bio,
						phoneNumber: data.phoneNumber,
						role: {
							set: [userRole.USER],
						},
						panNumber: null,
						gender: data.gender[0].id,
						entrepreneur: {
							delete: true,
						},
					},
				});
				return res.json(updatedUser);
			} else if (prevRole.length === 2 && !updatedRole[0] && updatedRole[1]) {
				const updatedUser = await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						name: data.name,
						bio: data.bio,
						phoneNumber: data.phoneNumber,
						gender: data.gender[0].id,
						panNumber: null,
						role: {
							set: [userRole.USER, userRole.ENTREPRENEUR],
						},
					},
				});
				return res.json(updatedUser);
			} else if (prevRole.length === 2 && updatedRole[0] && !updatedRole[1]) {
				const updatedUser = await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						name: data.name,
						bio: data.bio,
						phoneNumber: data.phoneNumber,
						gender: data.gender[0].id,
						panNumber: data.ppanNumber,
						role: {
							set: [userRole.USER, userRole.INVESTOR],
						},
						entrepreneur: {
							delete: true,
						},
					},
				});
				return res.json(updatedUser);
			} else if (
				prevRole.length === 1 &&
				prevRole[0] === "INVESTOR" &&
				updatedRole[1]
			) {
				// add entrepreneur to the role
				const updatedUser = await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						name: data.name,
						bio: data.bio,
						phoneNumber: data.phoneNumber,
						role: {
							set: [userRole.USER, userRole.INVESTOR, userRole.ENTREPRENEUR],
						},
						email: session.user.email,
						panNumber: data.ppanNumber,
						gender: data.gender[0].id,
						entrepreneur: {
							connectOrCreate: {
								create: {
									startup: {
										connectOrCreate: {
											create: {
												name: data.startupName,
												location: data.startupAddress,
												panNumber: data.startupPanNumber,
												gstNumber: data.gstin,
											},
											where: {
												panNumber: data.startupPanNumber,
											},
										},
									},
								},
								where: {
									userId: uid,
								},
							},
						},
					},
				});
				return res.json(updatedUser);
			} else if (
				prevRole.length === 1 &&
				prevRole[0] === "ENTREPRENEUR" &&
				updatedRole[0]
			) {
				// add investor to the role
				const updatedUser = await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						name: data.name,
						bio: data.bio,
						phoneNumber: data.phoneNumber,
						role: {
							set: [userRole.USER, userRole.INVESTOR, userRole.ENTREPRENEUR],
						},
						panNumber: data.ppanNumber,
						gender: data.gender[0].id,
					},
				});
				return res.json(updatedUser);
			} else if (prevRole.length === 0 && updatedRole[0]) {
				// add investor to the role
				const updatedUser = await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						name: data.name,
						bio: data.bio,
						phoneNumber: data.phoneNumber,
						role: {
							set: [userRole.USER, userRole.INVESTOR],
						},
						panNumber: data.ppanNumber,
						gender: data.gender[0].id,
					},
				});
				return res.json(updatedUser);
			} else if (prevRole.length === 0 && updatedRole[1]) {
				// add entrepreneur to the role
				const updatedUser = await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						name: data.name,
						bio: data.bio,
						phoneNumber: data.phoneNumber,
						role: {
							set: [userRole.USER, userRole.ENTREPRENEUR],
						},
						email: session.user.email,
						panNumber: data.ppanNumber,
						gender: data.gender[0].id,
						entrepreneur: {
							connectOrCreate: {
								create: {
									startup: {
										connectOrCreate: {
											create: {
												name: data.startupName,
												location: data.startupAddress,
												panNumber: data.startupPanNumber,
												gstNumber: data.gstin,
											},
											where: {
												panNumber: data.startupPanNumber,
											},
										},
									},
								},
								where: {
									userId: uid,
								},
							},
						},
					},
				});
				return res.json(updatedUser);
			} else if (
				prevRole.length === 1 &&
				prevRole[0] === "INVESTOR" &&
				!updatedRole[0]
			) {
				// remove investor from the role
				const updatedUser = await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						name: data.name,
						bio: data.bio,
						phoneNumber: data.phoneNumber,
						role: {
							set: [userRole.USER],
						},
						panNumber: null,
						gender: data.gender[0].id,
					},
				});
				return res.json(updatedUser);
			} else if (
				prevRole.length === 1 &&
				prevRole[0] === "ENTREPRENEUR" &&
				!updatedRole[1]
			) {
				// remove entrepreneur from the role
				const updatedUser = await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						name: data.name,
						bio: data.bio,
						phoneNumber: data.phoneNumber,
						gender: data.gender[0].id,
						role: {
							set: [userRole.USER],
						},
						entrepreneur: {
							delete: true,
						},
					},
				});
				return res.json(updatedUser);
			} else {
				const startup = await prisma.user.findUnique({
					where: {
						id: uid,
					},
					include: {
						entrepreneur: {
							include: {
								startup: true,
							},
						},
					},
				});

				const updatedUser = await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						name: data.name,
						bio: data.bio,
						address: data.address,
						gender: data.gender[0].id,
						panNumber: data.ppanNumber,
						entrepreneur: {
							update: {
								startup: {
									update: {
										name: data.startupName,
										location: data.startupAddress,
										panNumber: data.startupPanNumber,
										gstNumber: data.gstin,
									},
								},
							},
						},
					},
				});
				return res.json(updatedUser);
			}
		} else {
			return res.status(405).end();
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
