import prisma from "../../../lib/prisma";
import { getValidAccessToken } from "../../../lib/util";

export default async (req, res) => {
	const accessTokenId = await prisma.accessToken.findFirst({
		select: {
			id: true,
		},
	});

	if (!accessTokenId) {
		return res.json({ validAccessToken: false });
	}
	const validAccessToken = await getValidAccessToken(accessTokenId.id);

	return res.json({ validAccessToken });
};
