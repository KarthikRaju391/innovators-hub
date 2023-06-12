import prisma from "./prisma";

export function makeSerializable(obj) {
	return JSON.parse(JSON.stringify(obj));
}

export async function getValidAccessToken(accessTokenId) {
	// Fetch the access token from the database using Prisma
	const storedToken = await prisma.accessToken.findUnique({
		where: { id: accessTokenId },
	});

	// If the stored token is still valid, return it
	// check if the stored token is expired or not. Zoom token expires in 1 hour
	if (Date.now() < Number(storedToken.expiresIn) + 60000) {
		console.log("Using stored access token");
		return storedToken.accessToken;
	}

	// If the stored token has expired, refresh it
	const refreshedData = await refreshAccessToken(storedToken.refreshToken);

	// Update the access token, refresh token, and expiration time in the database
	await prisma.accessToken.update({
		where: { id: accessTokenId },
		data: {
			accessToken: refreshedData.access_token,
			refreshToken: refreshedData.refresh_token,
			expiresIn: Date.now() + refreshedData.expires_in * 1000,
		},
	});

	// Return the new access token
	return refreshedData.access_token;
}

async function refreshAccessToken(refresh_token) {
	console.log("Refreshing access token");
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

export async function updateCartInDatabase(cartData) {
	try {
		const res = await fetch(`/api/cart/${cartData.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ cartData }),
		});

		if (res.ok) {
			console.log("Cart updated successfully");
		} else {
			console.error("Failed to update cart");
		}
	} catch (error) {
		console.error("Error updating cart:", error);
	}
}
