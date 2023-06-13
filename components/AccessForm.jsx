import React from "react";
import { Select } from "baseui/select";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button, SHAPE } from "baseui/button";
import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import { useRouter } from "next/router";
import Loading from "./Loading";
import EmailAutocomplete from "./EmailAutoComplete";

function AccessForm(props) {
	// handle POST request to set access
	const [allowEmail, setAllowEmail] = React.useState("");
	const [access, setAccess] = React.useState("");
	const [load, setLoad] = React.useState(false);
	const router = useRouter();

	const assignHandleSubmit = async (e) => {
		//submit Allot Access form from here
		e.preventDefault();
		setLoad(true);
		const res = await fetch(`/api/postalService/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: allowEmail, accessType: access[0]?.id }),
		});
		await res.json();
		router.replace(router.asPath);
		props.closeOpen();
	};

	const { data: emails, isLoading } = useSWR("/api/users/", fetcher);

	const emailList = emails?.map((email) => email.email);

	const accessdrop = [
		{ label: "Edit", id: "Edit" },
		{ label: "View", id: "View" },
	];

	if (isLoading) return <Loading />;

	return (
		<form className="mb-[1rem] pb-[1rem]" onSubmit={assignHandleSubmit}>
			<div className="mx-auto" style={{ width: "18rem" }}>
				<FormControl label={() => "Email: "}>
					<EmailAutocomplete emails={emailList} allowEmail={allowEmail} setAllowEmail={setAllowEmail}/>
				</FormControl>

				<FormControl label={() => "Access Type:"}>
					<Select
						options={accessdrop}
						required
						value={access}
						placeholder="Select Access"
						onChange={(params) => setAccess(params.value)}
						overrides={{
							ControlContainer: {
								style: ({ $theme }) => ({
									borderRadius: "10px",
									width: "18rem",
								}),
							},
						}}
					/>
				</FormControl>
			</div>

			<div className="flex justify-center">
				<Button
					type="Submit"
					shape={SHAPE.pill}
					isLoading={load}
					title="Submit Form"
				>
					Grant Access
				</Button>
			</div>
		</form>
	);
}

export default AccessForm;
