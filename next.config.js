/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	images: {
		formats: ["image/avif", "image/webp"],
		domains: ["firebasestorage.googleapis.com"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
				port: "",
				pathname: "/*",
			},
		],
	},
	experimental: {
		esmExternals: false,
	},
};
