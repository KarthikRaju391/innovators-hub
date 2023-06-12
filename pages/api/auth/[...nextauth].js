import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";

export const authOptions = {
	callbacks: {
		async session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
				session.user.name = user.name;
				session.user.email = user.email;
				session.user.contact = user.phoneNumber;
				session.user.role = user.role;
				session.user.address = user.address;

				if (user.role.includes("INVESTOR")) {
					const investor = await prisma.investor.findUnique({
						where: {
							userId: user.id,
						},
						include: {
							venture: true,
						},
					});
					session.user.investorId = investor.id;
				}

				if (user.role.includes("ENTREPRENEUR")) {
					const startup = await prisma.user.findUnique({
						where: {
							id: user.id,
						},
						include: {
							entrepreneur: {
								include: {
									startup: true,
								},
							},
						},
					});
					if (startup) {
						session.user.entrepreneurId = startup.entrepreneur.id;
						session.user.startupId = startup.entrepreneur.startup.id;
					}
				}
			}
			return session;
		},
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	secret: process.env.NEXT_PUBLIC_SECRET,
	adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
