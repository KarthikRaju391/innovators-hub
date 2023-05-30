import React, { useContext, useEffect } from "react";
import SubmitContext from "../context/SubmitContext";
import { useRouter } from "next/router";

const ProjectForm = ({ edit = false, data = {} }) => {
	const { updated, updateProject, project, setUpdated } =
		useContext(SubmitContext);

	const router = useRouter();

	useEffect(() => {
		if (edit) {
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
			}
		} else {
			updateProject({
				projectName: "",
				projectDescription: "",
				projectImages: [],
			});
		}
	}, []);

	const addProject = async () => {
		let res;
		if (edit) {
			res = await fetch(`/api/project/${data.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(project),
			});
		} else {
			res = await fetch("/api/project", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(project),
			});
		}
		return await res.json();
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		addProject();
	};

	const handleReport = async () => {
		if (edit) {
			if (data.projectReport.length > 0) {
				updateProject({
					projectReport: data.projectReport,
				});
				router.push(`/user/startup/project/${data.id}/editReport`);
			} else {
				router.push(`/user/startup/project/pdfGenerator`);
			}
		} else {
			if (project.projectName && project.projectDescription) {
                const {project} = await addProject();
				router.push(`/user/startup/project/${project.id}/editReport`);
			} else {
				alert("Please fill out the form before adding a project report");
			}
		}
	};

	return (
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
				onChange={(e) => updateProject({ projectDescription: e.target.value })}
			/>
			<label htmlFor="projectImage">Project Image</label>
			<input type="file" name="projectImage" id="projectImage" />
			<button onClick={handleReport} type="button">
				{edit || data?.projectReport?.length > 0
					? "Edit Project Report"
					: "Add Project Report"}
			</button>
			<button type="submit">
				{edit ? "Update Project" : "Create Project"}
			</button>
		</form>
	);
};

export default ProjectForm;
