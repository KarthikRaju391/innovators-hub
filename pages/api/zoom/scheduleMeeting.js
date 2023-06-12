import prisma from "../../../lib/prisma";

export default async (req, res) => {
	const project = await prisma.project.findUnique({
		where: {
			id: req.body.projectId,
		},
		include: {
			startup: {
				include: {
					entrepreneur: {
						include: {
							user: {
								select: {
									email: true,
								},
							},
						},
					},
				},
			},
		},
	});
	

	if (req.method === "POST") {
		const { investorId, meetingTime, projectId, accessToken } = req.body;

		// Get the access token from the session or a secure storage
		// const accessTokenId = await prisma.accessToken.findFirst({
		// 	select: {
		// 		id: true,
		// 	},
		// });

		// const validAccessToken = await getValidAccessToken(accessTokenId.id);

		try {
			const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					topic: "Meeting with Startup",
					type: 2, // Scheduled Meeting
					start_time: meetingTime,
					duration: 60,
					timezone: "IST",
					settings: {
						approval_type: 2, // Automatically Approve
						// alternative_hosts: `${investorEmail}; ${project.startup.entrepreneur.user.email}`,
						join_before_host: true,
						waiting_room: false, // Disable waiting room
						audio: "both", // Telephony and VoIP
						auto_recording: "none", // No recording
					},
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error ${response.status} `);
			}

			const data = await response.json();
			const meetingLink = data.join_url;
			// Send the meeting link via email to the respective users
			// ...

			await prisma.meeting.create({
				data: {
					topic: "Meeting with Startup",
					meetingLink: meetingLink,
					meetingTime: meetingTime,
					meetingDuration: 60,
					project: {
						connect: {
							id: projectId,
						},
					},
					investor: {
						connect: {
							id: investorId,
						},
					},
					entrepreneur: {
						connect: {
							id: project.startup.entrepreneur.id,
						},
					},
				},
			});
			res
				.status(200)
				.json({ message: "Meeting scheduled successfully: " + meetingLink });
		} catch (error) {
			console.log(error);
			console.error("Error scheduling meeting:", error.message);
			res.status(500).json({ message: "Error scheduling meeting" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
};
