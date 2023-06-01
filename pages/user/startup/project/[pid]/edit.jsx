import { useRouter } from "next/router";
import ProjectForm from "../../../../../components/ProjectForm";
import LoginHeader from "../../../../../components/LoginHeader";
import BackButton from "../../../../../components/BackButton";

export default function Edit({ project }) {
	console.log(project);
	const router = useRouter();
	const { pid } = router.query;

	return (
		<>
			<LoginHeader />
			<BackButton />
			<h2 className="select-none mt-[1rem] pt-[1rem] text-3xl cursor-default text-center">
			Edit Project
			</h2>
			<p className="text-center mb-[1rem] pb-[1rem]">Project ID: {pid}</p>
			<ProjectForm edit data={project} />
		</>
	);
}

export async function getServerSideProps(context) {
	const res = await fetch(
		`${process.env.NEXT_APP_URL}/api/project/${context.params.pid}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: context.req.headers.cookie,
			},
		}
	);
	const project = await res.json();

	return {
		props: {
			project: project,
		},
	};
}
