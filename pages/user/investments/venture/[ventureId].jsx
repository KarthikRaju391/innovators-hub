import { useRouter } from "next/router";
import BackButton from "../../../../components/BackButton";
import PDFPreview from "../../../../components/PDFPreview";
import LoginHeader from "../../../../components/LoginHeader";
import { makeSerializable } from "../../../../lib/util";
import { BiCopy } from "react-icons/bi";
import { usePageLoading } from "../../../../lib/usePageLoading";
import Loading from "../../../../components/Loading";

export default function Venture({ venture }) {
	const router = useRouter();
	const { isPageLoading } = usePageLoading();
	//get data regarding the project & set them accordingly in the `var initial` at Line10

	const handleCopyTransactionId = (id) => {
		navigator.clipboard.writeText(id);
		alert("Copied transaction Id to clipboard");
	};

	const handleCopyEmailAddress = (email) => {
		navigator.clipboard.writeText(email);
		alert("Copied email address to clipboard");
	};

	if (isPageLoading) return <Loading />;

	return (
		<>
			<BackButton />
			<LoginHeader />
			<p className="select-none flex my-[.5rem] py-[.5rem] text-3xl cursor-default justify-center gap-4">
				{venture.project.name}{" "}
			</p>

			<div className="flex flex-wrap justify-around gap-4 mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
				<div>
					<div>
						<p className="select-none mt-[1rem] pt-[1rem] text-2xl cursor-default text-center">
							{" "}
							Project Details{" "}
						</p>
						<div className="text-justify mt-4 border-black border-2 cursor-pointer p-4 rounded-md">
							<h1
								onClick={() =>
									router.push(`/user/investments/invest/${venture.project.id}`)
								}
								className="text-xl font-semibold hover:opacity-70"
							>
								{venture.project.name}
							</h1>
							<p
								className="select-none text-md opacity-70 hover:opacity-100 animate__animated animate__fadeInUp cursor-pointer"
								onClick={() =>
									router.push(`/user/startup/${venture.project.startup.id}`)
								}
							>
								By {venture.project.startup.name}
							</p>
							<p className="select-none mt-6 text-lg animate__animated animate__fadeInUp">
								Contributed{" "}
								<span className="font-semibold">
									₹ {venture.amountInvested}
								</span>{" "}
								on{" "}
								<span className="font-semibold">
									{new Date(venture.createdAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							</p>
							{/* <p className="text-md">
								Transaction Id: <span className="text-xs">{venture.transaction.id}</span>
							</p> */}
							<div className="flex justify-between items-end">
								<p
									onClick={() =>
										handleCopyEmailAddress(venture.project.startup.email)
									}
									className="select-none mt-4 text-xs hover:font-semibold transition-all animate__animated animate__fadeInUp"
								>
									{venture.project.startup.email}
								</p>
								<p
									className="hover:scale-125 transition-all"
									onClick={() =>
										handleCopyTransactionId(venture.transaction.id)
									}
								>
									<BiCopy />
								</p>
							</div>
						</div>
						{/* add more */}
					</div>
					<br /> <br />
					<div>
						<h2 className="select-none mt-[1rem] pt-[1rem] text-2xl text-center">
							Recent Updates From {venture.project.startup.name}
						</h2>
						{venture.project.startup.posts &&
						venture.project.startup.posts.length > 0 ? (
							<ul className=" p-3 rounded-md">
								{venture.project.startup.posts.slice(0, 3).map((post) => (
									<li
										className="cursor-pointer"
										onClick={() => router.push(`/posts/${post.permalink}`)}
										key={post?.id}
									>
										<h3 className="text-lg font-semibold">{post?.title}</h3>
										<p>{post?.body}</p>
										<hr />
									</li>
								))}
							</ul>
						) : (
							<p className="select-none text-xs mt-[1rem] pt-[1rem] text-center">
								No Updates Yet
							</p>
						)}
					</div>
				</div>

				<PDFPreview data={venture.project.projectReport} />
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const ventures = await fetch(
		`${process.env.NEXT_APP_URL}/api/venture/${context.query.ventureId}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: context.req.headers.cookie,
			},
		}
	);
	const venturesData = await ventures.json();
	return {
		props: {
			venture: makeSerializable(venturesData),
		},
	};
}
