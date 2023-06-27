import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]";

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}

	let meetings;

	if (req.method === "GET") {
		if (session.user.investorId && session.user.entrepreneurId) {
			meetings = await prisma.meeting.findMany({
				where: {
					OR: [
						{
							investorId: session.user.investorId,
						},
						{
							entrepreneurId: session.user.entrepreneurId,
						},
					],
					meetingTime: {
						gte: new Date(),
					},
				},
				include: {
					project: {
						include: {
							startup: {
								select: {
									name: true,
								},
							},
						},
					},
					entrepreneur: {
						include: {
							user: {
								select: {
									name: true,
								},
							},
						},
					},
					investor: {
						include: {
							user: {
								select: {
									name: true,
								},
							},
						},
					},
				},
			});
		} else if (session.user.investorId) {
			meetings = await prisma.meeting.findMany({
				where: {
					investorId: session.user.investorId,
					meetingTime: {
						gte: new Date(),
					},
				},
				include: {
					project: {
						include: {
							startup: {
								select: {
									name: true,
								},
							},
						},
					},
					entrepreneur: {
						include: {
							user: {
								select: {
									name: true,
								},
							},
						},
					},
					investor: {
						include: {
							user: {
								select: {
									name: true,
								},
							},
						},
					},
				},
			});
		} else {
			meetings = await prisma.meeting.findMany({
				where: {
					entrepreneurId: session.user.entrepreneurId,
					meetingTime: {
						gt: new Date(),
					},
				},
				include: {
					project: {
						include: {
							startup: {
								select: {
									name: true,
								},
							},
						},
					},
					entrepreneur: {
						include: {
							user: {
								select: {
									name: true,
								},
							},
						},
					},
					investor: {
						include: {
							user: {
								select: {
									name: true,
								},
							},
						},
					},
				},
			});
		}

		res.json(meetings);
	}
}
