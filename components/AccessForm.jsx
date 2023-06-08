import React from "react";
import { Select } from "baseui/select";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";

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

	const accessdrop = [
		{ label: "Edit", id: "Edit" },
		{ label: "View", id: "View" },
	];

	return (
		<form className="mb-[1rem] pb-[1rem]" onSubmit={assignHandleSubmit}>
			<div className="mx-auto" style={{ width: "18rem" }}>
				<FormControl label={() => "Email: "}>
					<Input
						value={allowEmail}
						onChange={(e) => setAllowEmail(e.target.value)}
						placeholder="Eg. suresh@gmail.com"
						clearable
						required
						type="email"
						pattern='^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
						clearOnEscape
						overrides={{
							Root: {
								style: ({ $theme }) => ({ width: "18rem" }),
							},
						}}
					/>
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
