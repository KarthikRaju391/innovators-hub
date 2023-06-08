export default async function handler(req, res) {
	const { code } = req.query;

	if (!code) {
		res.status(400).json({ error: "Authorization code is missing" });
		return;
	}

	try {
		const response = await fetch("https://zoom.us/oauth/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${Buffer.from(
					`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
				).toString("base64")}`,
			},
			body: new URLSearchParams({
				grant_type: "authorization_code",
				code,
				redirect_uri: process.env.REDIRECT_URI,
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to obtain access token");
		}

		const data = await response.json();
		const { access_token, refresh_token } = data;

		// Save access_token and refresh_token to your database or session.
		// Redirect the user to a protected page or send a success response.

		res.status(200).json({ access_token, refresh_token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
