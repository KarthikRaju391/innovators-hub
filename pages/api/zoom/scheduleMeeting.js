export default async (req, res) => {
	if (req.method === "POST") {
		// Get the access token from the session or a secure storage
		const accessToken =
			"eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjMxYzJlZmZiLTBmM2UtNDIyYS1hMWU5LWU3ZjRkZmVjOTY0MiJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJVU1dWV2RzOVFNaV9YM0dsVUxBVGZ3IiwidmVyIjo5LCJhdWlkIjoiNjE1YjQxNjNlMGFhOWFmM2VhMGUzOTg3MjA5MDBiMzgiLCJuYmYiOjE2ODYxNTAwMjYsImlzcyI6InptOmNpZDpoMEZpSUwxdlRGcUNHNE8yNDRReWciLCJnbm8iOjAsImV4cCI6MTY4NjE1MzYyNiwidHlwZSI6MiwiaWF0IjoxNjg2MTUwMDI2fQ.R-uwszkEVV2t-CjsKmoW2mObI-8cDmLApywIDQ1ndYZ6KW1nBCm2aS0yTk_1o1A7hvQBFrNvDJ0L76tcOCOQqg";

		try {
			const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					topic: "Sample Meeting",
					type: 2, // Scheduled Meeting
					start_time: new Date().toISOString(),
					duration: 30,
					timezone: "IST",
					settings: {
						approval_type: 2, // Automatically Approve
						join_before_host: true,
						waiting_room: false, // Disable waiting room
						audio: "both", // Telephony and VoIP
						auto_recording: "none", // No recording
					},
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error ${response.status}`);
			}

			const data = await response.json();
			const meetingLink = data.join_url;

			// Send the meeting link via email to the respective users
			// ...

			res
				.status(200)
				.json({ message: "Meeting scheduled successfully", meetingLink });
		} catch (error) {
			console.log(error);
			console.error("Error scheduling meeting:", error.message);
			res.status(500).json({ message: "Error scheduling meeting" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
};
