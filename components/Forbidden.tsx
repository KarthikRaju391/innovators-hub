import Image from "next/image";
import Link from "next/link";
import BackButton from "./BackButton";
import { useRouter } from "next/router";

function Forbidden() {

	const router = useRouter()

	// setTimeout(()=>{router.push("/")},2000)

	return (
		<>
			<BackButton />
			<Image
				className="mx-auto"
				width={500}
				height={80}
				src={"/Forbidden.svg"}
				alt="Forbidden"
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
					onClick={() => router.push('/login')}
					style={{ fontFamily: "Syncopate" }}
				>
					Login
				</p>
			</div>
		</>
	);
}

export default Forbidden;
