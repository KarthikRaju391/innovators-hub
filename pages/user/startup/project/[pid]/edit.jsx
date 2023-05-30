import { useRouter } from "next/router";
import ProjectForm from "../../../../../components/ProjectForm";

export default function Edit({ project }) {
	console.log(project);
	const router = useRouter();
	const { pid } = router.query;

	return (
		<div>
			<h1>Edit Project</h1>
			<p>Project ID: {pid}</p>
			<ProjectForm edit data={project} />
		</div>
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
