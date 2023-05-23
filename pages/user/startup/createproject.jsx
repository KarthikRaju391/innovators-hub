import { useEffect, useState } from "react";
import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";
import { useRouter } from "next/router";
import { useContext } from "react";
import SubmitContext from "../../../context/SubmitContext";

function createProject({ data }) {
	const { submitted, updateProject, project } = useContext(SubmitContext);
	const [updated, setUpdated] = useState(false);

	const router = useRouter();

	useEffect(() => {
		setUpdated(false);
		if (data) {
			updateProject({
				projectName: project.projectName ? project.projectName : data.name,
				projectDescription: project.projectDescription
					? project.projectDescription
					: data.description,
				projectImages: project.projectImages
					? project.projectImages
					: data.image,
				projectReport:
					project.projectReport.length > 0
						? project.projectReport
						: data.projectReport,
			});

			setUpdated(true);
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/project", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(project),
		});

		await res.json();
	};

	const handleReport = () => {
		// data.projectReport && updateProject({ projectReport: data.projectReport });
		router.push("/user/startup/pdf2");
	};

	return (
		<>
			<LoginHeader />
			<BackButton />
			<h2 className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				Create Project
			</h2>
			{/* create a basic form to have input fields with labels for projectName, projectDescription, and an upload image field along with a button to add project report */}
			<form
				onSubmit={handleSubmit}
				className="flex flex-col items-center justify-center"
			>
				<label htmlFor="projectName">Project Name</label>
				<input
					type="text"
					name="projectName"
					id="projectName"
					value={project.projectName}
					onChange={(e) => updateProject({ projectName: e.target.value })}
				/>
				<label htmlFor="projectDescription">Project Description</label>
				<input
					type="text"
					name="projectDescription"
					id="projectDescription"
					value={project.projectDescription}
					onChange={(e) =>
						updateProject({ projectDescription: e.target.value })
					}
				/>
				<label htmlFor="projectImage">Project Image</label>
				<input type="file" name="projectImage" id="projectImage" />
				<button onClick={handleReport} type="button">
					{(data && data.projectReport !== null) || submitted
						? "Edit Project Report"
						: "Add Project Report"}
				</button>
				<button type="submit">
					{updated ? "Update Project" : "Create Project"}
				</button>
			</form>
		</>
	);
}

export async function getServerSideProps(context) {
	const res = await fetch(`${process.env.NEXT_APP_URL}/api/project/`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Cookie: context.req.headers.cookie,
		},
	});
	const project = await res.json();

	return {
		props: {
			data: project,
		},
	};
}

export default createProject;
