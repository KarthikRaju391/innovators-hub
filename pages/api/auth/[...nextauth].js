import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";

export const authOptions = {
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
				session.user.name = user.name;
				session.user.email = user.email;
				session.user.contact = user.phoneNumber;
				session.user.role = user.role;
				session.user.address = user.address;
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
