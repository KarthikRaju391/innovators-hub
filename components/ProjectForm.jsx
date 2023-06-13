import React, { useContext, useEffect, useState } from "react";
import SubmitContext from "../context/SubmitContext";
import { useRouter } from "next/router";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import FileInput from "../components/FileInput";
import {
	MdOutlineDeleteForever,
	MdOutlineTipsAndUpdates,
} from "react-icons/md";
import { Button, SHAPE } from "baseui/button";
import { HiDocumentAdd, HiPencilAlt } from "react-icons/hi";
import { RxUpdate } from "react-icons/rx";
import FileUpload from "./FileUpload";

const ProjectForm = ({ edit = false, data = {} }) => {
	const { updated, updateProject, project, setUpdated } =
		useContext(SubmitContext);

	const router = useRouter();
	const [projectImages, setProjectImages] = useState(data.image || []);
	const [load, setLoad] = React.useState(false);

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
		setLoad(true);
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
				const { project } = await addProject();
				router.push(`/user/startup/project/${project.id}/editReport`);
			} else {
				alert("Please fill out the form before adding a project report");
			}
		}
		setLoad(false);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center justify-center"
		>
			<label htmlFor="projectName" className="font-semibold">
				Project Name
			</label>
			<Input
				name="projectName"
				id="projectName"
				value={project.projectName}
				onChange={(e) => updateProject({ projectName: e.target.value })}
				placeholder="Eg. Vertical Gardening System"
				autoFocus
				clearable
				required
				clearOnEscape
				overrides={{
					Root: {
						style: ({ $theme }) => ({ width: "18rem" }),
					},
				}}
			/>
			<label htmlFor="projectDescription" className="font-semibold mt-4">
				Project Description
			</label>
			<div className="w-[18rem]">
				<Textarea
					name="projectDescription"
					id="projectDescription"
					value={project.projectDescription}
					onChange={(e) =>
						updateProject({ projectDescription: e.target.value })
					}
					placeholder={`Reduce the space required by plants to grow by growing them on walls.`}
					clearOnEscape
				/>
			</div>
			{/* <input
				type="text"
				name="projectDescription"
				id="projectDescription"
				value={project.projectDescription}
				onChange={(e) => updateProject({ projectDescription: e.target.value })}
			/> */}
			<label htmlFor="projectImage" className="font-semibold mt-4">
				Project Image
			</label>
			{/* <input type="file" name="projectImage" id="projectImage" /> */}
			<div className="mx-auto" style={{ width: "18rem" }}>
				<FileUpload
					productImages={projectImages}
					setProductImages={setProjectImages}
				/>
				{projectImages?.map((image, i) => (
					<div key={i} className="flex justify-between items-center">
						<img src={image} alt="Product Image" width="100" height="100" />
						<MdOutlineDeleteForever
							onClick={() =>
								setProjectImages(
									projectImages.filter((img, index) => index !== i)
								)
							}
							className="cursor-pointer"
							size={30}
						/>
					</div>
				))}
			</div>
			<div className="flex gap-4">
				<Button
					type="button"
					onClick={handleReport}
					isLoading={load}
					overrides={{
						BaseButton: {
							style: ({ $theme }) => ({
								backgroundColor: $theme.colors.accent500,
							}),
						},
					}}
					startEnhancer={
						edit || data?.projectReport?.length > 0 ? (
							<HiPencilAlt style={{ fontSize: "1.5rem" }} />
						) : (
							<HiDocumentAdd style={{ fontSize: "1.5rem" }} />
						)
					}
				>
					{edit || data?.projectReport?.length > 0
						? "Edit Project Report"
						: "Add Project Report"}
				</Button>

				<Button
					type="button"
					onClick={handleReport}
					isLoading={load}
					overrides={{
						BaseButton: {
							style: ({ $theme }) => ({
								backgroundColor: $theme.colors.accent500,
							}),
						},
					}}
					startEnhancer={
						edit || data?.projectReport?.length > 0 ? (
							<RxUpdate style={{ fontSize: "1.5rem" }} />
						) : (
							<MdOutlineTipsAndUpdates style={{ fontSize: "1.5rem" }} />
						)
					}
				>
					{edit ? "Update Project" : "Create Project"}
				</Button>
			</div>
		</form>
	);
};

export default ProjectForm;
