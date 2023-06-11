import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import Card from "../../../../components/Card";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]";
import { makeSerializable } from "../../../../lib/util";

function investmenthistory({ projects }) {
	const initial = [
		{
			projectName: "Project Name",
			projectId: "5",
			startupName: "Startup Name",
		},
		{ projectName: "DEF", projectId: "6", startupName: "DEF" },
		{ projectName: "EF", projectId: "7", startupName: "EF" },
		{ projectName: "DF", projectId: "8", startupName: "DF" },
		{ projectName: "DE", projectId: "9", startupName: "DE" },
		{ projectName: "10", projectId: "10", startupName: "10" },
	];

	return (
		<>
			<BackButton />
			<LoginHeader />
			<div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
				<p className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">
					Venture
				</p>
				<div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2">
					{projects.map((i) => (
						<Card
							head={i.name || "-"}
							key={i.id}
							para={i.startup.name || "-"}
							url={`/user/investments/venture/${i.projectId}`}
						/>
					))}
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions);
	if (!session) {
		return {
			redirect: {
				destination: "/user/login",
				permanent: false,
			},
		};
	}

	const res = await fetch(`${process.env.NEXT_APP_URL}/api/project`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Cookie: context.req.headers.cookie,
		},
	});

	const projects = await res.json();

	return {
		props: {
			projects: makeSerializable(projects),
		},
	};
}

export default investmenthistory;
