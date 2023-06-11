import React, { useEffect, useState } from "react";
import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import { useRouter } from "next/router";
import { useContext } from "react";
import SubmitContext from "../../../../context/SubmitContext";
import ProjectForm from "../../../../components/ProjectForm";

function createProject({ data }) {
	// const { updated, updateProject, project } = useContext(SubmitContext);

	const router = useRouter();
	const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }


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
			<p className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				Create Project
			</p>
			<ProjectForm />

			<div className="border-2 border-zinc-800 rounded-3xl flex flex-wrap gap-4 mx-[2rem] px-[2rem] mt-4 min-h-[10rem] py-[2rem]">
				{data &&
					data.map((project) => (
						<div className="border-2 h-fit p-2 rounded-lg min-w-[15rem] min-h-[5rem] cursor-pointer select-none" title={`View project ${project.name || "-"}`} >
							<div className="" key={project.id} onClick={e=>router.push(`/user/startup/project/${project.id}/about`)}>
								<p>{project.name || "-"}</p>
								<p className="text-xs">{project.startup.name || "-"}</p>
							</div>
							<div className="flex justify-end">
								<button className="text-blue-600 mr-3 font-semibold" onClick={() => handleEdit(project.id)}>Edit</button>
								<button className="text-red-600 font-semibold" onClick={() => handleDelete(project.id)}>Delete</button>
							</div>
						</div>
					))}
			</div>
			<div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]" />
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
