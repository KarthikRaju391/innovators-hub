import { useState } from "react";
import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";

function createProject() {
	const [projectName, setProjectName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [projectImages, setProjectImages] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const projectData = {
			projectName,
			projectDescription,
			projectImages,
		};

		const res = await fetch("/api/project", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(projectData),
		});

		await res.json();
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
					value={projectName}
					onChange={(e) => setProjectName(e.target.value)}
				/>
				<label htmlFor="projectDescription">Project Description</label>
				<input
					type="text"
					name="projectDescription"
					id="projectDescription"
					value={projectDescription}
					onChange={(e) => setProjectDescription(e.target.value)}
				/>
				<label htmlFor="projectImage">Project Image</label>
				<input type="file" name="projectImage" id="projectImage" />
				<button type="button">Add Project Report</button>
				<button type="submit">Create Project</button>
			</form>
		</>
	);
}

export default createProject;
