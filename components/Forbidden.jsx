import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import BackButton from "./BackButton";

function Forbidden() {
	return (
		<>
			<BackButton />
			<Image
				className="mx-auto"
				width={500}
				height={80}
				src={"/Forbidden.svg"}
			/>
			<div className="flex justify-center">
				<Link
					href="/"
					className="select-none border-r mr-2 pr-2 text-xl"
					style={{ fontFamily: "Syncopate" }}
				>
					Go To Home Page
				</Link>
				<p
					className="cursor-pointer select-none text-xl"
					onClick={() => signIn()}
					style={{ fontFamily: "Syncopate" }}
				>
					Login
				</p>
			</div>
		</>
	);
}

export default Forbidden;
