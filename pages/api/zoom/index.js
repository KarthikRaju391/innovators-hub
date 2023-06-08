const KJUR = require("jsrsasign");

export default async function handle(req, res) {
	const iat = Math.round(new Date().getTime() / 1000) - 30;
	const exp = iat + 60 * 60 * 2;
	const oHeader = { alg: "HS256", typ: "JWT" };

	const oPayload = {
		sdkKey: process.env.ZOOM_CLIENT_ID,
		mn: req.body.meetingNumber,
		role: req.body.role,
		iat: iat,
		exp: exp,
	};

	const sHeader = JSON.stringify(oHeader);
	const sPayload = JSON.stringify(oPayload);

	const meetingSignature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, process.env.ZOOM_CLIENT_SECRET);

    return res.json({
        signature: meetingSignature,
        sdkKey: process.env.ZOOM_CLIENT_ID,
    })
}
