export default async (req, res) => {
	if (req.method === "GET") {
		// const { code } = req.query;
		// console.log(req.query)
		try {
			const response = await fetch("https://zoom.us/oauth/token", {
				method: "POST",
				headers: {
					Authorization: `Basic ${Buffer.from(
						`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
					).toString("base64")}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					grant_type: "authorization_code",
					// code,
					redirect_uri: process.env.REDIRECT_URI,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error ${response.status}`);
			}

			const data = await response.json();
			const { access_token: accessToken } = data;

			// Store the access token securely, e.g., in a session or a cookie
			// Then, redirect the user to the /scheduleMeeting page
			return res.json({ accessToken });
		} catch (error) {
			console.error("Error obtaining access token:", error.message);
			res.status(500).json({ message: "Error obtaining access token" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
};
