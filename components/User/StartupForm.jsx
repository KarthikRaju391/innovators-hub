import { FormControl } from "baseui/form-control";
import React, { useState } from "react";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";

const StartupForm = ({
	user,
	progress,
	setProgress,
	startupRole,
	load,
	setLoad,
	steps,
}) => {
	const router = useRouter();
	const [startupDetails, setStartupDetails] = useState({
		name: user.entrepreneur?.startup.name || "",
		email: user.entrepreneur?.startup.email || "",
		description: user.entrepreneur?.startup.description || "",
		location: user.entrepreneur?.startup.location || "",
		website: user.entrepreneur?.startup.website || "",
		panNumber: user.entrepreneur?.startup.panNumber || "",
		gstNumber: user.entrepreneur?.startup.gstNumber || "",
	});

	const getProgressIncrement = () => {
		return 100 / steps;
	};

	const handlePrevious = () => {
		// Check if progress is greater than 0 to prevent negative progress values
		if (progress > 0) {
			setProgress(progress - getProgressIncrement());
		}
	};

	const submit4 = async (e) => {
		e.preventDefault();
		const res = await fetch(`/api/users/${user.id}/startup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...startupDetails }),
		});
		if (res.ok) {
			setLoad(false);
			router.back();
		} else {
			setLoad(false);
			alert("User Details not updated");
		}
	};

	return (
		<form
			className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]"
			onSubmit={(e) => submit4(e)}
		>
			<p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">
				Fill Startup Details:
			</p>

			<div className="flex flex-wrap gap-2 grid-cols-2">
				<div className="mx-auto" style={{ width: "18rem" }}>
					<FormControl label={() => "Startup Name: "}>
						<Input
							value={startupDetails.name}
							onChange={(e) =>
								setStartupDetails({ ...startupDetails, name: e.target.value })
							}
							placeholder="Eg. Infotech Solutions"
							autoFocus
							clearable
							required
							clearOnEscape
							disabled={!startupRole}
							overrides={{
								Root: {
									style: ({ $theme }) => ({ width: "18rem" }),
								},
							}}
						/>
					</FormControl>

					<FormControl label={() => "Startup Location:"}>
						<Textarea
							value={startupDetails.location}
							onChange={(e) =>
								setStartupDetails({
									...startupDetails,
									location: e.target.value,
								})
							}
							placeholder={`F-17, Jangpura Extn, Delhi 110014, India`}
							clearOnEscape
							required
							disabled={!startupRole}
						/>
					</FormControl>

					<FormControl label={() => "Startup Description:"}>
						<Textarea
							value={startupDetails.description}
							onChange={(e) =>
								setStartupDetails({
									...startupDetails,
									description: e.target.value,
								})
							}
							placeholder={`About your startup`}
							clearOnEscape
							required
							disabled={!startupRole}
						/>
					</FormControl>
				</div>
				<div className="mx-auto" style={{ width: "18rem" }}>
					<FormControl
						label={() => "Startup PAN Number: "}
						caption={() =>
							"10-digit alphanumeric code issued by  the Income Tax Department of India"
						}
					>
						<Input
							value={startupDetails.panNumber}
							onChange={(e) =>
								setStartupDetails({
									...startupDetails,
									panNumber: e.target.value,
								})
							}
							placeholder="XXXXXXXXXX"
							pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
							clearable
							disabled={!startupRole}
							required
							clearOnEscape
							overrides={{
								Root: {
									style: ({ $theme }) => ({ width: "18rem" }),
								},
							}}
						/>
					</FormControl>

					<FormControl label={() => "Startup Website:"}>
						<Input
							value={startupDetails.website}
							onChange={(e) =>
								setStartupDetails({
									...startupDetails,
									website: e.target.value,
								})
							}
							placeholder={`https://www.example.com`}
							clearOnEscape
							required
							disabled={!startupRole}
						/>
					</FormControl>

					<FormControl label={() => "Startup Email:"}>
						<Input
							value={startupDetails.email}
							onChange={(e) =>
								setStartupDetails({ ...startupDetails, email: e.target.value })
							}
							placeholder={`startup@gmail.com`}
							clearOnEscape
							required
							disabled={!startupRole}
						/>
					</FormControl>

					<FormControl
						label={() => "GSTIN Number: "}
						caption={() =>
							"15-digit alphanumeric code issued by Goods and Services Tax Network of India"
						}
					>
						<Input
							value={startupDetails.gstNumber}
							onChange={(e) =>
								setStartupDetails({
									...startupDetails,
									gstNumber: e.target.value,
								})
							}
							placeholder="XXXXXXXXXXXXXXX"
							pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}$"
							clearable
							disabled={!startupRole}
							required
							clearOnEscape
							overrides={{
								Root: {
									style: ({ $theme }) => ({ width: "18rem" }),
								},
							}}
						/>
					</FormControl>
				</div>
			</div>

			<div className="flex justify-center gap-4 grid-cols-2 flex-wrap  ">
				<Button
					shape={SHAPE.pill}
					isLoading={load}
					title="Go Back"
					onClick={handlePrevious}
				>
					Previous
				</Button>
				<Button
					type="Submit"
					shape={SHAPE.pill}
					isLoading={load}
					title="Submit Form"
				>
					Submit
				</Button>
			</div>
		</form>
	);
};

export default StartupForm;