export default function handler(req, res) {
	const clientId = process.env.ZOOM_CLIENT_ID;
	const redirectUri = encodeURIComponent(process.env.REDIRECT_URI);
	const responseType = "code";
	const state = req.query.path || "/";

	const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

	res.redirect(zoomAuthUrl);
}
