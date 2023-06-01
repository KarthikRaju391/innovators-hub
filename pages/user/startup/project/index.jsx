import { useEffect, useState } from "react";
import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import { useRouter } from "next/router";
import { useContext } from "react";
import SubmitContext from "../../../../context/SubmitContext";
import ProjectForm from "../../../../components/ProjectForm";

function createProject({ data }) {
	// const { updated, updateProject, project } = useContext(SubmitContext);

	const router = useRouter();

	const handleEdit = (id) => {
		router.push(`/user/startup/project/${id}/edit`);
	};

	const handleDelete = async (id) => {
		const res = await fetch(`/api/project/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		await res.json();
		router.replace(router.asPath);
	};

	return (
		<>
			<LoginHeader />
			<BackButton />
			<h2 className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				Create Project
			</h2>
			<ProjectForm />

			<div>
				{data &&
					data.map((project) => (
						<>
							<p onClick={() => handleEdit(project.id)} key={project.id}>
								{project.name}
								<span>({project.startup.name})</span>
							</p>
							<button onClick={() => handleDelete(project.id)}>Delete</button>
						</>
					))}
			</div>
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
