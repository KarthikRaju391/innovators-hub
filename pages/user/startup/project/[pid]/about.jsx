import BackButton from "../../../../../components/BackButton";
import Loading from "../../../../../components/Loading";
import LoginHeader from "../../../../../components/LoginHeader";
import useSWR from "swr";
import { fetcher } from "../../../../../lib/fetcher";
import PDFPreview from "../../../../../components/PDFPreview";
import { useRouter } from "next/router";

function about() {
	const router = useRouter();

	const { pid } = router.query;
	const { data: project, isLoading } = useSWR(`/api/invest/${pid}`, fetcher);

	// var backers = [
	// 	{ name: "Karthik", amount: 2000 },
	// 	{ name: "Harsha", amount: 1000 },
	// 	{ name: "Ram", amount: 2000 },
	// ];

	if (isLoading) return <Loading />;

	var tblContent = project.venture?.map((e, i) => (
		<tr key={i} className="row animate__animated animate__fadeInUp">
			{" "}
			<td className="col">{e.investor.user.name}</td>{" "}
			<td className="col">{e.amountInvested}</td>{" "}
			<td className="col">
				{new Date(e.createdAt).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "2-digit",
				})}
			</td>
		</tr>
	));

	return (
		<>
			<LoginHeader />
			<BackButton />
			<p className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				About Project
			</p>

			<div className="flex flex-wrap justify-around gap-4 mb-[1rem] pb-[1rem]">
				<div>
					<div>
						<p className="select-none mt-[1rem] pt-[1rem] text-2xl cursor-default text-center">
							{" "}
							Project Details{" "}
						</p>
						<div className="text-justify mt-4 border-black border-2 cursor-pointer p-4 rounded-md">
							<h1
								onClick={() =>
									router.push(`/user/investments/invest/${project.id}`)
								}
								className="text-xl font-semibold hover:opacity-70"
							>
								{project.name}
							</h1>
							<p
								className="select-none text-md opacity-70 hover:opacity-100 animate__animated animate__fadeInUp cursor-pointer"
								onClick={() =>
									router.push(`/user/startup/${project.startup.id}`)
								}
							>
								By {project.startup.name}
							</p>
							<p className="text-md mt-2">{project.description}</p>
						</div>
						{/* add more */}
					</div>
					<br /> <br />
					<div>
						<h2 className="select-none mt-[1rem] pt-[1rem] text-2xl text-center">
							Recent Posts From {project.startup.name}
						</h2>
						{project.startup.posts && project.startup.posts.length > 0 ? (
							<ul className=" p-3 rounded-md">
								{project.startup.posts.slice(0, 3).map((post) => (
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
					<br /> <br />
					<div>
						<p className="mt-5 cursor-default text-center text-lg underline">
							List of backers
						</p>

						{project.venture.length > 0 ? (
							<div className="mx-4 overflow-x-auto">
								<table className="mx-auto mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
									<thead>
										<tr className="animate__animated animate__fadeInUp">
											<th>Name</th>
											<th>Amount</th>
											<th>Date Invested</th>
										</tr>
									</thead>
									<tbody>{tblContent}</tbody>
								</table>
							</div>
						) : (
							<p className="mt-2 cursor-default text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
								No Backers Yet
							</p>
						)}
					</div>
				</div>

				<PDFPreview data={project.projectReport} />
			</div>
		</>
	);
}

export default about;
