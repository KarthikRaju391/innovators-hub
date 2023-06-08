import prisma from "../lib/prisma";

export function makeSerializable(obj) {
	return JSON.parse(JSON.stringify(obj));
}

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export async function getValidAccessToken(accessTokenId) {
	// Fetch the access token from the database using Prisma
	const storedToken = await prisma.accessToken.findUnique({
		where: { id: accessTokenId },
	});

	// If the stored token is still valid, return it
	if (Date.now() < storedToken.expiresIn * 1000) {
		return storedToken.token;
	}

	// If the stored token has expired, refresh it
	const refreshedData = await refreshAccessToken(storedToken.refreshToken);

	// Update the access token, refresh token, and expiration time in the database
	await prisma.accessToken.update({
		where: { id: accessTokenId },
		data: {
			token: refreshedData.access_token,
			refreshToken: refreshedData.refresh_token,
			expiresIn: Date.now() + refreshedData.expires_in * 1000,
		},
	});

	// Return the new access token
	return refreshedData.access_token;
}

async function refreshAccessToken(refresh_token) {
  const response = await fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  return await response.json();
}
